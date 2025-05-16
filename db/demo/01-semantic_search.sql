declare @response nvarchar(max);
declare @retval int;
declare @samples nvarchar(max)
declare @error nvarchar(max)

declare @text nvarchar(1000) =
    --'find the samples created in 2025';
    --'show the last 5 samples';
    --'samples used by Davide at FabCon 2025';
    --'langchain samples';
    --'agentic rag demos';

declare @qv vector(1536)
exec @retval = web.get_embedding @text, @qv output, @error output with result sets none 
if (@retval != 0) begin
    select @error as error; 
    return;
end

select top(10) 
    s.id,
    s.name,
    s.created_on,
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