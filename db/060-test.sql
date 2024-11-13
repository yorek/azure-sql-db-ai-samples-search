declare @qv vector(1536)
exec web.get_embedding 'RAG on Azure SQL Data', @qv output

select top(5) s.id, [name], [description], vector_distance('cosine', [embedding], @qv) as distance_score
from dbo.samples_embeddings e
inner join dbo.samples s on e.id = s.id
order by distance_score asc;