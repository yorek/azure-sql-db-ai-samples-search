if exists(select * from sys.external_models where [name] = 'Text3Small')
begin
    drop external model Text3Small;
end
create external model Text3Small
with ( 
      location = '$OPENAI_URL$/openai/deployments/$OPENAI_EMBEDDING_DEPLOYMENT_NAME$/embeddings?api-version=2024-08-01-preview',
      credential = [$OPENAI_URL$],
      api_format = 'Azure OpenAI',
      model_type = embeddings,
      model = 'embeddings'
);
go
