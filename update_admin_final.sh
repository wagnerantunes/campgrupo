#!/bin/bash
# Script to update admin credentials on VPS

NEW_USER="wagnerantunes84@gmail.com"
NEW_PASS="GGX5A27@CampGrupo2021"
APP_DIR="/var/www/campgrupo-api"

cd $APP_DIR

# Create a CommonJS script to generate the hash
cat > gen_hash.cjs <<EOF
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('$NEW_PASS', 10);
console.log(hash);
EOF

# Generate hash
REAL_HASH=$(node gen_hash.cjs)
rm gen_hash.cjs

echo "🔑 Generated Hash: $REAL_HASH"

# Update the admin_users table (the correct name found)
DB_CMD="UPDATE admin_users SET username='$NEW_USER', password='$REAL_HASH' WHERE username='admin';"

echo "💾 Updating database..."
sudo -u postgres psql -d campgrupo_assets -c "$DB_CMD"

# Also ensure at least one admin exists if the update failed to find 'admin'
# Just in case 'admin' was already changed or doesn't exist
INSERT_CMD="INSERT INTO admin_users (username, password) VALUES ('$NEW_USER', '$REAL_HASH') ON CONFLICT (username) DO UPDATE SET password = '$REAL_HASH';"
sudo -u postgres psql -d campgrupo_assets -c "$INSERT_CMD"

echo "✅ Admin credentials updated!"
echo "User: $NEW_USER"
