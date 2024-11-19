create schema [web] authorization [dbo];
go

create user [sql-aisearch] from external provider
go

alter role db_owner add member [sql-aisearch] 
go
