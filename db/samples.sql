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

exec dbo.add_sample '
{
    "name": "Similar Content Finder", 
    "description": "Build a recommender using OpenAI, Azure Functions, Azure Static Web Apps, Azure SQL DB, Data API builder and Text Embeddings",
    "notes": "OpenAI embeddings, and thus vectors, can be used to perform similarity search and create solution that provide customer with a better user experience, better search results and in general a more natural way to find relevant data in a reference dataset. Due to ability to provide an answer even when search request do not perfectly match a given content, similary search is ideal for creating recommenders. In this specific sample we''re creating a conference session recommender.",
    "url": "https://github.com/Azure-Samples/azure-sql-db-session-recommender",
    "details": {
        "author": "Davide Mauri",
        "languages": ["T-SQL"],
        "services": ["Azure SQL", "Azure Functions", "Azure Static Web Apps", "Data API Builder"],
        "license": "MIT",
        "tags": ["End-to-End"]
    }
}
';

exec dbo.add_sample '
{
    "name": "Session Conference Assistant", 
    "description": "Build a Retrieval Augmented Generation solution using OpenAI, Azure Functions, Azure Static Web Apps, Azure SQL DB, Data API builder and Text Embeddings",
    "notes": "This sample demonstrates how to build a session assistant using Jamstack, Retrieval Augmented Generation (RAG) and Event-Driven architecture, using Azure SQL DB to store and search vectors embeddings generated using OpenAI. The solution is built using Azure Static Web Apps, Azure Functions, Azure SQL Database, and Azure OpenAI. A fully working, production ready, version of this sample, that has been used at VS Live conferences, is available here: https://ai.microsofthq.vslive.com/",
    "url": "https://github.com/azure-samples/azure-sql-db-session-recommender-v2",
    "details": {
        "author": "Davide Mauri",
        "languages": ["T-SQL"],
        "services": ["Azure SQL", "Azure Functions", "Azure Static Web Apps", "Data API Builder"],
        "license": "MIT",
        "tags": ["End-to-End"],
        "related-links": {
            "live-demo": "https://ai.microsofthq.vslive.com/"
        }
    }
}
';

exec dbo.add_sample '
{
    "name": "Chatbot on your own data with LangChain and Chainlit", 
    "description": "Sample RAG pattern using Azure SQL DB, Langchain and Chainlit",
    "notes": "Sample RAG pattern, with full UX, using Azure SQL DB, Langchain and Chainlit as demonstrated in the #RAGHack conference. Full details and video recording available here: https://github.com/microsoft/RAG_Hack/discussions/53.",
    "url": "https://github.com/Azure-Samples/azure-sql-db-rag-langchain-chainlit",
    "details": {
        "author": "Davide Mauri",
        "languages": ["T-SQL", "Python"],
        "frameworks": ["LangChain", "ChainLit"],
        "services": ["Azure SQL", "Azure Open AI", "Azure Functions"],
        "license": "MIT",
        "tags": ["End-to-End"],
        "related-links": {
            "blog": "https://devblogs.microsoft.com/azure-sql/build-a-chatbot-on-your-own-data-in-1-hour-with-azure-sql-langchain-and-chainlit/"
        }
    }
}
';

exec dbo.add_sample '
{
    "name": "Chatbot on structured and unstructured data with Semantic Kernel", 
    "description": "Using Azure SQL and Semantic Kernel to chat with your own data using a mix of NL2SQL and RAG",
    "notes": "A chatbot that can answer using RAG and using SQL Queries to answer any question you may want to ask it, be it on unstructured data (eg: what is the common issue raised for product XYZ) or on structured data (eg: how many customers from Canada called the support line?). Built using Semantic Kernel.",
    "url": "https://github.com/Azure-Samples/azure-sql-db-chat-sk",
    "details": {
        "author": "Davide Mauri",
        "languages": ["T-SQL", "C#", ".NET"],
        "frameworks": ["Semantic Kernel"],
        "services": ["Azure SQL", "Azure Functions", "Azure Static Web Apps"],
        "license": "MIT",
        "tags": ["End-to-End"],
        "related-links": {
            "live-demo": "https://ai.microsofthq.vslive.com/"
        }
    }
}
';

exec dbo.add_sample '
{
    "name": "SQL Server Database Development using Prompts as T-SQL Development", 
    "description": "In this notebook, we will learn how to use prompts as a way to develop and test Transact-SQL (T-SQL) code for SQL Server databases. Prompts are natural language requests that can be converted into T-SQL statements by using Generative AI models, such as GPT-4. This can help us write code faster, easier, and more accurately, as well as learn from the generated code examples.",
    "url": "https://github.com/Azure-Samples/SQL-AI-samples/tree/main/AzureSQLDatabase/Prompt-Based%20T-SQL%20Database%20Development",
    "details": {
        "languages": ["T-SQL"],
        "services": ["Azure SQL"],
        "license": "MIT",
        "tags": ["End-to-End"]
    }
}
';

