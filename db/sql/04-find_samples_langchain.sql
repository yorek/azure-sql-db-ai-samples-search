create or alter procedure [web].[find_samples_langchain] @text nvarchar(1000), @k int = 10
as
set nocount on;
declare @response nvarchar(max), @cached_response nvarchar(max);
declare @retval int;
declare @samples nvarchar(max)
declare @error nvarchar(max)

if trim(@text) = '' return;

-- Get the embedding for the requested text
declare @qv vector(1536)
exec @retval = web.get_embedding @text, @qv output, @error output with result sets none 
if (@retval != 0) begin
    select @error as error; 
    return;
end

-- Semantic Search
select top(@k) 
    s.id,
    [name], [description], [notes], [details], 
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
    cosine_distance asc



