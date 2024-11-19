create or alter procedure [web].[get_total_sample_count]
as
select 
    count(*) as total_sample_count
from 
    dbo.samples s
left outer join 
    dbo.samples_embeddings se on s.id = se.id
go