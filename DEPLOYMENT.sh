# DEPLOYMENT
# cd ~/Documents/react/athares-server
# now && now alias
# Deploy front end
cd ~/Documents/react/athares-browser
npm run build
date +%Y-%m-%dT%H:%M:%S > build/version.txt
aws s3 sync ./build s3://athares-browser --delete --exclude '.DS_Store'
