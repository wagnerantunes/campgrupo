#!/usr/bin/env python3
"""
Script para criar usuário admin no Supabase Auth
"""
import urllib.request
import json

SUPABASE_URL = "https://axhiuviuiruabcnckqmb.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4aGl1dml1aXJ1YWJjbmNrcW1iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQ5NDg4NSwiZXhwIjoyMDg0MDcwODg1fQ.9f6vHAUPNsjK-y4dc65grFpY3rL2nZEPuCA0pjNiwdc"

# Criar usuário admin
email = "admin@campgrupo.com.br"
password = "Admin@Camp2024!"  # Altere esta senha!

print(f"Criando usuário admin: {email}")
try:
    req = urllib.request.Request(
        f"{SUPABASE_URL}/auth/v1/admin/users",
        data=json.dumps({
            "email": email,
            "password": password,
            "email_confirm": True,
            "user_metadata": {
                "role": "admin"
            }
        }).encode(),
        headers={
            "apikey": SERVICE_KEY,
            "Authorization": f"Bearer {SERVICE_KEY}",
            "Content-Type": "application/json"
        },
        method='POST'
    )
    
    response = urllib.request.urlopen(req)
    data = json.loads(response.read())
    print(f"✅ Usuário criado com sucesso!")
    print(f"   Email: {email}")
    print(f"   Senha: {password}")
    print(f"   ID: {data.get('id')}")
except urllib.error.HTTPError as e:
    error_data = json.loads(e.read().decode())
    if 'already been registered' in error_data.get('msg', ''):
        print(f"ℹ️  Usuário {email} já existe")
    else:
        print(f"❌ Erro: {e.code} - {error_data}")
except Exception as e:
    print(f"❌ Erro: {e}")

print("\n✅ Configuração concluída!")
print(f"Você pode fazer login com: {email}")
