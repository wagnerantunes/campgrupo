#!/usr/bin/env python3
import psycopg2
import json

# Conexão direta ao Supabase
conn = psycopg2.connect(
    host='db.axhiuviuiruabcnckqmb.supabase.co',
    port=5432,
    database='postgres',
    user='postgres',
    password='MaxGGX5A27@Supabase!984#'
)

cur = conn.cursor()

# Buscar config atual
cur.execute("SELECT data FROM site_config WHERE key = 'current_config'")
result = cur.fetchone()

if result:
    config = result[0]
    
    # Atualizar horários
    if 'footer' not in config:
        config['footer'] = {}
    if 'hours' not in config['footer']:
        config['footer']['hours'] = {}
    
    config['footer']['hours'] = {
        'monThu': '07:00 - 17:00',
        'friday': '07:00 - 16:00',
        'weekend': 'Fechado'
    }
    
    # Salvar
    cur.execute(
        "UPDATE site_config SET data = %s, updated_at = CURRENT_TIMESTAMP WHERE key = 'current_config'",
        (json.dumps(config),)
    )
    conn.commit()
    print("✅ Horários atualizados com sucesso!")
else:
    print("❌ Config não encontrada")

cur.close()
conn.close()
