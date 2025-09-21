/*
    VS Live 2025 
*/

exec dbo.add_sample '
{
    "name": "VS Live 2025 - Redmond HQ", 
    "description": "Demos used as VS Live 2025 Redmond. Sessions: SQL ❤️ JSON: The Best of Both Worlds, AI Meets Data: Unlocking Insights with a Database-First Approach, Workshop: Developer Dive into SQL Server 2025",
    "url": "https://github.com/yorek/vslive2025-redmond",
    "details": {
        "author": "Davide Mauri",
        "languages": ["T-SQL"],        
        "services": ["Azure SQL", "SQL Server", "Vectors", "Embeddings", "Semantic Search", "RAG", "Retrieval Augmented Generation"],
        "license": "MIT",
        "tags": ["SQL Server 2025", "JSON"],                 
        "type": "code sample",
        "conferences": ["VS Live 2025 Redmond HQ"]
    }
}
';
GO


exec dbo.add_sample '
{
    "name": "VS Live 2025 - San Diego", 
    "description": "Demos used as VS Live 2025 San Diego. Sessions: ''AI Meets Data: Unlocking Insights with a Database-First Approach'', ''Unleashing the Power of Semantic Kernel with Azure SQL''",
    "url": "https://github.com/yorek/vs-live-2025-san-diego",
    "details": {
        "author": "Davide Mauri",
        "languages": ["T-SQL"],        
        "services": ["Azure SQL", "SQL Server"],
        "license": "MIT",
        "tags": ["SQL Server 2025", "Semantic Kernel", "Vectors", "Embeddings", "Semantic Search", "RAG", "Retrieval Augmented Generation"],                 
        "type": "code sample",
        "conferences": ["VS Live 2025 San Diego"]
    }
}
';
GO
