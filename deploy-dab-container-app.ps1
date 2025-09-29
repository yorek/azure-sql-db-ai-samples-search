#Requires -Version 7.0
<#
.SYNOPSIS
    Deploy Data API Builder (DAB) to Azure Container Apps with Storage Account and Managed Identity
    
.DESCRIPTION
    This script deploys a Data API Builder application to Azure Container Apps using:
    - Azure Storage Account to store the DAB configuration file
    - User-assigned Managed Identity for secure access to storage
    - Azure Container Registry for storing the DAB container image
    - Azure SQL Database connection string from .env file (MSSQL variable)
    
.PARAMETER ResourceGroupName
    Name of the Azure Resource Group (will be created if it doesn't exist)
    
.PARAMETER Location
    Azure region for deployment (default: East US)
    
.PARAMETER AppName
    Base name for all Azure resources (will be used as prefix)
    
.PARAMETER ContainerAppName
    Name of the Container App (default: {AppName}-dab-api)
    
.PARAMETER Owner
    Owner name to be added as a tag to all created resources
    
.PARAMETER SkipBuild
    Skip building and pushing the container image (use existing image)

.NOTES
    This script requires a .env file in the current directory with the MSSQL environment variable:
    MSSQL="Server=tcp:yourserver.database.windows.net,1433;Database=yourdb;Authentication='Active Directory Default';"
    
.EXAMPLE
    .\deploy-dab-container-app.ps1 -ResourceGroupName "rg-dab-demo" -AppName "dabdemo" -Owner "john.doe@company.com"
    
.EXAMPLE
    .\deploy-dab-container-app.ps1 -ResourceGroupName "rg-dab-demo" -AppName "dabdemo" -Owner "john.doe@company.com" -Location "West US 2" -SkipBuild
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory = $false)]
    [string]$Location = "Central US",
    
    [Parameter(Mandatory = $true)]
    [string]$AppName,
    
    [Parameter(Mandatory = $false)]
    [string]$ContainerAppName = "$AppName-dab-api",
    
    [Parameter(Mandatory = $true)]
    [string]$Owner,
    
    [Parameter(Mandatory = $false)]
    [switch]$SkipBuild
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Validate prerequisites
Write-Host "🔍 Validating prerequisites..." -ForegroundColor Blue

# Check if Azure CLI is installed
try {
    $azResult = az version --output json 2>$null | ConvertFrom-Json
    if (-not $azResult) {
        throw "Azure CLI not found"
    }
    $azVersion = $azResult.'azure-cli'
    Write-Host "✅ Azure CLI version: $azVersion" -ForegroundColor Green
}
catch {
    Write-Error "❌ Azure CLI is not installed. Please install it from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
}

# Check if Docker is installed and running
try {
    $dockerVersion = docker version --format '{{.Client.Version}}' 2>$null
    if (-not $dockerVersion) {
        throw "Docker not found or not running"
    }
    Write-Host "✅ Docker version: $dockerVersion" -ForegroundColor Green
}
catch {
    Write-Error "❌ Docker is not installed or not running. Please install Docker Desktop."
    exit 1
}

# Check if logged into Azure
try {
    $account = az account show --output json 2>$null | ConvertFrom-Json
    if (-not $account) {
        throw "Not logged in"
    }
    Write-Host "✅ Logged into Azure as: $($account.user.name)" -ForegroundColor Green
    Write-Host "✅ Using subscription: $($account.name) ($($account.id))" -ForegroundColor Green
}
catch {
    Write-Error "❌ Not logged into Azure. Please run 'az login' first."
    exit 1
}

# Load environment variables from .env file
Write-Host "📄 Loading environment variables from .env file..." -ForegroundColor Blue
$envFilePath = ".env"
if (-not (Test-Path $envFilePath)) {
    Write-Error "❌ .env file not found at: $envFilePath"
    exit 1
}

$SqlConnectionString = $null
Get-Content $envFilePath | ForEach-Object {
    if ($_ -match '^MSSQL=(.*)$') {
        $SqlConnectionString = $matches[1].Trim('"')
    }
}

if (-not $SqlConnectionString) {
    Write-Error "❌ MSSQL environment variable not found in .env file"
    exit 1
}

Write-Host "✅ MSSQL connection string loaded from .env file" -ForegroundColor Green

