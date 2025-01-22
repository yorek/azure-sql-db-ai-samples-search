create or alter procedure [web].[generate_answer] 
@query_text nvarchar(max),
@source nvarchar(max),
@response nvarchar(max) output
as
declare @retval int;

if (@query_text is null) begin
    select 'Generator' as [error], -1 as [error_code], 'Query not provided' as [error_message]
    return -1
end

if (@source is null) begin
    select 'Generator' as [error], -1 as [error_code], 'Sample list not provided' as [error_message]
    return -1
end


/* Create the prompt for the LLM */
declare @p nvarchar(max) = 
json_object(
    'messages': json_array(
        json_object(
            'role':'system',
            'content':'
                You as a system assistant who helps users find code samples the user can use to learn the topic they are interested in.
                Samples are provided in an assitant message using a JSON Array with the following format: [{id, name, description, note, details, similiarity_score}]. 
                Put in sample_summary output property a markdown short summary of the sample using the provided description, notes, and details. 
                Use only the provided samples to help you answer the question.        
                Use only the information available in the provided JSON to answer the question.
                Make sure to use details, notes, and description that are provided in each sample are used only with that sample.
                If there are related links or repos in the details of a sample that is included in the answer, include them in the short summary. Include links only if they are related to the sample and if they are available in the note or details of that sample.               
                If the question cannot be answered by the provided samples, you must say that you don''t know.
                If asked question is about topics you don''t know, answer that you don''t know.
                If no samples are provided, say that you cannot answer as no samples have been found.
            '
        ),
        json_object(
            'role':'assistant',
            'content': 'The available samples are the following:'
            ),
        json_object(
            'role':'assistant',
            'content': coalesce(@source, '')
            ),
        json_object(
            'role':'user',
            'content': + @query_text
        )
    ),    
    'temperature': 0.2,
    'frequency_penalty': 0,
    'presence_penalty': 0,    
    'stop': null
);

declare @js nvarchar(max) = N'{
    "type": "json_schema",
    "json_schema": {
        "name": "samples",
        "strict": true,
        "schema": {
            "type": "object",
            "properties": {
                "samples": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "result_position": {
                                "type": "number"
                            },
                            "id": {
                                "type": "number"
                            },
                            "sample_summary": {
                                "type": "string"
                            },                            
                            "thoughts": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "id",                            
                            "sample_summary",                            
                            "thoughts",
                            "result_position"
                        ],
                        "additionalProperties": false
                    }
                }
            },
            "required": ["samples"],
            "additionalProperties": false
        }        
    }        
}'

set @p = json_modify(@p, '$.response_format', json_query(@js))
---select @p

/* Send request to LLM */
begin try
    exec @retval = sp_invoke_external_rest_endpoint
        @url = '$OPENAI_URL$/openai/deployments/$OPENAI_CHAT_DEPLOYMENT_NAME$/chat/completions?api-version=2024-08-01-preview',
        @headers = '{"Content-Type":"application/json"}',
        @method = 'POST',
        @credential = [$OPENAI_URL$],
        @timeout = 120,
        @payload = @p,
        @response = @response output;
end try
begin catch
    select 'Generator:REST' as [error], ERROR_NUMBER() as [error_code], ERROR_MESSAGE() as [error_message]
    return -1
end catch
--select @response

if @retval != 0 begin
    select 'Generator:OpenAI' as [error], @retval as [error_code], @response as [response]
    return @retval
end

declare @refusal nvarchar(max) = (select coalesce(json_value(@response, '$.result.choices[0].refusal'), ''));

if @refusal != '' begin
    select 'Generator:OpenAI/Refusal' as [error], @refusal as [refusal], @response as [response]
    return -1
end
GO
