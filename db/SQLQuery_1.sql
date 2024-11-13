exec dbo.add_sample '
{
    "name": "Azure SQL DB Vectorizer", 
    "description": "Quickly generate embeddings from data in Azure SQL", 
    "url": "https://github.com/Azure-Samples/azure-sql-db-vectorizer",
    "notes": "Quickly generate embeddings from data in Azure SQL. Point to the table that has text that must to turned into embeddings, configure the .env file and run the tool, to get text vectorized into embedding as fast as possible. Embedding will be generated using the OpenAI API. The tool will connect to the Azure SQL Database, read the text from the specified table, send the text to the OpenAI API, and store the embeddings back in the same table. If the read text is too big to fit a single embedding API call, the tool will split the text into chunks and send each chunk to the API. Chunking is done using the TextChunker.SplitPlainTextParagraphs method from the Microsoft.SemanticKernel.Text package. Maximum number of token per paragraph is set to 2048. Embeddings will be stored into a dedicated table. If the table doesn''t exist, the tool can create a new table to store the embeddings. The relationship between the original table and the table that stores the embeddings is done using the id / parent_id column and the relationship is a 1:N relationship, as each row in the original table will have one or more rows in the table that stores the embeddings due to the chunking process. Rows from the database are processed in batch of 5000 rows. Those rows are read into a queue and then, by default, two threads per each OpenAI URL will pull data from the queue, chunk it if needed, and then send the embedding request to the OpenAI API. Each API call will batch togheter up to 50 text chunks to be vectorized. Once the queue is empty, the process will start again until all rows in the source table are processed.",
    "details": {
        "author": "Davide Mauri",
        "languages": [".NET"],
        "license": "MIT",
        "services": ["Azure SQL"],
        "tags": ["Azure", "SQL", "Embeddings", "Vectorizer"]
    }
}
';

exec dbo.add_sample '
{
    "name": "PASS 2024 Demos", 
    "description": "Demos used at PASS Summit 2024", 
    "url": "https://github.com/yorek/pass-2024",
    "notes": "Repo with the samples used at PASS 2024 during the SQL AI Workshop (.NET + Semantic Kernel and Python + LangChain + ChainLit) and during the session \"Unlocking the Power of Azure SQL Database: AI, Elastic Pools, and Beyond\"",
    "details": {
        "author": "Davide Mauri",
        "languages": ["T-SQL", ".NET", "Python"],
        "services": ["Azure SQL"],
        "license": "MIT"        
    }
}
';

exec dbo.add_sample '
{
    "name": "Million Song Dataset in Azure SQL DB / SQL Server", 
    "description": "Importing and using the Million Song Dataset in Azure SQL DB or SQL Server (2017+) to build a recommendation service for songs.", 
    "url": "https://github.com/azure-samples/millionsongdataset-sql",
    "notes": "Use the graph model support in Azure SQL and SQL Server (Edge and Nodes tables) to maniuplate the Million Song Dataset and build a recommendation service for songs.",
    "details": {
        "author": "Arvind Shyamsundar",
        "languages": ["T-SQL"],
        "services": ["Azure SQL"],
        "license": "MIT"        
    }
}
';

exec dbo.add_sample '
{
    "name": "Azure SQL DB Import Data Samples", 
    "description": "Samples on how to import data (Flat Files, CSV, JSON) in Azure SQL", 
    "url": "https://github.com/Azure-Samples/azure-sql-db-import-data",
    "notes": "A set of scripts to help in importing data in Azure SQL DB using BCP, BULK INSERT, OPENROWSET, dbatools'' Write-DbaDbTableData",
    "details": {
        "author": "Davide Mauri",
        "languages": ["T-SQL"],
        "services": ["Azure SQL"],
        "license": "MIT",        
        "related-repos": [{
                "name": "Fast Data Loading in Azure SQL DB using Azure Databricks",
                "url": "https://github.com/Azure-Samples/azure-sql-db-databricks"
           }
        ]
    }
}
';

exec dbo.add_sample '
{
    "name": "Azure SQL + Azure Cognitive Services", 
    "description": "We will create a small example of an AI application that responds to users'' queries based on a SQL table of Amazon product reviews.", 
    "url": "https://github.com/Azure-Samples/SQL-AI-samples/blob/main/AzureSQLACSSamples/src/AzureSQL_CogSearch_IntegratedVectorization.ipynb",
    "notes": "The AzureSQL_CogSearch_IntegratedVectorization sample notebook shows a simple AI application that recommends products based on a database of user reviews, using Azure Cognitive Search to store and search the relevant data. It highlights new preview features of Azure Cognitive Search, including automatic chunking and integrated vectorization of user queries.",
    "details": {
        "languages": ["T-SQL", "Python"],
        "services": ["Azure SQL", "Azure Cognitive Services"],        
        "license": "MIT"        
    }
}
';

