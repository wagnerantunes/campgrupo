#!/bin/bash

# Script to update footer hours in Supabase database via SSH to VPS

echo "🔄 Atualizando horários no banco de dados..."

# Database connection details from the deploy protocol
DB_HOST="db.axhiuviuiruabcnckqmb.supabase.co"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres"
DB_PASS="MaxGGX5A27@Supabase!984#"

# SQL command to update hours
SQL_COMMAND="UPDATE site_config SET data = jsonb_set(jsonb_set(jsonb_set(data, '{footer,hours,monThu}', '\"07:00 - 17:00\"'), '{footer,hours,friday}', '\"07:00 - 16:00\"'), '{footer,hours,weekend}', '\"Fechado\"'), updated_at = CURRENT_TIMESTAMP WHERE key = 'current_config'; UPDATE site_config SET data = data #- '{footer,hours,weekdays}' #- '{footer,hours,saturday}' WHERE key = 'current_config';"

# Execute via psql on VPS
ssh root@72.60.139.82 "PGPASSWORD='${DB_PASS}' psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -c \"${SQL_COMMAND}\""

if [ $? -eq 0 ]; then
    echo "✅ Horários atualizados com sucesso no banco de dados!"
    echo ""
    echo "🌐 Aguarde alguns segundos e acesse: https://campgrupo.com.br"
    echo "   O rodapé deve exibir:"
    echo "   - Seg - Qui: 07:00 - 17:00"
    echo "   - Sex: 07:00 - 16:00"
    echo "   - Sáb. e Dom.: Fechado"
else
    echo "❌ Erro ao atualizar banco de dados"
    exit 1
fi
