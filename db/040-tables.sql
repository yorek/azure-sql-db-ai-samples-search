drop table if exists dbo.samples_embeddings;
drop table if exists dbo.samples_notes_embeddings;
drop table if exists dbo.samples_details_embeddings;
drop table if exists dbo.samples;

create table dbo.samples
(
    [id] int identity primary key,
    [name] nvarchar(100) not null,
    [description] nvarchar(max) not null,
    [notes] nvarchar(max) null,
    [details] json null,
    [url] nvarchar(1000) not null
)
go

create table dbo.samples_embeddings
(
    [id] int identity primary key,    
    [embedding] vector(1536) not null
)
go
alter table dbo.samples_embeddings
add constraint fk__samples_embeddings__samples foreign key ([id]) references dbo.samples([id]) 
go

create table dbo.samples_notes_embeddings
(
    [id] int identity primary key,    
    [embedding] vector(1536) not null
)
go
alter table dbo.samples_notes_embeddings
add constraint fk__samples_notes_embeddings__samples foreign key ([id]) references dbo.samples([id]) 
go

create table dbo.samples_details_embeddings
(
    [id] int identity primary key,    
    [embedding] vector(1536) not null
)
go
alter table dbo.samples_details_embeddings
add constraint fk__samples_details_embeddings__samples foreign key ([id]) references dbo.samples([id]) 
go