exec dbo.add_sample '
{
    "name": "Redis Vector Search Demo Application using ACRE and Cache Prefetching from Azure SQL with Azure Functions", 
    "description": "We based this project from our Product Search Demo which showcase how to use Redis as a Vector Db. We modified the demo by adding a Cache Prefetching pattern from Azure SQL to ACRE using Azure Functions. The Azure Function uses a SQL Trigger that will trigger for any updates that happen in the table.",
    "url": "https://github.com/AzureSQLDB/redis-azure-ai-demo",
    "details": {
        "author": "Brian Spendolini",
        "languages": ["T-SQL", "Python", "Node", "Typescript"],        
        "services": ["Azure SQL", "Azure Redis"],
        "license": "MIT",
        "tags": ["End-to-End"],
        "related-links": {
            "blog": "https://aka.ms/azuresql-faiss"
        }
    }
}
';

exec dbo.add_sample '
{
    "name": "Similarity Search with FAISS and Azure SQL", 
    "description": "This contains Python notebooks that integrate Azure SQL Database with FAISS for efficient similarity search. The notebooks demonstrate how to store and query data in Azure SQL, leveraging FAISS for fast similarity search. We will be demonstrating it with Wikipedia movie plots data stored in Azure SQL. We’ll encode these movie plots into dense vectors using a pre-trained model and then create a FAISS index to perform similarity searches. Learn more in the detail blog and video: https://aka.ms/azuresql-faiss",
    "url": "https://github.com/Azure-Samples/SQL-AI-samples/tree/main/AzureSQLFaiss",
    "details": {
        "author": "Muazma Zahid",
        "languages": ["T-SQL", "Python"],        
        "services": ["Azure SQL"],
        "license": "MIT",
        "tags": ["End-to-End"]
    }
}
';

exec dbo.add_sample '
{
    "name": "Azure SQL DB Vector - KMeans Compute Node", 
    "description": "Use KMeans clustering to speed up vector search in Azure SQL DB",
    "notes": "Perform Approximate Nearest Neighbor (ANN) search on a vector column in Azure SQL DB using KMeans clustering. As KMeans clustering is a compute intensive operation, this project uses SciKit Learn library to perform the clustering and stores the results in a SQL DB table. The results are then used to perform ANN search on the vector column.",
    "url": "https://github.com/Azure-Samples/azure-sql-db-vectors-kmeans",
    "details": {
        "author": "Davide Mauri",
        "languages": ["T-SQL", "Python"],        
        "frameworks": ["Scikit-Learn"],
        "services": ["Azure SQL"],
        "license": "MIT",
        "tags": ["End-to-End"]
    }
}
';


exec dbo.add_sample '
{
    "name": "Native Vector Support in Azure SQL and SQL Server", 
    "description": "This repo hosts samples meant to help use the new Native Vector Support in Azure SQL DB feature. We illustrate key technical concepts and demonstrate how you can store and query embeddings in Azure SQL data to enhance your application with AI capabilities.",
    "notes": "Getting Started: A simple getting started to get familiar with common vector functions is available here: Getting-Started; Embeddings: Learn how to get embeddings from OpenAI directly from Azure SQL using the sample available the Embeddings/T-SQL folder; Vector Search: The Vector-Search example illustrates the implementation of Vector Similarity Search within an SQL database, highlighting the capabilities of semantic search. By leveraging vector representations of text, the system can identify reviews that share contextual similarities with a given search query, transcending the limitations of keyword exact matches. Additionally, it demonstrates the integration of Keyword Search to guarantee the inclusion of specific terms within the search outcomes; Hybrid Search: The Python sample in the Hybrid-Search folder shows how to combine Fulltext search in Azure SQL database with BM25 ranking and cosine similarity ranking to do hybrid search; Retrieval Augmented Generation: The RAG pattern is a powerful way to generate text using a pre-trained language model and a retrieval mechanism. The Retrieval Augmented Generation folder contains a sample that demonstrates how to use the RAG pattern with Azure SQL and Azure OpenAI, using Python notebooks; Entity Framework Core: If you are using .NET EF Core, you can use the EF-Core sample to see how to use the new vector functions in your application; Semantic Kernel: Semantic Kernel is an SDK that simplifies the creation of enterprise AI-enabled applications. Details on support for SQL Server and Azure SQL as vectors stores are available in the folder.",
    "url": "https://github.com/Azure-Samples/azure-sql-db-vector-search",
    "details": {
        "authors": ["Davide Mauri", "Pooja Kamath"],
        "languages": ["T-SQL", "Python", ".NET", "C#"],                
        "services": ["Azure SQL"],
        "license": "MIT"
    }
}
';

select * from dbo.samples 
--where [url] like '%kmeans%'



