drop table if exists dbo.samples;
create table dbo.samples
(
    [id] int identity primary key,
    [name] nvarchar(100) not null,
    [description] nvarchar(1000) not null,
    [url] nvarchar(1000) not null,
)
go

declare @samples nvarchar(max) = '[
    {"name": "Azure SQL DB Vectorizer", "description": "Quickly generate embeddings from data in Azure SQL", "url": "https://github.com/Azure-Samples/azure-sql-db-vectorizer"},
    {"name": "Azure SQL DB Session Recommender", "description": "Build a recommender using OpenAI, Azure Functions, Azure Static Web Apps, Azure SQL DB, Data API builder and Text Embeddings", "url": "https://github.com/Azure-Samples/azure-sql-db-session-recommender"},
    {"name": "Azure SQL DB & OpenAI", "description": "Samples on how to use Azure SQL database with Azure OpenAI", "url": "https://github.com/Azure-Samples/azure-sql-db-openai"},
    {"name": "Azure SQL DB Chatbot", "description": "Implement a RAG solution and call OpenAI right from Azure SQL DB to ask questions about your data", "url": "https://github.com/Azure-Samples/azure-sql-db-chatbot"},
    {"name": "Azure SQL DB Session Recommender - V2", "description": "Build a Retrieval Augmented Generation solution using OpenAI, Azure Functions, Azure Static Web Apps, Azure SQL DB, Data API builder and Text Embeddings", "url": "https://github.com/Azure-Samples/azure-sql-db-session-recommender-v2"},
    {"name": "The Ultimate Chatbot", "description": "Using Azure SQL and Semantic Kernel to chat with your own data using a mix of NL2SQL and RAG", "url": "https://github.com/Azure-Samples/azure-sql-db-chat-sk"},
    {"name": "Azure SQL DB, Langchain and Chainlit", "description": "Sample RAG pattern using Azure SQL DB, Langchain and Chainlit", "url": "https://github.com/Azure-Samples/azure-sql-db-rag-langchain-chainlit"},
    {"name": "Native Vector Support in Azure SQL and SQL Server", "description": "This repo hosts samples meant to help use the new Native Vector Support in Azure SQL DB feature. We illustrate key technical concepts and demonstrate how you can store and query embeddings in Azure SQL data to enhance your application with AI capabilities.", "url": "https://github.com/Azure-Samples/azure-sql-db-vector-search"},
    {"name": "EF Core Vector Sample", "description": "This sample shows how to use the vector functions in EF Core to store and query vector data.", "url": "https://github.com/Azure-Samples/azure-sql-db-vector-search/tree/main/EF-Core"}
]';

insert into dbo.samples
select * from openjson(@samples) with (
    [name] nvarchar(100),
    [description] nvarchar(1000),
    [url] nvarchar(1000)
) as j
go

select * from dbo.samples;
go


