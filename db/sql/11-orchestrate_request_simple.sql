create or alter procedure [web].[orchestrate_request] 
@text nvarchar(max),
@result_type varchar(50) output,
@result_query nvarchar(max) output,
@error nvarchar(max) output
as
declare @retval int, @response nvarchar(max);

/* 
    Create the prompt for the LLM 
*/
declare @p nvarchar(max) = 
json_object(
    'messages': json_array(
        json_object(
            'role':'system',
            'content':'
                You are a SQL Server database assistant. You answer the questions providing the correct T-SQL query to get the result. The user question is provided in the next message. 

                This is the database table you can use: 

                create table dbo.samples
                (
                    [id] int identity primary key,
                    [name] nvarchar(100) not null, --the name or title of the sample
                    [description] nvarchar(max) not null, -- the description of the sample
                    [notes] nvarchar(max) null, -- additional notes about the sample
                    [details] json null,  -- all additional details, in JSON format, about the sample like authors, tags, etc.
                    [created_on] datetime2(0) not null,
                    [updated_on] datetime2(0) not null
                )
                
                The use question is provided in the next message. If the user question cannot be answered using the dbo.samples table and using a T-SQL query only, you should respond with an empty string.
                Unless otherwise specifed by the user, return the top 10 results if you can. Never return more than 50 rows. Do not use semicolon to terminate the T-SQL statement.               
                Only return the following columns: id int, [name] nvarchar(100), [description] nvarchar(max), notes nvarchar(max), details json, distance_score float.
                You can generate only SELECT statements. If the user is asking something that will generate INSERT, UPDATE, DELETE, CREATE, ALTER or DROP statement, refuse to generate the query.
                If you need to use a LIKE operator in the query, they don''t generate the query at all and return an empty string
            '
        ),
        json_object(
            'role':'user',
            'content': + @text
        )        
    ),
    'temperature': 0.4,
    'frequency_penalty': 0,
    'presence_penalty': 0,    
    'stop': null
);

declare @js nvarchar(max) = N'{
    "type": "json_schema",
    "json_schema": {
        "name": "samples",
        "strict": true,
        "schema": {
            "type": "object",
            "properties": {
                "samples": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "response_type": {
                                "type": "string",
                                "description": "SQL if a SQL query is provided, NONE if no SQL query is provided"
                            },                            
                            "sql_query": {
                                "type": "string",
                                "description": "SQL query to get the result"
                            }
                        },
                        "required": [
                            "response_type",                            
                            "sql_query"
                        ],
                        "additionalProperties": false
                    }
                }
            },
            "required": ["samples"],
            "additionalProperties": false
        }        
    }        
}'

set @p = json_modify(@p, '$.response_format', json_query(@js))
--select @p

/* Send request to LLM */
begin try
    exec @retval = sp_invoke_external_rest_endpoint
        @url = '$OPENAI_URL$/openai/deployments/$OPENAI_CHAT_DEPLOYMENT_NAME$/chat/completions?api-version=2024-08-01-preview',        
        @headers = '{"Content-Type":"application/json"}',
        @method = 'POST',
        @credential = [$OPENAI_URL$],
        @timeout = 120,
        @payload = @p,
        @response = @response output
        with result sets none;
end try
begin catch
    set @error = json_object('error':'Orchestrator:REST', 'error_code':ERROR_NUMBER(), 'error_message':ERROR_MESSAGE())
    return -1
end catch
--select @response

if @retval != 0 begin
    set @error = json_object('error':'Orchestrator:OpenAI', 'error_code':@retval, 'error_message':@response)
    return -1
end

declare @refusal nvarchar(max) = (select coalesce(json_value(@response, '$.result.choices[0].refusal'), ''));

if @refusal != '' begin
    set @error = json_object('error':'Orchestrator:OpenAI/Refusal', 'refusal':@refusal, 'response':@response)
    return -1
end

select top(1)
    @result_type = sr.response_type,
    @result_query = sr.sql_query
from 
    openjson(@response, '$.result.choices[0].message') with (
        content nvarchar(max) '$.content'
    ) m
cross apply
    openjson(m.content, '$.samples') with (
        response_type varchar(10),
        sql_query nvarchar(max)
    ) as sr

if (@result_type = 'NONE') begin
    set @result_type = 'SEMANTIC'
    set @result_query = @text
end

return 0
GO
