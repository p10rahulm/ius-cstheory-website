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

# Now attempt to directly update website through SSH
# Ensure local computer's ssh credentials are added to remote machine's ~/.ssh/authorized_keys
ssh -t polyalg@csacloud.iisc.ac.in -p 3232 "./syncPolyAlg.sh"
echo "Please check that the website https://polyalg.csa.iisc.ac.in/ is updated."
# If not, use:
# plink polyalg@csacloud.iisc.ac.in -P 3232 -pw P0ly@lg879
# ./syncPolyAlg.sh
# echo "Please check that the website https://polyalg.csa.iisc.ac.in/ is updated"
# exit