# Generate unique names for resources
$timestamp = Get-Date -Format "yyyyMMddHHmm"
$uniqueSuffix = "$AppName$timestamp".ToLower() -replace '[^a-z0-9]', ''
$storageAccountName = "st$($uniqueSuffix.Substring(0, [Math]::Min(18, $uniqueSuffix.Length)))"
$acrName = "acr$($uniqueSuffix.Substring(0, [Math]::Min(15, $uniqueSuffix.Length)))"
$managedIdentityName = "id-$AppName-dab"
$containerAppEnvName = "cae-$AppName"
$logAnalyticsName = "law-$AppName"

Write-Host "🚀 Starting deployment with the following configuration:" -ForegroundColor Blue
Write-Host "   Resource Group: $ResourceGroupName" -ForegroundColor White
Write-Host "   Location: $Location" -ForegroundColor White
Write-Host "   Storage Account: $storageAccountName" -ForegroundColor White
Write-Host "   Container Registry: $acrName" -ForegroundColor White
Write-Host "   Managed Identity: $managedIdentityName" -ForegroundColor White
Write-Host "   Container App Environment: $containerAppEnvName" -ForegroundColor White
Write-Host "   Container App: $ContainerAppName" -ForegroundColor White

# Enable required Azure CLI extensions
Write-Host "🔧 Enabling required Azure CLI extensions..." -ForegroundColor Blue
az extension add --name containerapp --upgrade --only-show-errors
az extension add --name log-analytics --only-show-errors

# Register required resource providers
Write-Host "📋 Registering required resource providers..." -ForegroundColor Blue
az provider register --namespace Microsoft.ContainerRegistry --only-show-errors
az provider register --namespace Microsoft.App --only-show-errors
az provider register --namespace Microsoft.OperationalInsights --only-show-errors

# Create resource group
Write-Host "📁 Creating resource group..." -ForegroundColor Blue
az group create --name $ResourceGroupName --location $Location --tags "Owner=$Owner" --output none
Write-Host "✅ Resource group '$ResourceGroupName' created/updated" -ForegroundColor Green

# Create user-assigned managed identity
Write-Host "🔐 Creating user-assigned managed identity..." -ForegroundColor Blue
$identityResult = az identity create `
    --resource-group $ResourceGroupName `
    --name $managedIdentityName `
    --location $Location `
    --tags "Owner=$Owner" `
    --output json | ConvertFrom-Json

$identityId = $identityResult.id
$identityClientId = $identityResult.clientId
$identityPrincipalId = $identityResult.principalId

Write-Host "✅ Managed identity created: $managedIdentityName" -ForegroundColor Green
Write-Host "   Client ID: $identityClientId" -ForegroundColor White
Write-Host "   Principal ID: $identityPrincipalId" -ForegroundColor White

# Create Azure Storage Account
Write-Host "💾 Creating storage account..." -ForegroundColor Blue
az storage account create `
    --resource-group $ResourceGroupName `
    --name $storageAccountName `
    --location $Location `
    --sku Standard_LRS `
    --kind StorageV2 `
    --access-tier Hot `
    --allow-blob-public-access false `
    --allow-shared-key-access false `
    --min-tls-version TLS1_2 `
    --tags "Owner=$Owner" `
    --output none

Write-Host "✅ Storage account '$storageAccountName' created" -ForegroundColor Green

# Assign Storage Blob Data Reader role to managed identity
Write-Host "🔒 Assigning Storage Blob Data Reader role to managed identity..." -ForegroundColor Blue
$storageAccountId = az storage account show --resource-group $ResourceGroupName --name $storageAccountName --query id --output tsv

az role assignment create `
    --assignee $identityPrincipalId `
    --role "Storage Blob Data Reader" `
    --scope $storageAccountId `
    --output none

Write-Host "✅ Storage Blob Data Reader role assigned" -ForegroundColor Green

