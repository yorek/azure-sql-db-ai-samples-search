create or alter procedure dbo.add_sample
@payload json
as
set nocount on;

declare @dummy nvarchar(max) = cast(@payload as nvarchar(max)); -- Need to cast to nvarchar(max) to avoid error during JSON preview

select top(1) 
    *
into
    #samples
from
    openjson(@dummy) with (
        [name] nvarchar(100),
        [description] nvarchar(max),
        [notes] nvarchar(max),
        [details] nvarchar(max) as json,
        [url] nvarchar(1000)
    )

merge into dbo.samples as t
using #samples as s
on t.[url] = s.[url]
when not matched then
    insert ([name], [description], [notes], [details], [url]) values (s.[name], s.[description], s.[notes], s.[details], s.[url])
when matched then
    update set [description] = s.[description], [notes] = s.[notes], [details] = s.[details], [url] = s.[url];

declare @sampleId int = (select [id] from dbo.samples where [url] = (select [url] from #samples));

/*
    Get the embeddings for the sample name and description
*/
declare @embedding vector(1536)
declare @name nvarchar(100) 
declare @description nvarchar(max)
select @name = [name], @description = [description] from #samples;

declare @sample nvarchar(max) = @name + ': ' + @description;
exec web.get_embedding @sample, @embedding output;

merge into dbo.samples_embeddings as t
using (select @sampleId as id, @embedding as [embedding]) as s
on t.id = s.id
when not matched then
    insert ([embedding]) values (s.[embedding])
when matched then
    update set [embedding] = s.[embedding];

/*
    Get the embeddings for the sample notes 
*/  
if (exists(select * from #samples where [notes] is not null)) begin
    waitfor delay '00:00:01'; -- Try to avoid being throttled by the API
    
    declare @notes_embedding vector(1536);
    declare @notes nvarchar(max) = (select [notes] from #samples);
    
    exec web.get_embedding @notes, @notes_embedding output;

    merge into dbo.samples_notes_embeddings as t
    using (select @sampleId as id, @notes_embedding as [embedding]) as s
    on t.id = s.id
    when not matched then
        insert ([embedding]) values (s.[embedding])
    when matched then
        update set [embedding] = s.[embedding];
end

/*
    Get the embeddings for the sample details 
*/
if (exists(select * from #samples where [details] is not null)) begin
    waitfor delay '00:00:01'; -- Try to avoid being throttled by the API

    declare @details_embedding vector(1536);
    declare @details nvarchar(max) = (select [details] from #samples);
    
    exec web.get_embedding @details, @details_embedding output;

    merge into dbo.samples_details_embeddings as t
    using (select @sampleId as id, @details_embedding as [embedding]) as s
    on t.id = s.id
    when not matched then
        insert ([embedding]) values (s.[embedding])
    when matched then
        update set [embedding] = s.[embedding];
end
