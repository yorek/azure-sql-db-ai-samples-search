create or alter procedure [web].[find_samples] @text nvarchar(max), @k int = 50
as
declare @cached_response nvarchar(max)
declare @retval int, @response nvarchar(max);

/* Get the embedding for the requested text */
declare @qv vector(1536)
exec @retval = web.get_embedding @text, @qv output
if (@retval != 0) return;

/* Check in the semantic cache to see if a similar question has been already answered */
delete from [dbo].[semantic_cache] where query_date < dateadd(hour, -1, sysdatetime())
select top(1) *, vector_distance('cosine', @qv, embedding) as d 
into #c 
from [dbo].[semantic_cache] order by d
select @cached_response = response from #c where d < 0.3

if (@cached_response is not null)
begin
    set @response = @cached_response
end 
else 
begin
    /* Find the samples most similar to the requested topic */
    drop table if exists #s;
    select top(@k) 
        s.id, [name], [description], [url], [notes], [details],
        least(
            vector_distance('cosine', e.[embedding], @qv), 
            vector_distance('cosine', ne.[embedding], @qv), 
            vector_distance('cosine', de.[embedding], @qv) 
        ) as distance_score
    into
        #s
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
    --select * from #s

    /* Prepare the JSON string with relevant results to be sent to LLM for evaluation */
    declare @s nvarchar(max) = (
        select 
            [id], [name], [description], [notes], [details], 
            cast((1-distance_score)*100 as int) as similiarity_score
        from #s 
        where distance_score < 0.85
        order by distance_score for json path
    )
    --select @s

    /* Create the prompt for the LLM */
    declare @p nvarchar(max) = 
    json_object(
        'messages': json_array(
            json_object(
                'role':'system',
                'content':'
                    You as a system assistant who helps users find code samples the user can use to learn the topic they are interested in.
                    Samples are provided in an assitant message using a JSON Array with the following format: [{id, name, description, note, details, similiarity_score}]. 
                    Put in sample_summary output property a markdown short summary of the sample using the provided description, notes, and details. 
                    Use only the provided samples to help you answer the user''s question.
                    Only return samples that are for sure related to the user''s question.
                    If there are related links or repos in the details, include them in the short summary. Include links only if they are related to the sample and if they are available in the note or details of that sample.               
                    If the question cannot be answered by the provided samples, you must say that you don''t know.
                    If asked question is about topics you don''t know, answer that you don''t know.
                '
            ),
            json_object(
                'role':'assistant',
                'content': 'The available samples are the following:'
                ),
            json_object(
                'role':'assistant',
                'content': coalesce(@s, 'No samples found for the requested search text.')
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
                                "result_position": {
                                    "type": "number"
                                },
                                "id": {
                                    "type": "number"
                                },
                                "sample_summary": {
                                    "type": "string"
                                },                            
                                "thoughts": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "id",                            
                                "sample_summary",                            
                                "thoughts",
                                "result_position"
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
            @url = 'https://dm-open-ai-3.openai.azure.com/openai/deployments/$OPENAI_CHAT_DEPLOYMENT_NAME$/chat/completions?api-version=2024-08-01-preview',
            @headers = '{"Content-Type":"application/json"}',
            @method = 'POST',
            @credential = [https://dm-open-ai-3.openai.azure.com],
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

    insert into dbo.semantic_cache (query, embedding, query_date, response) 
    values (@text, @qv, sysdatetime(), @response)
end

select 
    s.id,
    sr.result_position,
    s.[name],
    s.[description],
    sr.sample_summary,
    sr.thoughts,
    s.[url]--,
    --s.distance_score
from 
    openjson(@response, '$.result.choices[0].message') with (
        content nvarchar(max) '$.content'
    ) m
cross apply
    openjson(m.content, '$.samples') with (
        id int,
        result_position int,
        sample_summary nvarchar(max),
        thoughts nvarchar(max)
    ) as sr
inner join
    dbo.samples as s on s.id = sr.id
order by
    sr.result_position
GO
