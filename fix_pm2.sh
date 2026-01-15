
# Fix PM2 path
cd /var/www/campgrupo-api

# Check if index.js is at root or dist
if [ -f "index.js" ]; then
    echo "Found index.js at root."
    pm2 delete api 2>/dev/null
    pm2 start index.js --name api --env production
    pm2 save
elif [ -f "dist/index.js" ]; then
    echo "Found index.js in dist."
    pm2 delete api 2>/dev/null
    pm2 start dist/index.js --name api --env production
    pm2 save
else
    echo "CRITICAL: Could not find index.js in $(pwd) or $(pwd)/dist"
    ls -R
fi