# Create container for DAB config
Write-Host "📦 Creating blob container for DAB configuration..." -ForegroundColor Blue
az storage container create `
    --account-name $storageAccountName `
    --name "dab-config" `
    --auth-mode login `
    --public-access off `
    --output none

Write-Host "✅ Blob container 'dab-config' created" -ForegroundColor Green

# Upload DAB configuration file to storage
Write-Host "📤 Uploading DAB configuration file..." -ForegroundColor Blue
$dabConfigPath = "swa-db-connections\staticwebapp.database.config.json"

if (-not (Test-Path $dabConfigPath)) {
    Write-Error "❌ DAB configuration file not found at: $dabConfigPath"
    exit 1
}

# Modify the DAB config to use production mode and environment variable for connection string
$dabConfig = Get-Content $dabConfigPath -Raw | ConvertFrom-Json
$dabConfig.runtime.host.mode = "production"
$dabConfig.'data-source'.'connection-string' = "@env('MSSQL_CONNECTION_STRING')"

# Save modified config to temp file
$tempConfigPath = [System.IO.Path]::GetTempFileName() + ".json"
$dabConfig | ConvertTo-Json -Depth 10 | Set-Content $tempConfigPath

az storage blob upload `
    --account-name $storageAccountName `
    --container-name "dab-config" `
    --name "dab-config.json" `
    --file $tempConfigPath `
    --auth-mode login `
    --output none `
    --overwrite

Remove-Item $tempConfigPath -Force
Write-Host "✅ DAB configuration uploaded to storage" -ForegroundColor Green

# Create Azure Container Registry
Write-Host "🐳 Creating Azure Container Registry..." -ForegroundColor Blue
az acr create `
    --resource-group $ResourceGroupName `
    --name $acrName `
    --sku Basic `
    --location $Location `
    --admin-enabled false `
    --tags "Owner=$Owner" `
    --output none

Write-Host "✅ Container registry '$acrName' created" -ForegroundColor Green

# Assign AcrPull role to managed identity
$acrId = az acr show --resource-group $ResourceGroupName --name $acrName --query id --output tsv
az role assignment create `
    --assignee $identityPrincipalId `
    --role "AcrPull" `
    --scope $acrId `
    --output none

Write-Host "✅ AcrPull role assigned to managed identity" -ForegroundColor Green

# Build and push DAB container image
if (-not $SkipBuild) {
    Write-Host "🔨 Building and pushing DAB container image..." -ForegroundColor Blue
    
    # Create Dockerfile for DAB
    $dockerfileContent = @"
FROM mcr.microsoft.com/azure-databases/data-api-builder:latest

# Set environment variables
ENV DAB_ENVIRONMENT=production
ENV DAB_CONFIG_FILE_PATH="/app/dab-config.json"

# Create app directory
WORKDIR /app

# Create startup script
RUN echo '#!/bin/bash' > /app/start.sh && \
    echo 'set -e' >> /app/start.sh && \
    echo 'echo "Downloading DAB configuration from Azure Storage..."' >> /app/start.sh && \
    echo 'curl -H "Authorization: Bearer \$AZURE_CLIENT_ID" -H "x-ms-version: 2020-04-08" -o /app/dab-config.json "https://'$storageAccountName'.blob.core.windows.net/dab-config/dab-config.json"' >> /app/start.sh && \
    echo 'if [ ! -f /app/dab-config.json ]; then' >> /app/start.sh && \
    echo '  echo "Failed to download DAB configuration file"' >> /app/start.sh && \
    echo '  exit 1' >> /app/start.sh && \
    echo 'fi' >> /app/start.sh && \
    echo 'echo "Starting Data API Builder..."' >> /app/start.sh && \
    echo 'exec dab start --config /app/dab-config.json --no-https-redirect' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expose port
EXPOSE 5000

# Start the application
CMD ["/app/start.sh"]
"@

    $dockerfileContent | Set-Content "Dockerfile.dab"
    
    # Login to ACR using expose-token method
    Write-Host "   Logging into ACR..." -ForegroundColor White
    $acrToken = az acr login --name $acrName --expose-token --output json | ConvertFrom-Json
    
    # Login to Docker using the ACR token
    $acrToken.accessToken | docker login $acrToken.loginServer --username 00000000-0000-0000-0000-000000000000 --password-stdin
    
    $imageTag = "$acrName.azurecr.io/dab-api:latest"
    
    Write-Host "   Building container image..." -ForegroundColor White
    docker build -t $imageTag -f Dockerfile.dab .
    
    Write-Host "   Pushing container image..." -ForegroundColor White
    docker push $imageTag
    
    Remove-Item "Dockerfile.dab" -Force
    Write-Host "✅ Container image built and pushed: $imageTag" -ForegroundColor Green
}
else {
    $imageTag = "$acrName.azurecr.io/dab-api:latest"
    Write-Host "⏭️  Skipping build, using existing image: $imageTag" -ForegroundColor Yellow
}

# Create Log Analytics workspace
Write-Host "📊 Creating Log Analytics workspace..." -ForegroundColor Blue
az monitor log-analytics workspace create `
    --resource-group $ResourceGroupName `
    --workspace-name $logAnalyticsName `
    --location $Location `
    --tags "Owner=$Owner" `
    --output none

