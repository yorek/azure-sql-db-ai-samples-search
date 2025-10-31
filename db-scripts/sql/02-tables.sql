drop table if exists dbo.semantic_cache;
drop table if exists dbo.samples_embeddings;
drop table if exists dbo.samples_notes_embeddings;
drop table if exists dbo.samples_details_embeddings;
drop table if exists dbo.samples;
drop table if exists dbo.openai_used_tokens;
go

drop sequence if exists request_id;
go

create sequence request_id as int start with 1;
go

create table dbo.openai_used_tokens
(
    id int identity constraint pk__openai_used_tokens primary key,
    request_id int not null,
    request_time datetime2 default(sysdatetime()) not null,
    source varchar(100),
    total_tokens int
)

create table dbo.samples
(
    [id] int identity constraint pk__samples primary key,
    [name] nvarchar(100) not null,
    [description] nvarchar(max) not null,
    [notes] nvarchar(max) null,
    [details] json null,
    [url] nvarchar(1000) not null,
    [created_on] datetime2(0) not null,
    [updated_on] datetime2(0) not null
)
go
alter table dbo.samples
add constraint uq__samples__url unique([url])

create table dbo.samples_embeddings
(
    [id] int,    
    [embedding] vector(1536) not null,
    [updated_on] datetime2(0) not null
)
go
alter table dbo.samples_embeddings
add constraint fk__samples_embeddings__samples foreign key ([id]) references dbo.samples([id]) 
go

create table dbo.samples_notes_embeddings
(
    [id] int,    
    [embedding] vector(1536) not null,
    [updated_on] datetime2(0) not null
)
go
alter table dbo.samples_notes_embeddings
add constraint fk__samples_notes_embeddings__samples foreign key ([id]) references dbo.samples([id]) 
go

create table dbo.samples_details_embeddings
(
    [id] int,    
    [embedding] vector(1536) not null,
    [updated_on] datetime2(0) not null
)
go
alter table dbo.samples_details_embeddings
add constraint fk__samples_details_embeddings__samples foreign key ([id]) references dbo.samples([id]) 
go

create table dbo.semantic_cache
(
    [id] int identity primary key nonclustered,    
    [query] nvarchar(max) not null,
    [action] nvarchar(max) not null,
    [samples] nvarchar(max) not null,
    [embedding] vector(1536) not null,
    [query_date] datetime2(0) not null,
    [response] nvarchar(max) not null,    
)
go
create clustered index ixc__semantic_cache on dbo.semantic_cache(query_date desc)
