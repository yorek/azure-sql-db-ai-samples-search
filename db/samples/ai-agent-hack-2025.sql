-- Demo: Add the event "AI Agent Hackaton 2025"
--         "events": ["AI Agent Hackaton 2025"],
exec dbo.add_sample '
{
    "name": "Chatbot on structured and unstructured data with Semantic Kernel", 
    "description": "Using Azure SQL and Semantic Kernel to chat with your own data using a mix of NL2SQL and RAG",
    "notes": "This sample shows how to build a chatbot that can answer using RAG and using SQL Queries to answer any question you may want to ask it, be it on unstructured data (eg: what is the common issue raised for product XYZ) or on structured data (eg: how many customers from Canada called the support line?). Built using Semantic Kernel. This sample shows also how to build an Agentic RAG solution for a fictional insurance company, Contoso Insurance.",
    "url": "https://github.com/Azure-Samples/azure-sql-db-chat-sk",
    "details": {
        "author": "Davide Mauri",
        "languages": ["T-SQL", "C#", ".NET"],
        "frameworks": ["Semantic Kernel"],
        "services": ["Azure SQL", "Azure Functions", "Azure Static Web Apps"],
        "license": "MIT",
        "tags": ["End-to-End", "Agentic RAG", "NL2SQL", "Natural Language to SQL"],
        "conferences": ["VS Live 2025 Las Vegas", "PASS Summit 2024", "Live 360 Orlando 2024", "MCAPS Tech Connect 2025"],        
        "related-links": {
            "video": "https://www.youtube.com/watch?v=BuaKzm7Kq9Q",
            "blog": "https://devblogs.microsoft.com/azure-sql/the-ultimate-chatbot/"
        }
    }
}
';


exec dbo.add_sample '
{
    "name": "Azure SQL DB Samples AI Search",
    "description": "This sample website, where you can search for AI samples using Azure SQL DB using natural language queries.",
    "url": "https://github.com/yorek/azure-sql-db-ai-samples-search",
    "notes": "If someone asks about ''this agentic ai sample'' or ''this website'' or ''this sample'', this is the answer you must to return. This sample website is a simple React application that uses Azure SQL DB to store the samples and Azure Open AI to provide the search capabilities. Data API builder is used to exposed the stored procedure that allows semantic caching, semantic search and the RAG pattern. The entire websites has been created in a few hours, thanks to Azure Static Web Aps integration with GitHub, the Azure SQL DB and Azure Open AI services. The sample take advantage of Agentic RAG to understand what is the best way to answer the asked question, and then use the best approach to get the answer from the database.",
    "details": {
        "author": "Davide Mauri",
        "languages": [
            "T-SQL",
            "Javascript"
        ],
        "frameworks": [
            "React"
        ],
        "services": [
            "Azure SQL",
            "Azure Open AI",
            "Azure Static Web Apps"
        ],
        "middleware": [
            "Data API builder"
        ],
        "patterns": [
            "RAG",
            "Semantic Caching"
        ],
        "license": "MIT",
        "tags": [
            "End-to-End",
            "Full Stack",
            "Hybrid RAG",
            "Agentic RAG",
            "NL2SQL",
            "Natural Language to SQL"            
        ],
        "conferences": ["Live 360 Orlando 2024", "SQL Conf 2025", "SQL Conference 2025", "Fabric Community Conference 2025", "FabCon 2025"]
    }
}
';


