if not exists(select * from sys.fulltext_catalogs where [name] = 'FullTextCatalog')
begin
    create fulltext catalog [FullTextCatalog] as default;
end
go

create fulltext index on dbo.samples ([description], [notes]) key index pk__samples;
go

alter fulltext index on dbo.samples enable; 
go

select * from sys.fulltext_catalogs
go
