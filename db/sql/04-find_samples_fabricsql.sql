create or alter procedure [web].[find_samples] @text nvarchar(1000), @k int = null
as
set nocount on;
declare @response nvarchar(max), @cached_response nvarchar(max);
declare @retval int;
declare @samples nvarchar(max)
declare @error nvarchar(max)

if trim(@text) = '' return;

/* Get the embedding for the requested text */
declare @qv vector(1536)
exec @retval = web.get_embedding @text, @qv output, @error output with result sets none 
if (@retval != 0) begin
    select @error as error; 
    return;
end

/* Check in the semantic cache to see if a similar question has been already answered */
delete from [dbo].[semantic_cache] where query_date < dateadd(hour, -1, sysdatetime())

select top(1) *, vector_distance('cosine', @qv, embedding) as d 
into #c 
from [dbo].[semantic_cache] order by d;
--select * from #c

select top(1) @cached_response = response from #c where d < 0.25
if (@cached_response is not null) set @response = @cached_response

/* If no cached response is available then generate a fresh answer */
if (@response is null) begin
    
    /* Orchestrate answer */
    declare @rt varchar(50), @rq nvarchar(max)    
    exec @retval = [web].[orchestrate_request]  @text, @rt output, @rq output, @error output with result sets none  
    if (@retval != 0) begin
        select @error as error; 
        return;
    end

    --print @rt
    --print @rq

     /* Find the samples using T-SQL */
    if (@rt = 'SQL') begin
        declare @trq nvarchar(max) = trim(replace(replace(@rq, char(13), ' '), char(10), ' '));
        if (@trq like '%INSERT %' or @trq like '%UPDATE %' or @trq like '%DELETE %' or @trq like '%DROP %' or @trq like '%ALTER %' or @trq like '%CREATE %') begin
            --select @trq
            select 'NL2SQL' as [error], -1 as [error_code], 'Unauthorized SQL command requested' as [response]
            return -1
        end
        --print @rq
        
        create table #ts (id int, [name] nvarchar(100), [description] nvarchar(max), notes nvarchar(max), details json, distance_score float);
        insert into #ts exec sp_executesql @rq 
        set @samples = cast((select * from #ts for json auto) as nvarchar(max))
        --print @samples

        /* If not results coming from SQL execution, try SEMANTIC anyway */
        if (@samples is null) begin
            set @rt = 'SQL+SEMANTIC'
        end
    end


    /* Find the samples most similar to the requested topic */
    if (@rt like '%SEMANTIC%') begin
        set @k = coalesce(@k, 50)         
        
        -- Semantic Search
        drop table if exists #ss;
        select top(@k) 
            s.id,
            [name], [description], [notes], [details], 
            least(
                vector_distance('cosine', e.[embedding], @qv), 
                vector_distance('cosine', ne.[embedding], @qv), 
                vector_distance('cosine', de.[embedding], @qv) 
            ) as cosine_distance
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
            cosine_distance asc;

        /* Prepare the JSON string with relevant results to be sent to LLM for evaluation */
        set @samples = (
            select 
                [id], [name], [description], [notes], [details], 
                100 * (1-cosine_distance) as similiarity_score
            from #s 
            order by similiarity_score desc for json path
        )
    end
    
    --select @samples;    
    if (@samples is not null) begin       
        exec @retval = [web].[generate_answer] @text, @samples, @response output, @error output with result sets none;
        if (@retval != 0) begin
            select @error as error; 
            return;
        end
    end else begin
        set @samples = '[]'
        set @response = '{}'
    end

    /* Cache results */
    insert into dbo.semantic_cache (query, [action], samples, embedding, query_date, response) 
    values (@text, @rt + isnull(':' + @rq, ''), @samples, @qv, sysdatetime(), @response)
end

--select @response;
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

