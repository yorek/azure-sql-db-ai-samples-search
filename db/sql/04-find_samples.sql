create or alter procedure [web].[find_samples] @text nvarchar(max), @k int = null
as
declare @response nvarchar(max), @cached_response nvarchar(max);
declare @retval int;
declare @samples nvarchar(max)

/* Get the embedding for the requested text */
declare @qv vector(1536)
exec @retval = web.get_embedding @text, @qv output
if (@retval != 0) return;

/* Check in the semantic cache to see if a similar question has been already answered */
delete from [dbo].[semantic_cache] where query_date < dateadd(hour, -1, sysdatetime())

select top(1) *, vector_distance('cosine', @qv, embedding) as d 
into #c 
from [dbo].[semantic_cache] order by d;

select top(1) @cached_response = response from #c where d < 0.3
if (@cached_response is not null) set @response = @cached_response

/* If no cached response is available then generate a fresh answer */
if (@response is null) begin
    
    /* Orchestrate answer */
    declare @rt varchar(50), @rq nvarchar(max)    
    exec @retval = [web].[orchestrate_request]  @text, @rt output, @rq output
    if (@retval != 0) return;

    --print @rt
    --print @rq

    /* Find the samples most similar to the requested topic */
    if (@rt = 'SEMANTIC') begin
        set @k = coalesce(@k, 50)        
        drop table if exists #s;
        select top(@k) 
            s.id, [name], [description], [url], [notes], [details],
            least(
                vector_distance('cosine', e.[embedding], @qv), 
                vector_distance('cosine', ne.[embedding], @qv), 
                vector_distance('cosine', de.[embedding], @qv) 
            ) as distance_score
        into
            #s
        from 
            dbo.samples s
        inner join    
            dbo.samples_embeddings e on e.id = s.id
        left join
            dbo.samples_notes_embeddings ne on e.id = ne.id
        left join
            dbo.samples_details_embeddings de on e.id = de.id    
        order by 
            distance_score asc;

        /* Prepare the JSON string with relevant results to be sent to LLM for evaluation */
        set @samples = (
            select 
                [id], [name], [description], [notes], [details], 
                cast((1-distance_score)*100 as int) as similiarity_score
            from #s 
            where distance_score < 0.85
            order by distance_score for json path
        )
    end

    /* Find the samples using T-SQL */
    if (@rt = 'SQL') begin
        declare @trq nvarchar(max) = trim(replace(replace(@rq, char(13), ' '), char(10), ' '));
        if (@trq like '%INSERT %' or @trq like '%UPDATE %' or @trq like '%DELETE %' or @trq like '%DROP %' or @trq like '%ALTER %' or @trq like '%CREATE %') begin
            --select @trq
            select 'NL2SQL' as [error], -1 as [error_code], 'Unauthorized SQL command requested' as [response]
            return -1
        end

        declare @q nvarchar(max) = 'SET @s = (' + @rq + ')';
        exec sp_executesql @q, N'@s NVARCHAR(MAX) OUTPUT', @s = @samples output
        --print @samples
    end
    
    --select @samples;    
    exec @retval = [web].[generate_answer] @text, @samples, @response output;
    if (@retval != 0) return;

    /* Cache results */
    insert into dbo.semantic_cache (query, [action], samples, embedding, query_date, response) 
    values (@text, @rt + isnull(':' + @rq, ''), @samples, @qv, sysdatetime(), @response)
end

select 
    s.id,
    sr.result_position,
    s.[name],
    s.[description],
    sr.sample_summary,
    sr.thoughts,
    s.[url]--,
    --s.distance_score
from 
    openjson(@response, '$.result.choices[0].message') with (
        content nvarchar(max) '$.content'
    ) m
cross apply
    openjson(m.content, '$.samples') with (
        id int,
        result_position int,
        sample_summary nvarchar(max),
        thoughts nvarchar(max)
    ) as sr
inner join
    dbo.samples as s on s.id = sr.id
order by
    sr.result_position
    
GO
