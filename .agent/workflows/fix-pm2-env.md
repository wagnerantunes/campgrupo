# SOLUÇÃO DEFINITIVA: Backend não conecta no Supabase

## Problema Identificado

O PM2 está rodando mas o dotenv não carrega o .env corretamente quando iniciado pelo PM2.

## Solução

Usar ecosystem.config.js do PM2 com variáveis de ambiente explícitas.

```bash
# 1. Criar ecosystem.config.js
cat > /var/www/campgrupo-api/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'camp-api',
    script: './dist/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      DATABASE_URL: 'postgresql://postgres:MaxGGX5A27%40Supabase%21984%23@db.axhiuviuiruabcnckqmb.supabase.co:5432/postgres',
      JWT_SECRET: 'camp_secret_key_prod_v1',
      SMTP_HOST: 'smtp.hostinger.com',
      SMTP_PORT: 465,
      SMTP_USER: 'vendas@campgrupo.com.br',
      SMTP_PASS: 'C&BTrE?hIsb^1',
      SMTP_FROM: 'Grupo Camp <vendas@campgrupo.com.br>',
      BASE_URL: 'https://api.campgrupo.com.br'
    }
  }]
}
EOF

# 2. Iniciar com ecosystem
pm2 delete camp-api 2>/dev/null
pm2 start ecosystem.config.js
pm2 save

# 3. Verificar
pm2 logs camp-api --lines 10 --nostream
```

## Adicionar ao Protocolo

Sempre usar ecosystem.config.js ao invés de .env para PM2!
