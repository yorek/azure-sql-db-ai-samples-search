/*
  Test get_embedding procedure
*/
declare @v vector(1536)
exec [web].[get_embedding] 'just a sample text', @v output
go

/*
  Check that tables have been correctly loaded.
  Please note that not all samples have a "note" property, so number of "total_samples_notes_embeddings" will be lower than the number of samples.
*/
select 
    count(s.id) as total_samples,
    count(e1.id) as total_samples_embeddings,
    count(e2.id) as total_samples_notes_embeddings,
    count(e3.id) as total_samples_details_embeddings
from 
    dbo.samples s
left outer join
     dbo.samples_embeddings e1 on s.id = e1.id
left outer join
     dbo.samples_notes_embeddings e2 on s.id = e2.id
left outer join
     dbo.samples_details_embeddings e3 on s.id = e3.id
go

