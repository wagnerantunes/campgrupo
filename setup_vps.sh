#!/bin/bash

# ==========================================
# SCRIPT AUTOMÁTICO DE VPS (CampGrupo)
# ==========================================

DOMAIN="api.campgrupo.com.br"
PORT="3001"
APP_DIR="/var/www/campgrupo-api"

echo "🚀 Iniciando configuração da VPS para $DOMAIN..."

# 1. Update e Instalações Básicas
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y curl git nginx certbot python3-certbot-nginx

# 2. Node.js 20 LTS
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

# 3. PM2
npm install -g pm2

# 4. Configurar Pasta
mkdir -p $APP_DIR
# Tentar encontrar o arquivo de deploy na pasta atual (/root normalmente)
if [ -f "deploy-backend.tar.gz" ]; then
    echo "📦 Encontrado pacote de deploy! Movendo..."
    mv deploy-backend.tar.gz $APP_DIR/
    cd $APP_DIR
    tar -xzf deploy-backend.tar.gz
    rm deploy-backend.tar.gz
    
    echo "📦 Instalando dependências..."
    npm install
else
    echo "⚠️  Arquivo 'deploy-backend.tar.gz' não encontrado aqui."
    echo "   Certifique-se de fazer upload dele para $APP_DIR depois."
fi

# 5. Configurar Nginx
cat > /etc/nginx/sites-available/$DOMAIN <<EOF
server {
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default 2>/dev/null

# Restart Nginx
nginx -t && systemctl restart nginx

# 6. Iniciar Aplicação
cd $APP_DIR
# Parar anterior se existir
pm2 delete api 2>/dev/null
# Iniciar novo
pm2 start dist/index.js --name api --env production
pm2 save
pm2 startup | bash

echo "✅ INSTALAÇÃO CONCLUÍDA!"
echo "------------------------------------------------"
echo "🌐 API deve estar rodando em: http://$DOMAIN"
echo "🔒 Para ativar HTTPS, rode: certbot --nginx -d $DOMAIN"
echo "📝 Não esqueça de apontar o DNS (Tipo A) de 'api' para este IP!"
echo "------------------------------------------------"
