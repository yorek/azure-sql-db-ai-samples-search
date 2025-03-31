exec dbo.add_sample '
{
    "name": "Fabric Conference 2025 Samples", 
    "description": "Demos and samples used a Fabric Conference 2025 Workshop",
    "notes": "the repo contains samples used both during the ''Building AI applications with SQL: Ground to Cloud to Fabric'' workshop and then ''Operational RAG Solutions with Azure SQL and Microsoft Fabric''",
    "url": "https://github.com/yorek/fabric-conference-2025",
    "details": {
        "author": "Davide Mauri",
        "languages": ["T-SQL", "C#", "Python"],        
        "services": ["Azure SQL", "SQL Server", "Fabric SQL"],
        "license": "MIT",
        "libraries": ["Semantic Kernel", "LangChain"],
        "tags": ["RAG", "Vectors", "Retrieval Augmented Generation", "AI", "GenAI"],        
        "conferences": ["Fabric Community Conference 2025", "FabCon 2025"]
    }
}';
GO