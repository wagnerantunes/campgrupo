# Guia de Deploy na Hostinger (CampGrupo)

Este projeto usa **React (Frontend)**, **Node.js (Backend)** e **PostgreSQL (Banco de Dados)**.

Como a Hostinger geralmente usa **MySQL** em planos de hospedagem compartilhada, você tem duas opções principais:

---

## OPÇÃO 1: Hospedagem Compartilhada (hPanel)

_Se você usa o plano "Hospedagem Web" ou "Cloud" padrão._

### 1. Banco de Dados (Atenção ⚠️)

A hospedagem compartilhada da Hostinger **não suporta PostgreSQL** nativamente.
**Solução Recomendada:** Crie um banco de dados PostgreSQL gratuito em serviços externos como **Neon.tech**, **Supabase** ou **Render**.

- Após criar, você receberá uma `DATABASE_URL` (ex: `postgres://user:pass@host/db`). Guarde-a.

### 2. Backend (API)

Você precisará usar a ferramenta **"Setup Node.js App"** no hPanel.

1.  Crie um subdomínio, ex: `api.campgrupo.com.br` (aponte para uma pasta nova, ex: `public_html/api`).
2.  No hPanel, vá em "Setup Node.js App".
3.  Crie uma aplicação apontando para essa pasta.
4.  Faça upload de todos os arquivos da pasta `server/` do projeto para lá.
5.  Faça upload do `.env` dentro dessa pasta e edite as variáveis:
    ```env
    DATABASE_URL=sua_url_do_postgres_externo
    JWT_SECRET=sua_senha_segura
    PORT=3000 (ou a porta que a Hostinger indicar)
    SMTP_HOST=smtp.hostinger.com
    SMTP_PORT=465
    ...
    ```
6.  Instale as dependências (botão "NPM Install" no painel).
7.  Inicie o app.

### 3. Frontend (Site)

1.  No seu computador (ou aqui), gere a versão de produção apontando para a API real:
    - Edite o arquivo `.env.production` (crie se não existir na raiz) com:
      ```
      VITE_API_URL=https://api.campgrupo.com.br
      VITE_UPLOAD_URL=https://api.campgrupo.com.br/uploads
      ```
    - Rode o comando: `npm run build`
2.  Pegue o conteúdo da pasta `dist/` gerada.
3.  Vá no gerenciador de arquivos da Hostinger.
4.  Abra a pasta `public_html` (do domínio principal).
5.  Apague o conteúdo antigo e faça upload dos arquivos da pasta `dist/`.
6.  ⚠️ **Importante para React Router:** Crie um arquivo chamado `.htaccess` na pasta `public_html` com o seguinte conteúdo para que as páginas /obrigado, /admin, etc funcionem ao recarregar:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

---

## OPÇÃO 2: VPS (Servidor Virtual)

_Se você tem acesso root/SSH ao servidor._

Esta é a opção ideal, pois você pode instalar o PostgreSQL nativamente.

1.  Instale Docker e Docker Compose no VPS.
2.  Clone o repositório lá.
3.  Rode `docker-compose up -d --build`.
4.  Configure um Proxy Reverso (Nginx) para apontar:
    - `campgrupo.com.br` -> Porta 80 do container Frontend (ou sirva os arquivos estáticos diretamente).
    - `api.campgrupo.com.br` -> Porta 3001 do container Backend.

---

### Resumo do que fizemos agora:

1.  Geramos o build de produção localmente na pasta `dist/`.
2.  O código está pronto e salvo no Git.

**Se tiver dúvidas sobre qual plano você tem ou como configurar, me avise!**
