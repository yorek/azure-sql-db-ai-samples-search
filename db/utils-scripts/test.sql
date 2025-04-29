exec [web].[get_total_sample_count]
GO

exec [web].[find_samples] 'migrate and modernzine'
go

exec [web].[find_samples] 'agentic rag insurance sample'
go

exec [web].[find_samples] 'rag sample'
go

exec [web].[find_samples] 'any samples used at FabCon 2025?'
go

exec [web].[find_samples] 'show me the most recent samples of 2025'
go

exec [web].[find_samples] 'show me the sample that davide used during the AI Agent Hackaton in April 2025'
go

exec [web].[find_samples] 'what are the sample that uses T-SQL'
go


select  * from dbo.samples where id = 24

select * from dbo.samples_embeddings where id = 2

select * from dbo.samples_notes_embeddings where id = 1


