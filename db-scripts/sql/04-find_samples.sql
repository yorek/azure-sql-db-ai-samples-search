create or alter procedure [web].[find_samples] @text nvarchar(1000), @k int = null, @nocache int = 0, @debug int = 0
as
set nocount on;
declare @response nvarchar(max), @cached_response nvarchar(max);
declare @retval int;
declare @samples nvarchar(max)
declare @error nvarchar(max)

declare @rid int = next value for request_id;

declare @log table (    
    [id] int identity primary key nonclustered, 
    [request_id] int not null,
    [event_time] datetime2(7) default (CURRENT_TIMESTAMP), 
    [message] nvarchar(1000), 
    [output] nvarchar(max)
);

if trim(@text) = '' return;
if (@debug != 0) set @debug = 1

begin try

    /* 
        Get the embedding for the requested text 
    */
    if (@debug = 1) insert into @log ([request_id], [message]) values (@rid, 'Getting embeddings for query text...')

    declare @qv vector(1536)
    exec @retval = web.get_embedding @rid, @text, @qv output, @error output with result sets none 
    if (@retval != 0) begin
        if (@debug = 1) insert into @log ([request_id], [message], [output]) values (@rid, 'Error while getting embedding.', @error)
        if (@debug = 1) select * from @log;
        select @error as error; 
        return;
    end

    if (@debug = 1) insert into @log ([request_id], [message]) values (@rid, 'Done.')


    /* 
        Check in the semantic cache to see if a similar question has been already answered 
    */
    if (@nocache != 1) begin
        if (@debug = 1) insert into @log ([request_id], [message]) values (@rid, 'Searching semantic cache...')

        exec web.query_semantic_cache @qv, @cached_response output with result sets none
        if (@cached_response is not null) begin
            set @response = @cached_response
            if (@debug = 1) insert into @log ([request_id], [message], [output]) values (@rid, 'Found result in cache.', @response)
        end
    end

    /* If no cached response is available then generate a fresh answer */
    if (@response is null) begin
        
        /* 
            Orchestrate answer 
        */
        if (@debug = 1) insert into @log ([request_id], [message], [output]) values (@rid, 'Orchestrating resolution strategies...', @response)

        declare @rt varchar(50), @rq nvarchar(max)    
        exec @retval = [web].[orchestrate_request] @rid, @text, @rt output, @rq output, @error output with result sets none  
        if (@retval != 0) begin
            if (@debug = 1) insert into @log ([request_id], [message], [output]) values (@rid, 'Error during orchestration evaluation...', @error)
            if (@debug = 1) select * from @log;
            select @error as error; 
            return;
        end

        if (@debug = 1) insert into @log ([request_id], [message], [output]) values (@rid, 'Strategy determined.', @rt)
        if (@debug = 1) insert into @log ([request_id], [message], [output]) values (@rid, 'Query defined.', @rq)

        if (@debug = 1) insert into @log ([request_id], [message]) values (@rid, 'Orchestration planning complete, moving to execution.')

        /* 
            Find the samples using generated T-SQL 
        */
        if (@rt = 'SQL') begin
            if (@debug = 1) insert into @log ([request_id], [message]) values (@rid, 'Starting executing generated SQL query...')

            -- Simple sanitization
            declare @trq nvarchar(max) = trim(replace(replace(@rq, char(13), ' '), char(10), ' '));
            if (@trq like '%INSERT %' or @trq like '%UPDATE %' or @trq like '%DELETE %' or @trq like '%DROP %' or @trq like '%ALTER %' or @trq like '%CREATE %') begin
                if (@debug = 1) insert into @log ([request_id], [message]) values (@rid, 'Unauthorized SQL command requested');
                if (@debug = 1) select * from @log;
                select 'NL2SQL' as [error], -1 as [error_code], 'Unauthorized SQL command requested' as [response]
                return -1
            end
            if (@debug = 1) insert into @log ([request_id], [message], [output]) values (@rid, 'Query sanitized.', @trq)
            
            -- Execute generate query
            create table #ts (id int, [name] nvarchar(100), [description] nvarchar(max), notes nvarchar(max), details json, created_on datetime2(0), updated_on datetime2(0), distance_score float);
            insert into #ts exec sp_executesql @rq 
            set @samples = cast((select * from #ts for json auto) as nvarchar(max))
            if (@debug = 1) insert into @log ([request_id], [message], [output]) values (@rid, 'Query executed.', @samples)

            /* If not results coming from SQL execution, try SEMANTIC anyway */
            if (@samples is null) begin
                set @rt = 'SEMANTIC'
                if (@debug = 1) insert into @log ([request_id], [message], [output]) values (@rid, 'Empty resultset returned, switching strategy.', @rt)
            end
        end

        /* 
            Find the samples using hybrid search
        */
        if (@rt like '%SEMANTIC%') begin
            if (@debug = 1) insert into @log ([request_id], [message]) values (@rid, 'Running hybrid search...')
            set @k = coalesce(@k, 50)         
            
            -- Semantic Search
            if (@debug = 1) insert into @log ([request_id], [message]) values (@rid, 'Running semantic search...')
            drop table if exists #ss;
            select top(@k) 
                s.id,
                least(
                    vector_distance('cosine', e.[embedding], @qv), 
                    vector_distance('cosine', ne.[embedding], @qv), 
                    vector_distance('cosine', de.[embedding], @qv) 
                ) as cosine_distance
            into
                #ss
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
            --select * from #ss;

            -- Fulltext Search
            if (@debug = 1) insert into @log ([request_id], [message]) values (@rid, 'Running fulltext search...')
            drop table if exists #ks;
            select top(@k)
                id,                
                ftt.[RANK] AS ft_rank
            into
                #ks
            from 
                dbo.samples w
            inner join 
                FREETEXTTABLE(dbo.samples, *, @text) as ftt on w.id = ftt.[KEY] -- BM25
            order by
                ft_rank desc;
            --select * from #ks;

            -- RRF
            if (@debug = 1) insert into @log ([request_id], [message]) values (@rid, 'Executing RRF...')
            drop table if exists #s;
            with semantic_search as
            (
                select top(@k)
                    id,                
                    rank() over (order by cosine_distance) as rank               
                from
                    #ss
            ), 
            keyword_search as
            (
                select top(@k)
                    id, 
                    rank() over (order by ft_rank desc) as rank            
                from
                    #ks
            ),
            final_rank as 
            (
                select top(@k)
                    coalesce(ss.id, ks.id) AS id,
                    ss.rank AS semantic_rank,
                    ks.rank AS keyword_rank,
                    1000 * (coalesce(1.0 / (@k + ss.rank), 0.0) +
                    coalesce(1.0 / (@k + ks.rank), 0.0)) AS similiarity_score -- Reciprocal Rank Fusion (RRF) 
                from
                    semantic_search ss
                full outer join
                    keyword_search ks on ss.id = ks.id            
                order by 
                    similiarity_score desc
            )
            select top(@k)
                s.[id], [name], [description], [notes], [details], 
                semantic_rank,
                keyword_rank,
                [similiarity_score]
            into
                #s
            from
                dbo.samples s 
            inner join
                final_rank fr on s.id = fr.id;
            --select * from #s where similiarity_score > 30 order by similiarity_score desc;

            /* Prepare the JSON string with relevant results to be sent to LLM for evaluation */
            set @samples = (
                select top(@k)
                    [id], [name], [description], [notes], [details], 
                    similiarity_score
                from #s 
                where similiarity_score > 30
                order by similiarity_score desc for json path
            )

            if (@debug = 1) insert into @log ([request_id], [message], [output]) values (@rid, 'Completed hybrid search.', @samples)
        end
        
        /*
            Send found samples to LLM for generating the final answer 
        */
        if (@debug = 1) insert into @log ([request_id], [message], [output]) values (@rid, 'Generating answer...', null)
        if (@samples is not null) begin               
            exec @retval = [web].[generate_answer] @rid, @text, @samples, @response output, @error output with result sets none;
            if (@retval != 0) begin
                if (@debug = 1) insert into @log ([request_id], [message], [output]) values (@rid, 'Error while generating answer.', @error)
                if (@debug = 1) select * from @log;
                select @error as error; 
                return;
            end
        end else begin
            set @samples = '[]'
            set @response = '{}'
        end

        if (@debug = 1) insert into @log ([request_id], [message], [output]) values (@rid, 'Answer generated...', @response)

        /* 
            Cache results 
        */
        insert into dbo.semantic_cache (query, [action], samples, embedding, query_date, response) 
        values (@text, @rt + isnull(':' + @rq, ''), @samples, @qv, sysdatetime(), @response)
    end

    
    /*
        Return results
    */
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

    if (@debug = 1) select * from @log;

end try
begin catch

    if (@debug = 1) select * from @log;
    throw     

end catch


