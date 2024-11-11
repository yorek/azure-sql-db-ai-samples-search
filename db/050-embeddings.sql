drop table if exists dbo.samples_embeddings;
create table dbo.samples_embeddings
(
    [id] int primary key,
    [embedding] vector(1536) not null
)
go

-- iterate over the samples table using cursor
set nocount on;
declare @id int, @name nvarchar(100), @description nvarchar(1000);
declare @embedding vector(1536);
declare c cursor fast_forward for select [id], [name], [description] from dbo.samples;
open c;
fetch next from c into @id, @name, @description;
while @@fetch_status = 0
begin
    declare @payload nvarchar(max) = @name + ': ' + @description;
    
    exec web.get_embedding @payload, @embedding output;
    
    delete from dbo.samples_embeddings where [id] = @id;    
    insert into dbo.samples_embeddings ([id], [embedding]) values (@id, @embedding);

    fetch next from c into @id, @name, @description;

    waitfor delay '00:00:01';
end
close c;
deallocate c;
go

select * from dbo.samples_embeddings;
go

