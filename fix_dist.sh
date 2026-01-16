
cd /var/www/campgrupo-api
# Force install deps if missing
npm install
# Rebuild just in case
npm run build
# Start
pm2 start dist/index.js --name api --env production
pm2 save
