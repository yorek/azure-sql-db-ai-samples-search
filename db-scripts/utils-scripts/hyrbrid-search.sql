declare @text nvarchar(1000) = 'samples used by davide at Fabric Conference 2025'
declare @k int = 50
declare @response nvarchar(max), @cached_response nvarchar(max);
declare @retval int;
declare @samples nvarchar(max)
declare @error nvarchar(max)

declare @qv vector(1536)
exec @retval = web.get_embedding @text, @qv output, @error output with result sets none 
if (@retval != 0) begin
    select @error as error; 
    return;
end

drop table if exists #ss;
select top(@k) 
    s.id,
    least(
        vector_distance('cosine', e.[embedding], @qv), 
        vector_distance('cosine', ne.[embedding], @qv), 
        vector_distance('cosine', de.[embedding], @qv) 
    ) as cosine_distance
into
    #ss
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
--select * from #ss;

-- Fulltext Search
drop table if exists #ks;
select top(@k)
    id,                
    ftt.[RANK] AS ft_rank
into
    #ks
from 
    dbo.samples w
inner join 
    FREETEXTTABLE(dbo.samples, *, @text) as ftt on w.id = ftt.[KEY]
order by
    ft_rank desc;
--select * from #ks;

with semantic_search as
(
    select top(@k)
        id,                
        rank() over (order by cosine_distance) as rank               
    from
        #ss
), 
keyword_search as
(
    select top(50)
        id, 
        rank() over (order by ft_rank desc) as rank            
    from
        #ks
),
final_rank as 
(
    select top(@k)
        coalesce(ss.id, ks.id) AS id,
        ss.rank AS semantic_rank,
        ks.rank AS keyword_rank,
        1000 * (coalesce(1.0 / (@k + ss.rank), 0.0) +
        coalesce(1.0 / (@k + ks.rank), 0.0)) AS similiarity_score -- Reciprocal Rank Fusion (RRF) 
    from
        semantic_search ss
    full outer join
        keyword_search ks on ss.id = ks.id            
    order by 
        similiarity_score desc
)
select top(@k)
    s.[id], [name], [description], [notes], [details], 
    semantic_rank,
    keyword_rank,
    [similiarity_score]
from
    dbo.samples s 
inner join
    final_rank fr on s.id = fr.id;
