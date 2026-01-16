#!/bin/bash

echo "🛠️ CORREÇÃO TOTAL (Postgres + EADDRINUSE)..."

# 1. PARAR TUDO QUE ESTIVER NA PORTA 3001
echo "🛑 Matando processos na porta 3001..."
fuser -k 3001/tcp
pm2 delete all || true

# 2. INSTALAR E CONFIGURAR POSTGRESQL
echo "🐘 Instalando PostgreSQL..."
apt-get install -y postgresql postgresql-contrib

# Iniciar serviço
systemctl start postgresql
systemctl enable postgresql

# Criar banco e usuário
echo "👤 Configurando usuário e banco 'campgrupo_assets'..."
sudo -u postgres psql -c "CREATE USER camp_user WITH PASSWORD 'camp_password';" || true
sudo -u postgres psql -c "CREATE DATABASE campgrupo_assets OWNER camp_user;" || true
sudo -u postgres psql -c "ALTER USER camp_user CREATEROLE CREATEDB;" || true

# 3. ATUALIZAR .ENV DA API
echo "📝 Atualizando .env para usar o Postgres local..."
cd /var/www/campgrupo-api
cat > .env <<EOF
DATABASE_URL=postgres://camp_user:camp_password@localhost:5432/campgrupo_assets
PORT=3001
JWT_SECRET=camp_secret_key_prod_v1
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=vendas@campgrupo.com.br
SMTP_PASS="C&BTrE?hIsb^1"
SMTP_FROM="Grupo Camp <vendas@campgrupo.com.br>"
EOF

# 4. REINICIAR API
echo "🚀 Reiniciando API com PM2..."
pm2 start dist/index.js --name api --env production
pm2 save

echo "✅ TUDO PRONTO! Banco criado e API reiniciada."
