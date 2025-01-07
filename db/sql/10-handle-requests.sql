create or alter procedure [web].[handle_request] @text nvarchar(max)
as
declare @retval int, @response nvarchar(max);

/* Create the prompt for the LLM */
declare @p nvarchar(max) = 
json_object(
    'messages': json_array(
        json_object(
            'role':'system',
            'content':'
                You are a SQL Server database assistant. You answer the questions providing the correct T-SQL query to get the result.
                This is the database table you can use: 

                create table dbo.samples
                (
                    [id] int identity primary key,
                    [name] nvarchar(100) not null,
                    [description] nvarchar(max) not null,
                    [created_on] datetime2(0) not null,
                    [updated_on] datetime2(0) not null
                )
                
                The use question is provided in the next message. If the user question cannot be answered using the dbo.samples table and using a T-SQL query only, you should respond with an empty string.
            '
        ),
        json_object(
            'role':'user',
            'content': + @text
        )
    ),    
    'temperature': 0.2,
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
---select @p

/* Send request to LLM */
begin try
    exec @retval = sp_invoke_external_rest_endpoint
        @url = 'https://dm-open-ai-3.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-08-01-preview',
        @headers = '{"Content-Type":"application/json"}',
        @method = 'POST',
        @credential = [https://dm-open-ai-3.openai.azure.com/],
        @timeout = 120,
        @payload = @p,
        @response = @response output;
end try
begin catch
    select 'REST' as [error], ERROR_NUMBER() as [error_code], ERROR_MESSAGE() as [error_message]
    return
end catch
--select @response

if @retval != 0 begin
    select 'OpenAI' as [error], @retval as [error_code], @response as [response]
    return
end

declare @refusal nvarchar(max) = (select coalesce(json_value(@response, '$.result.choices[0].refusal'), ''));

if @refusal != '' begin
    select 'OpenAI/Refusal' as [error], @refusal as [refusal], @response as [response]
    return
end

select 
    sr.*
from 
    openjson(@response, '$.result.choices[0].message') with (
        content nvarchar(max) '$.content'
    ) m
cross apply
    openjson(m.content, '$.samples') with (
        response_type varchar(10),
        sql_query nvarchar(max)
    ) as sr
GO
