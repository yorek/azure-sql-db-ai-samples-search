declare @text nvarchar(max);

--set @text = 'return the samples used by davide at orlando live 360 conference in 2024';
--set @text = 'return the samples showing hybrid RAG created in 2024 or 2025 by davide and presented at orlando';
--set @text = 'return the samples created by muazma';
--set @text = 'samples showing hybrid RAG';
--set @text = 'the sample on hybrid search';
--set @text = 'samples on hybrid search';
--set @text = 'samples on hybrid search created in 2025';
--set @text = 'create a new table named dbo.test';
--set @text = 'how many customers there are in the customers table?';
--set @text = 'Find all the hybrid search samples created after 2025';
set @text = 'Show me the latest samples'

declare @retval int, @response nvarchar(max);

/* 
    Create the prompt for the LLM using few-shots prompt to show how to 
    get embeddings and to use the new vector_distance function
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
                
                Any time search into "details, "notes" and "description" columns is needed, you must use the following steps:

                First, generate the embedding vector for the provided question using the following T-SQL query. ''<search text'' must be generating taking the relevant part from the user question.

                declare @retval int, @qv vector(1536)
                exec @retval = web.get_embedding ''<search text>'', @qv output
                if (@retval != 0) throw 50000, ''Error in getting the embedding'',1;

                The vectors for details, notes and description columns are stored in the following tables: 

                - samples_embeddings: vectors for the description column
                - samples_notes_embeddings: vectors for the notes column
                - samples_details_embeddings: vectors for the details column

                Then, use the following T-SQL query to search the text in the table, adding the appropriate where clause to filter the results if needed:

                select top(@k) 
                    s.id, [name], [description], [notes], [details],
                    least(
                        vector_distance(''cosine'', e.[embedding], @qv), 
                        vector_distance(''cosine'', ne.[embedding], @qv), 
                        vector_distance(''cosine'', de.[embedding], @qv) 
                    ) as distance_score
                from 
                    dbo.samples s
                inner join    
                    dbo.samples_embeddings e on e.id = s.id
                left join
                    dbo.samples_notes_embeddings ne on e.id = ne.id
                left join
                    dbo.samples_details_embeddings de on e.id = de.id    
                order by 
                    distance_score asc

                When search in description, details and notes columns is not needed then you must use the following query:

                select top(@k) 
                    s.id, [name], [description], [notes], [details],
                    0.0 as distance_score
                from 
                    dbo.samples s

                In any case to use the LIKE operator on details column, the column must be converted to NVARCHAR(MAX) first:

                CAST([details] AS NVARCHAR(MAX)) LIKE ''search text''

                The use question is provided in the next message. If the user question cannot be answered using the dbo.samples table and using a T-SQL query only, you should respond with an empty string.
                Return the top 10 results if you can. Do not use semicolon to terminate the T-SQL statement.                
                Only return the following columns: id int, [name] nvarchar(100), [description] nvarchar(max), notes nvarchar(max), details json, distance_score float.
                You can generate only SELECT statements. If the user is asking something that will generate INSERT, UPDATE, DELETE, CREATE, ALTER or DROP statement, refuse to generate the query.

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
        @url = 'https://dm-open-ai-3.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-08-01-preview',
        @headers = '{"Content-Type":"application/json"}',
        @method = 'POST',
        @credential = [https://dm-open-ai-3.openai.azure.com],
        @timeout = 120,
        @payload = @p,
        @response = @response output;
end try
begin catch
    select 'Orchestrator:REST' as [error], ERROR_NUMBER() as [error_code], ERROR_MESSAGE() as [error_message]
end catch

if @retval != 0 begin
    select 'Orchestrator:OpenAI' as [error], @retval as [error_code], @response as [response]
end

declare @refusal nvarchar(max) = (select coalesce(json_value(@response, '$.result.choices[0].refusal'), ''));

if @refusal != '' begin
    select 'Orchestrator:OpenAI/Refusal' as [error], @refusal as [refusal], @response as [response]
end

/* 
    Process the structured output answer 
*/
drop table if exists #s;
select top(1)
    *
into
    #s
from 
    openjson(@response, '$.result.choices[0].message') with (
        content nvarchar(max) '$.content'
    ) m
cross apply
    openjson(m.content, '$.samples') with (
        response_type varchar(10),
        sql_query nvarchar(max)
    ) as sr;

/*
    Show orchestration result and generated SQL query if there is one (it should!)
*/
declare @sql nvarchar(max), @rt varchar(10)
select top(1) @rt=response_type,  @sql=sql_query from #s;
print @sql;

/*
    Execute the query
*/
if (@rt = 'SQL') begin
    drop table if exists #r;
    create table #r (id int, [name] nvarchar(100), [description] nvarchar(max), notes nvarchar(max), details json, distance_score float);
    insert into #r exec sp_executesql @stmt = @sql;
    select s.*, r.distance_score from #r r inner join dbo.samples s on r.id = s.id order by distance_score;
end else begin
    select * from #s;
end