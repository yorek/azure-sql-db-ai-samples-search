exec dbo.add_sample '
{
    "name": "Building a Smart Chatbot with SQL Database in Microsoft Fabric, LangChain and Chainlit", 
    "url": "https://blog.fabric.microsoft.com/en-US/blog/building-a-smart-chatbot-with-sql-database-in-microsoft-fabric-langchain-and-chainlit/",
    "description": "Use Microsoft Fabric databases to build secure, native AI apps. This sample shows how to create a chatbot that answers product questions—boosting efficiency for growing e-commerce teams.",
    "notes": "Database in Microsoft Fabric, have significantly lowered the barrier for developers to create innovative AI applications. These innovations bring AI closer to data, empowering every developer to build an AI app natively and in a more secure manner. Imagine you''re the founder of Contoso, a rapidly growing e-commerce startup. As your online store grows, you realize that many customer inquiries are about basic product information: price, availability, and specific features. To automate these routine questions, you decide to build a chatbot. In this post, we''ll guide you through the process of creating a chatbot that can efficiently handle these product-related queries, freeing up your customer support team to focus on more complex issues.",
    "details": {
        "author": "Arun Vijayraghavan",
        "services": ["Fabric SQL"],
        "type": "article"
    }
}
';

exec dbo.add_sample '
{
    "name": "AI Ready Apps: build RAG Data pipeline from Azure Blob Storage to SQL Database in Microsoft Fabric within minutes", 
    "url": "https://blog.fabric.microsoft.com/en-us/blog/ai-ready-apps-build-rag-data-pipeline-from-azure-blob-storage-to-sql-database-in-microsoft-fabric-within-minutes",
    "description": "Learn how to build a Retrieval Augmented Generation (RAG) pipeline using SQL Database in Microsoft Fabric—a low-code platform for secure, enterprise-grade AI applications.",
    "notes": "Microsoft Fabric is a unified, secure, and user-friendly data platform equipped with features necessary for developing enterprise-grade applications with minimal or no coding required. Last year, the platform was enhanced by introducing SQL Database in Fabric, facilitating AI application development within Microsoft Fabric. In a previous blog post, we discussed how to build a chatbot using SQL Database in Fabric. This blog post will provide step-by-step instructions for creating a Retrieval Augmented Generation (RAG) pipeline to prepare your data for AI integration using SQL Database in Microsoft Fabric.",
    "details": {
        "author": "Arun Vijayraghavan",
        "services": ["Fabric SQL", "Azure Blob Storage"],        
        "type": "article",
        "tags": ["RAG", "Vectors", "Retrieval Augmented Generation", "AI", "GenAI", "PDF"]
    }
}
';

select * from dbo.samples where [url] like 'https://blog.fabric.microsoft.com%'

select * from dbo.samples where json_value(details, '$.type') = 'article'
