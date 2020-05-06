:: This is a comment. Run the command as
:: powershell ./synctoGoogleCloud.bat
:: Only works for first line. Might as well copy paste

gsutil -m rsync -r assets gs://poly-algo-theory/assets
Write-Host –NoNewLine "First Line Done"
gsutil -m rsync -r content gs://poly-algo-theory/content
Write-Host –NoNewLine "Second Line Done"
gsutil cp index.html gs://poly-algo-theory
Write-Host –NoNewLine "Third Line Done"
