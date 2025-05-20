select * from dbo.samples
go

exec [web].[find_samples] 'samples using azure sql with semantic kernel', @debug=1, @nocache=1
go

exec [web].[find_samples] 'I want to build a solution to chat with my data', @debug=1, @nocache=1
go

exec [web].[find_samples] 'show me the last session recordings of 2025', @debug=1, @nocache=1
go

exec [web].[find_samples] 'show the latest code samples of 2025 ', @debug=1, @nocache=1
go

exec [web].[find_samples] 'show the sample that davide showed at MS Build 2025', @debug=1, @nocache=1
go

/*
    Publish with DAB https://aka.ms/dab
*/
-- dab init --database-type mssql --host-mode development --connection-string "@env('MSSQL')"
-- dab add FindSamples --source "dbo.find_samples" --source.type "stored-procedure" --permissions "anonymous:*" --rest "findSamples" -c .\staticwebapp.database.config.json
-- dab start --config .\swa-db-connections\staticwebapp.database.config.json

-- explore the API
-- http://localhost:5000/swagger

