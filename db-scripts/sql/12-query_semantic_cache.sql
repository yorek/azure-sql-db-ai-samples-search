/* 
    Check in the semantic cache to see if a similar question has been already answered 
*/
create or alter procedure web.query_semantic_cache
@qv vector(1536),
@cached_response nvarchar(max) output
as

delete from [dbo].[semantic_cache] where query_date < dateadd(hour, -1, sysdatetime())

select top(1) 
    *, 
    vector_distance('cosine', @qv, embedding) as d 
into 
    #c 
from 
    [dbo].[semantic_cache] order by d;

--select * from #c

select top(1) 
    @cached_response = response 
from 
    #c 
where 
    d < 0.25
