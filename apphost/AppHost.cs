var builder = DistributedApplication.CreateBuilder(args);

var openAIURL = builder.AddParameter("openai-url");
var openAIKey = builder.AddParameter("openai-key");
var embeddingDeploymentName = builder.AddParameter("embedding-deployment-name");
var chatDeploymentName = builder.AddParameter("chat-deployment-name");

// var sqlSrv = builder.AddSqlServer("sqlsrv", port: 1435)    
//     .WithLifetime(ContainerLifetime.Persistent);
// var db = sqlSrv.AddDatabase("db");

var db = builder.AddConnectionString("db");

var dbDeploy = builder.AddProject<Projects.database_deploy>("dbDeploy")
    .WithEnvironment(context =>
    {
        context.EnvironmentVariables["MSSQL"] = db.Resource.ConnectionStringExpression;
        context.EnvironmentVariables["OPENAI_URL"] = openAIURL;
        context.EnvironmentVariables["OPENAI_KEY"] = openAIKey;
        context.EnvironmentVariables["OPENAI_EMBEDDING_DEPLOYMENT_NAME"] = embeddingDeploymentName;
        context.EnvironmentVariables["OPENAI_CHAT_DEPLOYMENT_NAME"] = chatDeploymentName;
    })
    .WithReference(db)
    .WaitFor(db);

openAIKey.WithParentRelationship(dbDeploy);
openAIURL.WithParentRelationship(dbDeploy);
embeddingDeploymentName.WithParentRelationship(dbDeploy);
chatDeploymentName.WithParentRelationship(dbDeploy);

var dab = builder.AddDataAPIBuilder("dab", "../dab/dab-config.json")
    .WithImageTag("latest")
    .WithEnvironment(context =>
    {
        context.EnvironmentVariables["MSSQL"] = db.Resource.ConnectionStringExpression;
    })
    .WithReference(db)
    .WaitFor(db)
    .WaitForCompletion(dbDeploy);

builder.AddNpmApp("web-client", "../client-v2", "dev")
    .WithReference(dab)
    .WaitFor(dab)
    .WithEnvironment("BROWSER", "none")
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints();

builder.Build().Run();
