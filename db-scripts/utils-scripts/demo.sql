select * from dbo.samples

exec [web].[get_total_sample_count]
go

exec [web].[find_samples] 'nl2sql samples', @debug=1, @nocache=1
go

exec [web].[find_samples] 'natural language to sql samples', @debug=1, @nocache=1
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

exec [web].[find_samples] 'code samples used at the ai agent hackaton event in 2025', @debug=1, @nocache=1
go

select * from dbo.openai_used_tokens

select  * from dbo.samples where id in (21, 14)

select * from dbo.samples_embeddings where id = 2

select * from dbo.samples_notes_embeddings where id = 1

select * from dbo.semantic_cache

--delete from dbo.semantic_cache

select * from dbo.samples where [url] like 'https://blog.fabric.microsoft.com/%'

select [url], json_value(details, '$.type') 
from dbo.samples 
where json_value(details, '$.type') = 'code sample'
order by [url]


select * from sys.sequences

