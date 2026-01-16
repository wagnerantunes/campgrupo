# 🚀 PROTOCOLO DE DEPLOY - CAMPGRUPO

## 🏗️ ARQUITETURA DO PROJETO

- **Frontend**: Hospedado na **Hostinger Cloud**.
- **API (Backend)**: Hospedado na **VPS** (IP: `72.60.139.82`).
- **Banco de Dados**: Hospedado no **Supabase** (PostgreSQL).

## 🚀 MECANISMO DE DEPLOY

- **Frontend**: **DEPLOY AUTOMÁTICO**. Basta fazer o `git push origin main`. A Hostinger Cloud identifica a mudança no repositório e puxa/atualiza os arquivos sozinha. Não é necessário build manual ou upload via FTP para o frontend.
- **Backend**: Deploy manual ou via script na VPS (conforme instruções abaixo).

---

### ✅ PRÉ-DEPLOY (Local)

- [ ] Testar todas as alterações localmente
- [ ] Verificar se não há erros de lint/typescript
- [ ] Commit com mensagem descritiva
- [ ] Push para GitHub (branch main)

### ✅ DEPLOY BACKEND (VPS 72.60.139.82)

#### 1. Verificar Estado Atual

```bash
ssh root@72.60.139.82
pm2 list
pm2 logs camp-api --lines 5 --nostream
```

#### 2. Deploy do Código

```bash
# Upload do arquivo principal
scp server/index.ts root@72.60.139.82:/var/www/campgrupo-api/index.ts

# Verificar .env está correto
ssh root@72.60.139.82 "cat /var/www/campgrupo-api/.env"
# Deve conter DATABASE_URL com senha URL-encoded: %40 para @, %21 para !, %23 para #
```

#### 3. Build e Restart

```bash
ssh root@72.60.139.82 "cd /var/www/campgrupo-api && npm run build"
ssh root@72.60.139.82 "pm2 restart camp-api"
```

#### 4. Verificação Pós-Deploy

```bash
# Verificar se está rodando
ssh root@72.60.139.82 "pm2 list | grep camp-api"

# Verificar logs (sem erros)
ssh root@72.60.139.82 "pm2 logs camp-api --lines 10 --nostream"

# Testar health check
curl https://api.campgrupo.com.br/health
```

### ✅ DEPLOY FRONTEND (Hostinger Deployments)

#### 1. Verificar Build Local

```bash
npm run build
# Verificar se dist/ foi criado sem erros
```

#### 2. Push para GitHub

```bash
git add .
git commit -m "feat: descrição da mudança"
git push origin main
```

#### 3. Aguardar Deploy Automático

- Acessar: https://hpanel.hostinger.com/deployments
- Verificar status do deploy
- Aguardar conclusão (geralmente 2-5 minutos)

#### 4. Verificação Pós-Deploy

```bash
# Testar site
curl -I https://campgrupo.com.br

# Verificar painel admin
# Acessar: https://campgrupo.com.br/area-restrita
# Login: wagnerantunes84@gmail.com / GGX5A27@CampGrupo2021
```

### ✅ TESTES FUNCIONAIS

#### Backend

- [ ] Health check responde: `GET /health`
- [ ] Login funciona: `POST /api/login`
- [ ] Upload de imagem funciona: `POST /api/upload`
- [ ] Listagem de mídia funciona: `GET /api/media`
- [ ] Deleção de mídia funciona: `DELETE /api/media/:filename`
- [ ] Salvar config funciona: `POST /api/config`
- [ ] Leads são salvos: `POST /api/leads`

#### Frontend

- [ ] Site carrega sem erros no console
- [ ] Painel admin abre
- [ ] Login funciona
- [ ] Upload de imagens funciona
- [ ] Imagens aparecem na aba Mídia
- [ ] Deletar imagem funciona
- [ ] Salvar configurações persiste dados
- [ ] Logout funciona

### ✅ LIMPEZA E MANUTENÇÃO

#### Cache

```bash
# Limpar cache do navegador (Ctrl+Shift+R)
# Ou testar em aba anônima
```

#### PM2

```bash
# Se houver problemas, reiniciar limpo
ssh root@72.60.139.82 "pm2 delete all && pm2 start /var/www/campgrupo-api/dist/index.js --name camp-api && pm2 save"
```

#### Logs

```bash
# Verificar erros recentes
ssh root@72.60.139.82 "tail -n 50 /root/.pm2/logs/camp-api-error.log"
```

### 🔧 TROUBLESHOOTING COMUM

#### "Erro ao subir imagem"

1. Verificar se pasta uploads existe: `ssh root@72.60.139.82 "ls -la /var/www/campgrupo-api/uploads"`
2. Verificar permissões: `ssh root@72.60.139.82 "chmod 777 /var/www/campgrupo-api/uploads"`
3. Verificar logs de erro do PM2

#### "Configurações não salvam"

1. Verificar conexão com banco de dados nos logs
2. Verificar se .env tem DATABASE_URL correto
3. Verificar se tabela site_config existe no Supabase

#### "Mídia não deleta"

1. Verificar se arquivo existe no servidor
2. Verificar permissões da pasta uploads
3. Verificar logs do backend para erros

#### "Backend não inicia"

1. Verificar se porta 3001 está livre: `ssh root@72.60.139.82 "lsof -ti:3001"`
2. Matar processos: `ssh root@72.60.139.82 "lsof -ti:3001 | xargs kill -9"`
3. Verificar .env está correto
4. Rebuild: `ssh root@72.60.139.82 "cd /var/www/campgrupo-api && npm run build"`

### 📋 INFORMAÇÕES IMPORTANTES

**Servidor VPS:**

- IP: 72.60.139.82
- User: root
- Password: ServidorMax@2021

**Banco de Dados (Supabase):**

- Host: db.axhiuviuiruabcnckqmb.supabase.co
- Port: 5432
- Database: postgres
- User: postgres
- Password: MaxGGX5A27@Supabase!984# (URL-encoded no .env)

**Admin Credentials:**

- Email: wagnerantunes84@gmail.com
- Password: GGX5A27@CampGrupo2021

**URLs:**

- Frontend: https://campgrupo.com.br
- Backend: https://api.campgrupo.com.br
- Admin: https://campgrupo.com.br/area-restrita

### 🎯 ORDEM DE EXECUÇÃO IDEAL

1. ✅ Fazer alterações localmente
2. ✅ Testar localmente
3. ✅ Commit e push para GitHub
4. ✅ Deploy backend (se houver mudanças em server/)
5. ✅ Aguardar deploy automático do frontend
6. ✅ Testar tudo no ambiente de produção
7. ✅ Verificar logs para garantir que não há erros
8. ✅ Limpar cache do navegador e testar novamente

---

**Última atualização:** 2026-01-15
**Versão:** 1.0