exec dbo.add_sample '
{
    "name": "Azure SQL + Azure Promptflow", 
    "description": "This is the code repository for Azure SQL Promptflow Demo. It demonstrates how to create a chatbot that can query the data from your own Azure SQL database.", 
    "url": "https://github.com/Azure-Samples/SQL-AI-samples/blob/main/AzureSQLACSSamples/src/AzureSQL_CogSearch_IntegratedVectorization.ipynb",
    "notes": "The AzureSQL_Prompt_Flow sample shows an E2E example of how to build AI applications with Prompt Flow, Azure Cognitive Search, and your own data in Azure SQL database. It includes instructions on how to index your data with Azure Cognitive Search, a sample Prompt Flow local development that links everything together with Azure OpenAI connections, and also how to create an endpoint of the flow to an Azure ML workspace.",
    "details": {
        "languages": ["T-SQL", "Python"],
        "services": ["Azure SQL", "Azure Promptflow"],
        "license": "MIT"        
    }
}
';

exec dbo.add_sample '
{
    "name": "Vector similarity search with Azure SQL & Azure OpenAI", 
    "description": "This example shows how to use Azure OpenAI from Azure SQL database to get the vector embeddings of any chosen text, and then calculate the cosine similarity against the Wikipedia articles (for which vector embeddings have been already calculated,) to find the articles that covers topics that are close - or similar - to the provided text.", 
    "url": "https://github.com/Azure-Samples/azure-sql-db-openai",
    "details": {
        "languages": ["T-SQL", "Python"],
        "services": ["Azure SQL"],
        "license": "MIT"        
    }
}
';

exec dbo.add_sample '
{
    "name": "Generating SQL for Azure SQL Database using Vanna.AI", 
    "description": "This notebook runs through the process of using the vanna Python package to generate SQL using AI (RAG + LLMs) including connecting to a database and training.", 
    "url": "https://github.com/Azure-Samples/SQL-AI-samples/blob/main/AzureSQLDatabase/Vanna.ai/vanna_and_sql.ipynb",
    "details": {
        "author": "Brian Spendolini",
        "languages": ["T-SQL", "Python"],
        "services": ["Azure SQL"],
        "license": "MIT",        
        "related-links": {
            "blog": "https://devblogs.microsoft.com/azure-sql/vanna-ai-and-azure-sql-database/"
        }
    }
}
';

exec dbo.add_sample '
{
    "name": "Azure SQL DB - Retrieval Augmented Generation (RAG) with OpenAI", 
    "description": "Implement a RAG solution and call OpenAI right from Azure SQL DB to ask questions about your data", 
    "notes": "In this repo you will find a step-by-step guide on how to use Azure SQL Database to do Retrieval Augmented Generation (RAG) using the data you have in Azure SQL and integrating with OpenAI, directly from the Azure SQL database itself. You''ll be able to ask queries in natural language and get answers from the OpenAI GPT model, using the data you have in Azure SQL Database. The sample data is the Walmart US Product dataset, so that you can you RAG on product data and ask question like \"What are some good products to organize a birthday party for teenager boy?\" or \"Show me the best product for cleaning my car\" and get answers from the OpenAI model using the product data. The sample is using only and pure T-SQL.",
    "url": "https://github.com/Azure-Samples/azure-sql-db-chatbot",
    "details": {
        "authors": ["Davide Mauri", "Sanjay Mishra"],
        "languages": ["T-SQL"],
        "services": ["Azure SQL"],
        "license": "MIT",        
        "related-links": {
            "blog": "https://devblogs.microsoft.com/azure-sql/unleashing-the-potential-of-generative-ai-in-azure-sql-database/"
        }
    }
}
';

exec dbo.add_sample '
{
    "name": "Content Moderation", 
    "description": "In this folder are two T-SQL scripts that call Azure OpenAI Content Safety and Language AI. The Content Safety example will analyze a text string and return a severity in four categories: violence, sexual, self-harm, and hate. The Language AI script will analyze text and return what PII it found, what category of PII it is, and redact the results to obfuscate the PII in the original text string.",
    "url": "https://github.com/Azure-Samples/SQL-AI-samples/tree/main/AzureSQLDatabase/ContentModeration",
    "details": {
        "languages": ["T-SQL"],
        "services": ["Azure SQL"],
        "license": "MIT"
    }
}
';

exec dbo.add_sample '
{
    "name": "LangChain and Azure SQL Database", 
    "description": "This folder contains 2 python notebooks that use LangChain to create a NL2SQL agent against an Azure SQL Database. The notebooks use either Azure OpenAI or OpenAI for the LLM. To get started immedietly, you can create a codespace on this repository, use the terminal to change to the LangChain directory and follow one of the notebooks.",
    "url": "https://github.com/Azure-Samples/SQL-AI-samples/tree/main/AzureSQLDatabase/LangChain",
    "details": {
        "languages": ["T-SQL"],
        "services": ["Azure SQL"],
        "license": "MIT"
    }
}
';


select * from dbo.samples;

