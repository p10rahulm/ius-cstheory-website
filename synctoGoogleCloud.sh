#!/bin/sh
#Doesn't really work :-/ Copy below commands and run by yourself
gsutil -m rsync -r assets gs://poly-algo-theory/assets
gsutil -m rsync -r content gs://poly-algo-theory/content
gsutil cp index.html gs://poly-algo-theory
