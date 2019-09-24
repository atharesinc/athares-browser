# DEPLOYMENT
# cd ~/Documents/react/athares-server
# now && now alias
# Deploy front end
# cd ~/Documents/react/athares-browser
yarn run build
date +%Y-%m-%dT%H:%M:%S > build/version.txt
# upload the new compiled files to the s3 bucket and delete whatever wasn't overwritten
# also set the service worker and index.html so that they don't cache so aggressively
aws s3 sync ./build s3://athares-browser --delete --exclude '.DS_Store' 
aws s3 cp s3://athares-browser/service-worker.js s3://athares-browser/service-worker.js --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type application/javascript --acl public-read
aws s3 cp s3://athares-browser/index.html s3://athares-browser/index.html --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type text/html --acl public-read
aws s3 cp s3://athares-browser/manifest.webmanifest s3://athares-browser/manifest.webmanifest --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type application/json --acl public-read