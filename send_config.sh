#!/bin/bash

TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ3YWduZXJhbnR1bmVzODRAZ21haWwuY29tIiwiaWF0IjoxNzY4NTY3NTExLCJleHAiOjE3Njg2NTM5MTF9.hW4eALp3i5jEaABMMlWsc0_PF-YcjFYPaBVhB3x-t1o"

# Enviar configuração completa atualizada
curl -X POST https://api.campgrupo.com.br/api/config \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d @assetConfig.json

echo "✅ Configuração enviada!"
