#!/usr/bin/env python3
"""
Script para baixar automaticamente os GIFs dos exercicios.
Executa na pasta raiz do projeto:
  python baixar_gifs.py
"""

import urllib.request
import os
import time

# Cria a pasta gifs/ se nao existir
os.makedirs('gifs', exist_ok=True)

gifs = [
    ('supino.gif',              'https://musclewiki.com/media/uploads/videos/branded/male-barbell-bench-press-front.gif'),
    ('crucifixo.gif',           'https://musclewiki.com/media/uploads/videos/branded/male-pec-deck-front.gif'),
    ('triceps-polia.gif',       'https://musclewiki.com/media/uploads/videos/branded/male-cable-tricep-pushdown-front.gif'),
    ('triceps-frances.gif',     'https://musclewiki.com/media/uploads/videos/branded/male-dumbbell-tricep-extension-front.gif'),
    ('prancha.gif',             'https://musclewiki.com/media/uploads/videos/branded/male-plank-front.gif'),
    ('abdominal.gif',           'https://musclewiki.com/media/uploads/videos/branded/male-crunch-front.gif'),
    ('puxada.gif',              'https://musclewiki.com/media/uploads/videos/branded/male-cable-lat-pulldown-front.gif'),
    ('remada.gif',              'https://musclewiki.com/media/uploads/videos/branded/male-cable-seated-row-front.gif'),
    ('biceps-halteres.gif',     'https://musclewiki.com/media/uploads/videos/branded/male-dumbbell-bicep-curl-front.gif'),
    ('biceps-barra.gif',        'https://musclewiki.com/media/uploads/videos/branded/male-barbell-bicep-curl-front.gif'),
    ('elevacao-pernas.gif',     'https://musclewiki.com/media/uploads/videos/branded/male-hanging-leg-raise-front.gif'),
    ('prancha-lateral.gif',     'https://musclewiki.com/media/uploads/videos/branded/male-side-plank-front.gif'),
    ('goblet-squat.gif',        'https://musclewiki.com/media/uploads/videos/branded/male-dumbbell-goblet-squat-front.gif'),
    ('leg-press.gif',           'https://musclewiki.com/media/uploads/videos/branded/male-leg-press-front.gif'),
    ('extensao-pernas.gif',     'https://musclewiki.com/media/uploads/videos/branded/male-leg-extension-front.gif'),
    ('elevacao-lateral.gif',    'https://musclewiki.com/media/uploads/videos/branded/male-dumbbell-lateral-raise-front.gif'),
    ('desenvolvimento-ombro.gif','https://musclewiki.com/media/uploads/videos/branded/male-dumbbell-shoulder-press-front.gif'),
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36'
}

print('\n🏋️  A baixar GIFs dos exercicios...\n')

ok = 0
err = 0

for nome, url in gifs:
    destino = os.path.join('gifs', nome)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
        with open(destino, 'wb') as f:
            f.write(data)
        print(f'  ✅  {nome}')
        ok += 1
    except Exception as e:
        print(f'  ❌  {nome}  →  {e}')
        err += 1
    time.sleep(0.5)  # pausa entre pedidos

print(f'\n✔  Concluido: {ok} OK  |  {err} erros')
if ok > 0:
    print('   Abre o index.html no browser — os GIFs devem aparecer!')
if err > 0:
    print('   Para os erros, tenta abrir o link manualmente no browser e guarda o GIF na pasta gifs/')
