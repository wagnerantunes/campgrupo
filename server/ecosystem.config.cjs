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
      PORT: '3001',
      DATABASE_URL: 'postgresql://postgres:MaxGGX5A27%40Supabase%21984%23@db.axhiuviuiruabcnckqmb.supabase.co:5432/postgres',
      JWT_SECRET: 'camp_secret_key_prod_v1',
      SMTP_HOST: 'smtp.hostinger.com',
      SMTP_PORT: '465',
      SMTP_USER: 'vendas@campgrupo.com.br',
      SMTP_PASS: 'C&BTrE?hIsb^1',
      SMTP_FROM: 'Grupo Camp <vendas@campgrupo.com.br>',
      BASE_URL: 'https://api.campgrupo.com.br'
    }
  }]
}
