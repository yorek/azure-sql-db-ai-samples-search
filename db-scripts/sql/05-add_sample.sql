create or alter procedure [dbo].[add_sample]
@payload nvarchar(max)
as
set nocount on;
set xact_abort on;
begin tran;

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
    insert ([name], [description], [notes], [details], [url], [created_on], [updated_on]) values (s.[name], s.[description], s.[notes], s.[details], s.[url], sysdatetime(), sysdatetime())
when matched then
    update set [name] = s.[name], [description] = s.[description], [notes] = s.[notes], [details] = s.[details], [url] = s.[url], [updated_on] = sysdatetime();

declare @sampleId int = (select [id] from dbo.samples where [url] = (select [url] from #samples));

delete from dbo.samples_details_embeddings where [id] = @sampleId
delete from dbo.samples_notes_embeddings where [id] = @sampleId
delete from dbo.samples_embeddings where [id] = @sampleId

/*
    Get the embeddings for the sample name and description
*/
declare @embedding vector(1536)
declare @name nvarchar(100) 
declare @description nvarchar(max)
declare @retval int, @error nvarchar(max)
select @name = [name], @description = [description] from #samples;

declare @sample nvarchar(max) = @name + ': ' + @description;
exec @retval = web.get_embedding @sample, @embedding output, @error output;
if (@retval != 0) begin
    select @error as error; 
    return;
end

insert into dbo.samples_embeddings (id, embedding, updated_on)
select @sampleId as id, @embedding as [embedding], sysdatetime() as [updated_on];

/*
    Get the embeddings for the sample notes 
*/  
if (exists(select * from #samples where [notes] is not null)) begin
    waitfor delay '00:00:01'; -- Try to avoid being throttled by the API
    
    declare @notes_embedding vector(1536);
    declare @notes nvarchar(max) = (select [notes] from #samples);
    
    exec @retval = web.get_embedding @notes, @notes_embedding output, @error output;
    if (@retval != 0) begin
        select @error as error; 
        return;
    end

    insert into dbo.samples_notes_embeddings (id, embedding, updated_on)
    select @sampleId as id, @notes_embedding as [embedding], sysdatetime() as [updated_on]
end

/*
    Get the embeddings for the sample details 
*/
if (exists(select * from #samples where [details] is not null)) begin
    waitfor delay '00:00:01'; -- Try to avoid being throttled by the API

    declare @details_embedding vector(1536);
    declare @details nvarchar(max) = (select [details] from #samples);
    
    exec @retval = web.get_embedding @details, @details_embedding output, @error output;
    if (@retval != 0) begin
        select @error as error; 
        return;
    end

    insert into dbo.samples_details_embeddings (id, embedding, updated_on) 
    select @sampleId as id, @details_embedding as [embedding], sysdatetime() as [updated_on]
end

select @sampleId as sample_id;

commit tran;
GO