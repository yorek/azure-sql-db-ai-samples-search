create or alter procedure [dbo].[find_samples] @text nvarchar(max), @k int = 50
as
declare @qv vector(1536)
exec web.get_embedding @text, @qv output

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

declare @s nvarchar(max) = (select [id], [name], [description], [notes], [details] from #s for json path)
--select @s

declare @p nvarchar(max) = 
json_object(
    'messages': json_array(
        json_object(
            'role':'system',
            'content':'
                You as a system assistant who helps users find code samples the user can use to learn the topic they are interested in.
                Samples are provided in an assitant message using a JSON Array with the following format: [{id, name, description, note, details}]. 
                Use the provided samples to help you answer the user''s question.
                Put int sample_summary output property a short summary of the sample using the provided description, notes, and details.
                If the question is not answered by the samples, you can say that you don''t know.
                If users ask about topics you don''t know, answer that you don''t know.
                Return up to 10 samples if you can.
            '
        ),
        json_object(
            'role':'assistant',
            'content': 'The available samples are: ' + @s              
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

declare @retval int, @response nvarchar(max);
exec @retval = sp_invoke_external_rest_endpoint
    @url = 'https://dm-open-ai-3.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-08-01-preview',
    @headers = '{"Content-Type":"application/json"}',
    @method = 'POST',
    @credential = [https://dm-open-ai-3.openai.azure.com],
    @timeout = 120,
    @payload = @p,
    @response = @response output;
--select @response

declare @refusal nvarchar(max) = (select coalesce(json_value(@response, '$.result.choices[0].refusal'), ''));

if @refusal != '' begin
    select 'I don''t know' as [error]
    return
end

select 
    s.id,
    sr.result_position,
    s.[name],
    s.[description],
    sr.sample_summary,
    sr.thoughts,
    s.[url],
    s.distance_score
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
    #s as s on s.id = sr.id
order by
    sr.result_position
GO
