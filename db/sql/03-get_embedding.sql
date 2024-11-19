create or alter procedure [web].[get_embedding]
@inputText nvarchar(max),
@embedding vector(1536) output
as
declare @retval int;
declare @payload nvarchar(max) = json_object('input': @inputText);
declare @response nvarchar(max)
begin try
    exec @retval = sp_invoke_external_rest_endpoint
        @url = '$OPENAI_URL$/openai/deployments/$OPENAI_EMBEDDING_DEPLOYMENT_NAME$/embeddings?api-version=2023-03-15-preview',
        @method = 'POST',
        @credential = [$OPENAI_URL$],
        @payload = @payload,
        @response = @response output;
end try
begin catch
    select 'Embedding:REST' as [error], ERROR_NUMBER() as [error_code], ERROR_MESSAGE() as [error_message]
    return -1
end catch

if @retval != 0 begin
    select 'Embedding:OpenAI' as [error], @retval as [error_code], @response as [response]
    return @retval
end

declare @re nvarchar(max) = json_query(@response, '$.result.data[0].embedding')
set @embedding = cast(@re as vector(1536));

return @retval
go