#!/bin/bash
# Fixed script - no complex inline execution to avoid escaping hell

cd /var/www/campgrupo-api

# Create temporary JS file locally on VPS
cat > temp_hash.cjs <<EOF
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('GGX5A27@CampGrupo2021', 10);
console.log(hash);
EOF

# Execute
REAL_HASH=$(node temp_hash.cjs)
rm temp_hash.cjs

echo "🔑 Hash gerado: $REAL_HASH"

NEW_USER="wagnerantunes84@gmail.com"
DB_CMD="INSERT INTO admin_users (username, password_hash) VALUES ('$NEW_USER', '$REAL_HASH') ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash;"

echo "💾 Atualizando banco..."
sudo -u postgres psql -d campgrupo_assets -c "$DB_CMD"

echo "✅ Admin atualizado!"
