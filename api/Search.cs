using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AzureSQL.AISearch.API
{
    public class Search
    {
        private readonly ILogger<Search> _logger;

        public Search(ILogger<Search> logger)
        {
            _logger = logger;
        }

        [Function("Search")]
        public IActionResult Run([HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequest req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            var results = new[]
            {
                new
                {
                    name = "The Ultimate Chatbot",
                    url = "https://github.com/Azure-Samples/azure-sql-db-chat-sk",
                    description = "Using Azure SQL and Semantic Kernel to chat with your own data using a mix of NL2SQL and RAG."
                },
                new
                {
                    name = "RAG with AzureSQL, LangChain and Chainlit",
                    url = "https://github.com/Azure-Samples/azure-sql-db-rag-langchain-chainlit",
                    description = "Sample RAG pattern using Azure SQL DB, Langchain and Chainlit."
                }
            };

            return new OkObjectResult(results);
        }
    }
}
