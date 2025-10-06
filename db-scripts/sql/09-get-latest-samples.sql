create or alter procedure [web].[get_latest_samples]
as

select 
    s.id,
    id as result_position,
    s.[name],
    s.[description],
    s.[description] as sample_summary,
    '' as thoughts,
    s.[url]
from 
    dbo.samples as s
order by 
    created_on desc
offset 0 rows fetch next 6 rows only
GO
