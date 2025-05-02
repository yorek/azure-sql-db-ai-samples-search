-- Server: localhost\ctp15

-- Let's take a look at our data

select * from dbo.samples



-- I have generated embeddings already for the data in my database

select 
    s.id,
    s.name,
    s.description,
    e1.embedding
from
    dbo.samples s
left outer join
    dbo.samples_embeddings e1 on s.id = e1.id
where
    [url]= 'https://github.com/yorek/azure-sql-db-ai-samples-search'
go



-- How? First of all I need to point to an embedding model I want to use

if exists(select * from sys.external_models where [name] = 'Text3Small')
begin
    drop external model Text3Small;
end
create external model Text3Small
with ( 
      location = 'https://dm-open-ai-3.openai.azure.com/openai/deployments/text-embedding-3-small/embeddings?api-version=2024-08-01-preview',
      credential = [https://dm-open-ai-3.openai.azure.com/],
      api_format = 'Azure OpenAI',
      model_type = embeddings,
      model = 'embeddings'
);
go



-- Now I can use the new ai_generate_embeddings function

declare @qv vector(1536) = ai_generate_embeddings('Cozy ai kitchen sample' model Text3Small);
select @qv;



-- Let's add a new example. The stored procedure will use ai_generate_embeddings
-- to calculate embedding for the sample description, notes and details

exec dbo.add_sample '{
    "name": "Cozy AI Kitchen Sample",
    "description": "Sample used in the AI Kitchen show",
    "notes": "The sample show how to use the new AI functions available in SQL Server 2025 to use any embedding model that you may like, be it from OpenAI or Open Source",
    "details": {
        "author": "Davide Mauri",
        "languages": [
            "T-SQL"
        ],
        "license": "MIT",
        "services": [
            "Azure SQL"            
        ],
        "tags": ["embedding models", "external models", "ai_generate functions", "mixedbread", "cohere", "bring your own model", "BYOM"]
    },
    "url": "https://localhost/sample/2025-05-02"
}';



-- Let's take a look at the inserted sample

select * from dbo.samples where [url] = 'https://localhost/sample/2025-05-02'
go



-- If description is too long, I can use the new ai_generate_chunks function
-- to chunk the data in overlapping segments and then use those
-- for generating embeddings

select 
    s.id,
    s.name,
    c.*
from 
    dbo.samples s
cross apply
    ai_generate_chunks(source = s.notes, chunk_type = N'FIXED', chunk_size = 100, overlap = 10) c
where 
    [url] = 'https://localhost/sample/2025-05-02'
go



-- Now that we have embedding generated, let's run a semantic similarity query
-- using vector_distance function to find the most similar embeddings to 
-- the given query 

declare @qv vector(1536) = ai_generate_embeddings('Cozy ai kitchen sample' model Text3Small);
select top(10) 
    s.id,
    s.name,
    s.url,
    vector_distance('cosine', ne.[embedding], @qv) as cosine_distance
from 
    dbo.samples s
left join
    dbo.samples_embeddings ne on s.id = ne.id
order by 
    cosine_distance asc;
go



-- Cool! Now lets try to find something more complicated

declare @qv vector(1536) = ai_generate_embeddings('Code sample where use my own model for embeddings, for example I want to use cohere embedding model' model Text3Small);
select top(3) 
    s.id,
    s.name,
    s.url,
    vector_distance('cosine', ne.[embedding], @qv) as cosine_distance
from 
    dbo.samples s
left join
    dbo.samples_embeddings ne on s.id = ne.id
order by 
    cosine_distance asc;
go



-- We need to extend the search to description and details too

declare @qv vector(1536) = ai_generate_embeddings('Code sample where use my own model for embeddings, for example I want to use cohere embedding model' model Text3Small);
select top(3) 
    s.id,
    s.name,
    s.url,
    least(
        vector_distance('cosine', e.[embedding], @qv), 
        vector_distance('cosine', ne.[embedding], @qv), 
        vector_distance('cosine', de.[embedding], @qv) 
    ) as cosine_distance
from 
    dbo.samples s
inner join    
    dbo.samples_embeddings e on e.id = s.id
left join
    dbo.samples_notes_embeddings ne on e.id = ne.id
left join
    dbo.samples_details_embeddings de on e.id = de.id    
order by 
    cosine_distance asc;
go



-- What if I want to call a more powerful model, like GTP4o or Phi4?

declare @retval int, @response nvarchar(max);
declare @p nvarchar(max) = '{"messages":[{"role":"user","content":"tell me a very short story about a cozy ai kitchen"}]}';
exec @retval = sp_invoke_external_rest_endpoint
    @url = 'https://dm-open-ai-3.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-08-01-preview',        
    @headers = '{"Content-Type":"application/json"}',
    @method = 'POST',
    @credential = [https://dm-open-ai-3.openai.azure.com/],
    @timeout = 120,
    @payload = @p,
    @response = @response output
    with result sets none;
select json_value(@response, '$.result.choices[0].message.content')
go


-- I can now create a complete RAG and Agentic RAG solution, right from SQL:
-- 1) Decide if the question is better answered using Semantic Search or SQL query
-- 2a) If Semantic Search: generate embeddings and run vector_distance query
-- 2b) If SQL query: generate and execute the SQL query
-- 2c) A mix of both
-- 3) Use the result to provide the prompt to the LLM for completing the RAG pattern
-- 4) Send the prompt to the LLM along with the exepted structured output defintion
-- 5) Join the LLM result back to the original table and return the result

exec [web].[find_samples] 'cohere embedding samples shown in the cozy ai kitchen episode with Davide'
go

exec [web].[find_samples] 'samples published in april 2025'
go


exec [web].[find_samples] 'sample show in the Cozy Kitchen show with langchain'
go
