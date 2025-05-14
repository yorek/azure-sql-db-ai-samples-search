exec [web].[get_total_sample_count]
go

exec [web].[find_samples] 'migrate and modernzine', @debug=1, @nocache=1
go

exec [web].[find_samples] 'agentic rag insurance sample', @debug=1, @nocache=1
go

exec [web].[find_samples] 'rag sample'
go

exec [web].[find_samples] 'any samples used at FabCon 2025?'
go

exec [web].[find_samples] 'Samples used at Orlando Live 360 in 2024', @debug=1, @nocache=1
go

exec [web].[find_samples] 'show me the most recent code samples of 2025', @debug=1, @nocache=1
go

exec [web].[find_samples] 'show me the last session recordings of 2025', @debug=1, @nocache=1
go

exec [web].[find_samples] 'show me the last code repos shared in 2025', @debug=1, @nocache=1
go

exec [web].[find_samples] 'show me samples that davide used during the AI Agent Hackaton in 2025', @debug=1, @nocache=1
go

exec [web].[find_samples] 'what are the sample that uses T-SQL'
go


select  * from dbo.samples where id in (21, 14)

select * from dbo.samples_embeddings where id = 2

select * from dbo.samples_notes_embeddings where id = 1

select * from dbo.semantic_cache

--delete from dbo.semantic_cache

