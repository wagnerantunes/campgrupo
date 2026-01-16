#!/usr/bin/env python3
"""
Script to update footer hours in Supabase database
"""

import psycopg2
import json

# Database connection details
DB_CONFIG = {
    'host': 'db.axhiuviuiruabcnckqmb.supabase.co',
    'port': 5432,
    'database': 'postgres',
    'user': 'postgres',
    'password': 'MaxGGX5A27@Supabase!984#'
}

def update_footer_hours():
    """Update footer hours in the database"""
    try:
        print("🔄 Conectando ao banco de dados...")
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        # First, get the current config
        print("📥 Buscando configuração atual...")
        cur.execute("SELECT data FROM site_config WHERE key = 'current_config'")
        result = cur.fetchone()
        
        if not result:
            print("❌ Nenhuma configuração encontrada no banco de dados")
            return False
        
        config = result[0]
        print(f"✅ Configuração atual carregada")
        
        # Update the hours
        if 'footer' not in config:
            config['footer'] = {}
        if 'hours' not in config['footer']:
            config['footer']['hours'] = {}
        
        # Remove old keys
        config['footer']['hours'].pop('weekdays', None)
        config['footer']['hours'].pop('saturday', None)
        
        # Add new keys
        config['footer']['hours']['monThu'] = '07:00 - 17:00'
        config['footer']['hours']['friday'] = '07:00 - 16:00'
        config['footer']['hours']['weekend'] = 'Fechado'
        
        print("🔄 Atualizando horários...")
        print(f"   - Seg - Qui: {config['footer']['hours']['monThu']}")
        print(f"   - Sex: {config['footer']['hours']['friday']}")
        print(f"   - Sáb. e Dom.: {config['footer']['hours']['weekend']}")
        
        # Update the database
        cur.execute(
            "UPDATE site_config SET data = %s, updated_at = CURRENT_TIMESTAMP WHERE key = 'current_config'",
            (json.dumps(config),)
        )
        conn.commit()
        
        print("✅ Horários atualizados com sucesso no banco de dados!")
        print("")
        print("🌐 Aguarde alguns segundos e acesse: https://campgrupo.com.br")
        print("   O rodapé deve exibir:")
        print("   - Seg - Qui: 07:00 - 17:00")
        print("   - Sex: 07:00 - 16:00")
        print("   - Sáb. e Dom.: Fechado")
        
        cur.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Erro ao atualizar banco de dados: {e}")
        return False

if __name__ == '__main__':
    success = update_footer_hours()
    exit(0 if success else 1)
