#!/usr/bin/env python3
import urllib.request
import json

# Supabase REST API
SUPABASE_URL = "https://axhiuviuiruabcnckqmb.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4aGl1dml1aXJ1YWJjbmNrcW1iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQ5NDg4NSwiZXhwIjoyMDg0MDcwODg1fQ.9f6vHAUPNsjK-y4dc65grFpY3rL2nZEPuCA0pjNiwdc"

# Buscar config atual
req = urllib.request.Request(
    f"{SUPABASE_URL}/rest/v1/site_config?key=eq.current_config",
    headers={
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}"
    }
)

response = urllib.request.urlopen(req)
data = json.loads(response.read())[0]
config = data['data']

# Atualizar horários
config['footer']['hours'] = {
    'monThu': '07:00 - 17:00',
    'friday': '07:00 - 16:00',
    'weekend': 'Fechado'
}

# Salvar
req = urllib.request.Request(
    f"{SUPABASE_URL}/rest/v1/site_config?key=eq.current_config",
    data=json.dumps({'data': config}).encode(),
    headers={
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    },
    method='PATCH'
)

urllib.request.urlopen(req)
print("✅ Horários atualizados!")
