
declare @result_type varchar(50) 
declare @result_query nvarchar(max) 
declare @error nvarchar(max)

exec [web].[orchestrate_request] 
    --'find the samples created in 2025', 
    --'show the last 5 samples',
    --'samples used by Davide at FabCon 2025',
    --'langchain samples',
    @result_type output,
    @result_query output,
    @error output

select @result_type as result_type, @result_query as result_query, @error as error
print @result_query
