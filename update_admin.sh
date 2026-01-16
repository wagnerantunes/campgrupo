#!/bin/bash

# Este script atualiza a senha do admin no banco de dados da VPS
# Executar dentro da VPS

NEW_USER="wagnerantunes84@gmail.com"
NEW_PASS_HASH="\$2a\$10\$Yk/0/9./1././././././.123456789012345678901234567890" # Hash placeholder

# Precisamos gerar o hash do bcrypt para a senha "GGX5A27@CampGrupo2021"
# Vamos usar um script node temporario para isso

cat > gen_hash.js <<EOF
const bcrypt = require('bcryptjs');
const pass = 'GGX5A27@CampGrupo2021';
const hash = bcrypt.hashSync(pass, 10);
console.log(hash);
EOF

# Instalar bcryptjs se nao tiver, ou usar do projeto
cd /var/www/campgrupo-api
REAL_HASH=\$(node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('GGX5A27@CampGrupo2021', 10));")

echo "🔑 Gerando hash seguro..."
echo "Hash gerado: \$REAL_HASH"

DB_CMD="UPDATE users SET username='$NEW_USER', password='\$REAL_HASH' WHERE username='admin';"

echo "💾 Atualizando banco de dados..."
sudo -u postgres psql -d campgrupo_assets -c "$DB_CMD"

echo "✅ Admin atualizado com sucesso!"
echo "   Novo Usuário: $NEW_USER"
echo "   Nova Senha:   GGX5A27@CampGrupo2021"
