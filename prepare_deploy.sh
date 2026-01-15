#!/bin/bash
echo "📦 Preparando arquivos para deploy (Backend)..."

# Criar pasta temporaria
mkdir -p deploy_temp
cp -r server/dist/* deploy_temp/
cp server/package.json deploy_temp/

# Avisar sobre o .env
echo "⚠️  ATENÇÃO: O arquivo .env local aponta para bancos locais."
echo "   Certifique-se de configurar as variáveis de ambiente (DATABASE_URL) no painel da Hostinger"
echo "   ou editar o arquivo .env no servidor após o upload."

# Compactar
tar -czf deploy-backend.tar.gz -C deploy_temp .
rm -rf deploy_temp

echo "✅ Arquivo 'deploy-backend.tar.gz' criado com sucesso!"
echo ""
echo "👉 AGORA EXECUTE O COMANDO ABAIXO NO SEU TERMINAL PARA ENVIAR:"
echo "   (Substitua '/caminho/do/app' pelo caminho real na Hostinger, ex: domains/campgrupo.com.br/public_html/api)"
echo ""
echo "scp -P 65002 deploy-backend.tar.gz u351198048@147.79.109.120:./caminho/do/app"
echo ""
echo "👉 DEPOIS, NO SSH:"
echo "1. cd caminho/do/app"
echo "2. tar -xzf deploy-backend.tar.gz"
echo "3. npm install"
echo "4. Remova o zip: rm deploy-backend.tar.gz"
