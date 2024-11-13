create or alter procedure dbo.delete_sample
@id int = null,
@url nvarchar(1000) = null
as
set nocount on;
set xact_abort on

if (@id is not null and @url is not null) 
begin
    raiserror('Cannot specify both id and url', 16, 1)
    return
end

declare @sid int

if (@url is not null)
begin
    select @sid = id from dbo.samples where url = @url    
end else begin
    set @sid = @id
end

if (@sid is null) 
begin
    raiserror('Sample not found', 16, 1)
    return
end

begin tran

delete from dbo.samples where id = @id
delete from dbo.samples_embeddings where id = @id
delete from dbo.samples_notes_embeddings where id = @id
delete from dbo.samples_details_embeddings where id = @id

commit tran