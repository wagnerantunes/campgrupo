#!/usr/bin/env python3
"""
Script para configurar o Supabase Storage bucket 'uploads'
"""
import urllib.request
import json

SUPABASE_URL = "https://axhiuviuiruabcnckqmb.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4aGl1dml1aXJ1YWJjbmNrcW1iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQ5NDg4NSwiZXhwIjoyMDg0MDcwODg1fQ.9f6vHAUPNsjK-y4dc65grFpY3rL2nZEPuCA0pjNiwdc"

# Criar bucket 'uploads' (público)
print("Criando bucket 'uploads'...")
try:
    req = urllib.request.Request(
        f"{SUPABASE_URL}/storage/v1/bucket",
        data=json.dumps({
            "id": "uploads",
            "name": "uploads",
            "public": True,
            "file_size_limit": 52428800,  # 50MB
            "allowed_mime_types": ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
        }).encode(),
        headers={
            "apikey": SERVICE_KEY,
            "Authorization": f"Bearer {SERVICE_KEY}",
            "Content-Type": "application/json"
        },
        method='POST'
    )
    
    response = urllib.request.urlopen(req)
    print("✅ Bucket 'uploads' criado com sucesso!")
except urllib.error.HTTPError as e:
    if e.code == 409:
        print("ℹ️  Bucket 'uploads' já existe")
    else:
        print(f"❌ Erro: {e.code} - {e.read().decode()}")
except Exception as e:
    print(f"❌ Erro: {e}")

print("\n✅ Configuração concluída!")
print("Agora você pode fazer upload de imagens via Admin Panel.")
