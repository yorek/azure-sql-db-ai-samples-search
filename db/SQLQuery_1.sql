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
        "license": "MIT",        
        "related-repos": [{
                "name": "Fast Data Loading in Azure SQL DB using Azure Databricks",
                "url": "https://github.com/Azure-Samples/azure-sql-db-databricks"
           }
        ]
    }
}
';

select * from dbo.samples;

