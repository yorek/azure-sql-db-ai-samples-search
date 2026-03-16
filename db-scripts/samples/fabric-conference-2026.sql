exec dbo.add_sample '
{
    "name": "Fabric and SQL Conference 2026 Samples", 
    "description": "Demos and samples used a Fabric and SQL Conference 2026 Workshop",
    "notes": "the repo contains samples used both during the ''From Vectors to Agents - Building AI-Powered Solutions with Microsoft SQL'' workshop and the sessions ''SQL + AI Building Agentic Apps with SQL MCP Server + Microsoft Foundry'' and ''New in modern Developer Experiences in SQL''",
    "url": "https://github.com/yorek/fabric-conference-2026",
    "details": {
        "author": "Davide Mauri",
        "languages": ["T-SQL", "C#"],        
        "services": ["Azure SQL", "SQL Server", "Fabric SQL Database"],
        "license": "MIT",
        "tags": ["RAG", "Vectors", "Retrieval Augmented Generation", "AI", "GenAI"],        
        "conferences": ["Fabric Community Conference 2026", "FabCon 2026", "SQLCON 2026"],
        "type": "code sample"
    }
}';
GO

select * from dbo.samples where [url] = 'https://github.com/yorek/fabric-conference-2026'
 
--exec dbo.delete_sample @url = 'https://github.com/yorek/fabric-conference-2026'