$logAnalyticsId = az monitor log-analytics workspace show `
    --resource-group $ResourceGroupName `
    --workspace-name $logAnalyticsName `
    --query customerId `
    --output tsv

$logAnalyticsKey = az monitor log-analytics workspace get-shared-keys `
    --resource-group $ResourceGroupName `
    --workspace-name $logAnalyticsName `
    --query primarySharedKey `
    --output tsv

Write-Host "✅ Log Analytics workspace created" -ForegroundColor Green

# Create Container App Environment
Write-Host "🌍 Creating Container App Environment..." -ForegroundColor Blue
az containerapp env create `
    --resource-group $ResourceGroupName `
    --name $containerAppEnvName `
    --location $Location `
    --logs-workspace-id $logAnalyticsId `
    --logs-workspace-key $logAnalyticsKey `
    --tags "Owner=$Owner" `
    --output none

Write-Host "✅ Container App Environment '$containerAppEnvName' created" -ForegroundColor Green

# Create Container App
Write-Host "🚀 Creating Container App..." -ForegroundColor Blue

az containerapp create `
    --resource-group $ResourceGroupName `
    --name $ContainerAppName `
    --environment $containerAppEnvName `
    --image $imageTag `
    --target-port 5000 `
    --ingress external `
    --min-replicas 1 `
    --max-replicas 10 `
    --cpu 0.5 `
    --memory 1Gi `
    --registry-server "$acrName.azurecr.io" `
    --user-assigned $identityId `
    --env-vars "MSSQL_CONNECTION_STRING=$SqlConnectionString" "AZURE_CLIENT_ID=$identityClientId" "STORAGE_ACCOUNT_NAME=$storageAccountName" `
    --tags "Owner=$Owner" `
    --output none

Write-Host "✅ Container App '$ContainerAppName' created" -ForegroundColor Green

# Get Container App URL
$containerAppUrl = az containerapp show `
    --resource-group $ResourceGroupName `
    --name $ContainerAppName `
    --query properties.configuration.ingress.fqdn `
    --output tsv

Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Deployment Summary:" -ForegroundColor Blue
Write-Host "   Container App URL: https://$containerAppUrl" -ForegroundColor White
Write-Host "   API Endpoint: https://$containerAppUrl/rest" -ForegroundColor White
Write-Host "   Health Check: https://$containerAppUrl/health" -ForegroundColor White
Write-Host "   Resource Group: $ResourceGroupName" -ForegroundColor White
Write-Host "   Storage Account: $storageAccountName" -ForegroundColor White
Write-Host "   Container Registry: $acrName" -ForegroundColor White
Write-Host "   Managed Identity: $managedIdentityName" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Useful Commands:" -ForegroundColor Blue
Write-Host "   View logs: az containerapp logs show --name $ContainerAppName --resource-group $ResourceGroupName --follow" -ForegroundColor White
Write-Host "   Update config: az storage blob upload --account-name $storageAccountName --container-name dab-config --name dab-config.json --file <new-config-file> --auth-mode login --overwrite" -ForegroundColor White
Write-Host "   Restart app: az containerapp revision restart --name $ContainerAppName --resource-group $ResourceGroupName" -ForegroundColor White
Write-Host ""
Write-Host "🧪 Test your API:" -ForegroundColor Blue
Write-Host "   curl https://$containerAppUrl/rest/samples" -ForegroundColor White
Write-Host "   curl https://$containerAppUrl/rest/findSamples -X POST -H 'Content-Type: application/json' -d '{\"query\": \"semantic search\"}'" -ForegroundColor White

# Optional: Open the URL in default browser
$openUrl = Read-Host "Would you like to open the Container App URL in your browser? (y/N)"
if ($openUrl -eq 'y' -or $openUrl -eq 'Y') {
    Start-Process "https://$containerAppUrl"
}