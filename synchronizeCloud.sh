:: Type the command "cmd < synchronizeCloud.sh"
gsutil -m rsync -r assets gs://poly-algo-theory/assets
echo "Assets Directory Synced"
gsutil -m rsync -r content gs://poly-algo-theory/content
echo "Contents Directory Synced"
gsutil -m rsync ./ gs://poly-algo-theory
:: gsutil cp index.html gs://poly-algo-theory
echo "Base Directory Synced"

:: Now Git changes
git add -A
git commit -m "content changes"
git push
