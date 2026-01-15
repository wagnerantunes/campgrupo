#!/bin/bash
# Final fixed script - correct column: password_hash

NEW_USER="wagnerantunes84@gmail.com"
NEW_PASS="GGX5A27@CampGrupo2021"
APP_DIR="/var/www/campgrupo-api"

cd $APP_DIR

# CommonJS script to generate hash
cat > gen_hash.cjs <<EOF
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('$NEW_PASS', 10);
console.log(hash);
EOF

REAL_HASH=$(node gen_hash.cjs)
rm gen_hash.cjs

echo "🔑 Generated Hash: $REAL_HASH"

# Update/Insert using password_hash column
SQL_CMD="INSERT INTO admin_users (username, password_hash) VALUES ('$NEW_USER', '$REAL_HASH') ON CONFLICT (username) DO UPDATE SET password_hash = '$REAL_HASH';"

echo "💾 Updating database table admin_users..."
sudo -u postgres psql -d campgrupo_assets -c "$SQL_CMD"

echo "✅ Success! New admin credentials are active."
echo "Email: $NEW_USER"
