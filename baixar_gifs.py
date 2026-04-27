#!/usr/bin/env python3
"""
Script para baixar automaticamente os GIFs dos exercicios.
Executa na pasta raiz do projeto:
  python3 baixar_gifs.py
"""

import urllib.request
import os
import time

os.makedirs('gifs', exist_ok=True)

# URLs do fitnessprogramer.com (publicos e sem protecao de hotlink)
gifs = [
    ('supino.gif',               'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bench-Press.gif'),
    ('crucifixo.gif',            'https://fitnessprogramer.com/wp-content/uploads/2021/06/Pec-Deck-Fly.gif'),
    ('triceps-polia.gif',        'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pushdown.gif'),
    ('triceps-frances.gif',      'https://fitnessprogramer.com/wp-content/uploads/2021/06/Dumbbell-Lying-Triceps-Extension.gif'),
    ('prancha.gif',              'https://fitnessprogramer.com/wp-content/uploads/2021/02/Plank.gif'),
    ('abdominal.gif',            'https://fitnessprogramer.com/wp-content/uploads/2021/02/Crunch.gif'),
    ('puxada.gif',               'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif'),
    ('remada.gif',               'https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Cable-Rows.gif'),
    ('biceps-halteres.gif',      'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Bicep-Curl.gif'),
    ('biceps-barra.gif',         'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Curl.gif'),
    ('elevacao-pernas.gif',      'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hanging-Leg-Hip-Raise.gif'),
    ('prancha-lateral.gif',      'https://fitnessprogramer.com/wp-content/uploads/2021/06/Side-Plank.gif'),
    ('goblet-squat.gif',         'https://fitnessprogramer.com/wp-content/uploads/2021/06/Goblet-Squat.gif'),
    ('leg-press.gif',            'https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Press.gif'),
    ('extensao-pernas.gif',      'https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Extension.gif'),
    ('elevacao-lateral.gif',     'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif'),
    ('desenvolvimento-ombro.gif','https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif'),
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://fitnessprogramer.com/',
    'Accept': 'image/gif,image/*,*/*',
}

print('\n🏋️  A baixar GIFs dos exercicios...\n')

ok = 0
err = 0

for nome, url in gifs:
    destino = os.path.join('gifs', nome)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read()
        # Verifica se e realmente um GIF (começa com GIF8)
        if len(data) < 10 or not data[:4] in (b'GIF8', b'GIF9'):
            raise ValueError('Ficheiro nao e um GIF valido')
        with open(destino, 'wb') as f:
            f.write(data)
        tamanho = len(data) // 1024
        print(f'  ✅  {nome}  ({tamanho} KB)')
        ok += 1
    except Exception as e:
        print(f'  ❌  {nome}  →  {e}')
        err += 1
    time.sleep(0.8)

print(f'\n✔  Concluido: {ok} OK  |  {err} erros')
if ok > 0:
    print('   Abre o index.html no browser — os GIFs devem aparecer! 🎉')
if err > 0:
    print('\n   ⚠️  Para os GIFs com erro, vai a:')
    print('   https://fitnessprogramer.com')
    print('   Pesquisa o exercicio, clica no GIF com o botao direito → "Guardar imagem como"')
    print('   e guarda na pasta gifs/ com o nome indicado acima.')
