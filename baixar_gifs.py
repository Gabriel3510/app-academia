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

BASE = 'https://fitnessprogramer.com/wp-content/uploads'

# Cada exercicio tem uma lista de URLs alternativas.
# O script tenta cada uma por ordem ate encontrar uma que funcione.
gifs = [
    ('supino.gif', [
        f'{BASE}/2021/02/Barbell-Bench-Press.gif',
    ]),
    ('crucifixo.gif', [
        f'{BASE}/2021/02/Pec-Deck-Fly.gif',
        f'{BASE}/2021/06/Pec-Deck-Fly.gif',
        f'{BASE}/2021/04/Pec-Deck-Fly.gif',
        f'{BASE}/2022/01/Pec-Deck-Fly.gif',
        f'{BASE}/2021/02/Cable-Crossover.gif',
        f'{BASE}/2021/06/Cable-Crossover.gif',
    ]),
    ('triceps-polia.gif', [
        f'{BASE}/2021/02/Pushdown.gif',
    ]),
    ('triceps-frances.gif', [
        f'{BASE}/2021/02/Dumbbell-Lying-Triceps-Extension.gif',
        f'{BASE}/2021/06/Dumbbell-Lying-Triceps-Extension.gif',
        f'{BASE}/2021/04/Dumbbell-Lying-Triceps-Extension.gif',
        f'{BASE}/2021/02/Lying-Triceps-Extension.gif',
        f'{BASE}/2021/06/Lying-Triceps-Extension.gif',
        f'{BASE}/2021/02/EZ-Bar-Lying-Triceps-Extension.gif',
        f'{BASE}/2021/06/EZ-Bar-Lying-Triceps-Extension.gif',
    ]),
    ('prancha.gif', [
        f'{BASE}/2021/02/Plank.gif',
        f'{BASE}/2021/04/Plank.gif',
        f'{BASE}/2021/06/Plank.gif',
        f'{BASE}/2022/01/Plank.gif',
        f'{BASE}/2021/02/Front-Plank.gif',
        f'{BASE}/2021/06/Front-Plank.gif',
    ]),
    ('abdominal.gif', [
        f'{BASE}/2021/02/Crunch.gif',
        f'{BASE}/2021/04/Crunch.gif',
        f'{BASE}/2021/06/Crunch.gif',
        f'{BASE}/2022/01/Crunch.gif',
        f'{BASE}/2021/02/Abdominal-Crunch.gif',
        f'{BASE}/2021/06/Abdominal-Crunch.gif',
    ]),
    ('puxada.gif', [
        f'{BASE}/2021/02/Lat-Pulldown.gif',
    ]),
    ('remada.gif', [
        f'{BASE}/2021/02/Seated-Cable-Rows.gif',
        f'{BASE}/2021/04/Seated-Cable-Rows.gif',
        f'{BASE}/2021/06/Seated-Cable-Rows.gif',
        f'{BASE}/2021/02/Cable-Seated-Row.gif',
        f'{BASE}/2021/06/Cable-Seated-Row.gif',
        f'{BASE}/2021/02/Seated-Row.gif',
        f'{BASE}/2021/06/Seated-Row.gif',
    ]),
    ('biceps-halteres.gif', [
        f'{BASE}/2021/02/Dumbbell-Bicep-Curl.gif',
        f'{BASE}/2021/04/Dumbbell-Bicep-Curl.gif',
        f'{BASE}/2021/06/Dumbbell-Bicep-Curl.gif',
        f'{BASE}/2021/02/Dumbbell-Curl.gif',
        f'{BASE}/2021/06/Dumbbell-Curl.gif',
        f'{BASE}/2021/02/Alternating-Dumbbell-Curl.gif',
        f'{BASE}/2021/06/Alternating-Dumbbell-Curl.gif',
    ]),
    ('biceps-barra.gif', [
        f'{BASE}/2021/02/Barbell-Curl.gif',
    ]),
    ('elevacao-pernas.gif', [
        f'{BASE}/2021/02/Hanging-Leg-Hip-Raise.gif',
        f'{BASE}/2021/04/Hanging-Leg-Hip-Raise.gif',
        f'{BASE}/2021/06/Hanging-Leg-Hip-Raise.gif',
        f'{BASE}/2021/02/Hanging-Leg-Raise.gif',
        f'{BASE}/2021/04/Hanging-Leg-Raise.gif',
        f'{BASE}/2021/06/Hanging-Leg-Raise.gif',
        f'{BASE}/2021/02/Lying-Leg-Raise.gif',
        f'{BASE}/2021/06/Lying-Leg-Raise.gif',
    ]),
    ('prancha-lateral.gif', [
        f'{BASE}/2021/06/Side-Plank.gif',
        f'{BASE}/2021/02/Side-Plank.gif',
        f'{BASE}/2021/04/Side-Plank.gif',
        f'{BASE}/2022/01/Side-Plank.gif',
    ]),
    ('goblet-squat.gif', [
        f'{BASE}/2021/06/Goblet-Squat.gif',
        f'{BASE}/2021/02/Goblet-Squat.gif',
        f'{BASE}/2021/04/Goblet-Squat.gif',
        f'{BASE}/2022/01/Goblet-Squat.gif',
        f'{BASE}/2021/06/Dumbbell-Goblet-Squat.gif',
        f'{BASE}/2021/02/Dumbbell-Goblet-Squat.gif',
    ]),
    ('leg-press.gif', [
        f'{BASE}/2021/02/Leg-Press.gif',
        f'{BASE}/2021/04/Leg-Press.gif',
        f'{BASE}/2021/06/Leg-Press.gif',
        f'{BASE}/2022/01/Leg-Press.gif',
        f'{BASE}/2021/02/45-Degree-Leg-Press.gif',
        f'{BASE}/2021/06/45-Degree-Leg-Press.gif',
    ]),
    ('extensao-pernas.gif', [
        f'{BASE}/2021/02/Leg-Extension.gif',
        f'{BASE}/2021/04/Leg-Extension.gif',
        f'{BASE}/2021/06/Leg-Extension.gif',
        f'{BASE}/2022/01/Leg-Extension.gif',
        f'{BASE}/2021/02/Knee-Extension.gif',
        f'{BASE}/2021/06/Knee-Extension.gif',
    ]),
    ('elevacao-lateral.gif', [
        f'{BASE}/2021/02/Dumbbell-Lateral-Raise.gif',
    ]),
    ('desenvolvimento-ombro.gif', [
        f'{BASE}/2021/02/Dumbbell-Shoulder-Press.gif',
    ]),
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://fitnessprogramer.com/',
    'Accept': 'image/gif,image/*,*/*',
}

def tentar_download(urls):
    """Tenta cada URL da lista. Retorna os bytes do GIF ou lanca excecao."""
    ultimo_erro = None
    for url in urls:
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=20) as resp:
                data = resp.read()
            if len(data) > 100 and data[:3] == b'GIF':
                return data, url
        except Exception as e:
            ultimo_erro = e
        time.sleep(0.3)
    raise Exception(f'Nenhuma URL funcionou. Ultimo erro: {ultimo_erro}')

print('\n🏋️  A baixar GIFs dos exercicios...\n')

ok = 0
err = 0
erros_lista = []

for nome, urls in gifs:
    destino = os.path.join('gifs', nome)

    # Se ja existe e e valido, salta
    if os.path.exists(destino) and os.path.getsize(destino) > 1000:
        print(f'  ⏭️  {nome}  (ja existe, a saltar)')
        ok += 1
        continue

    try:
        data, url_ok = tentar_download(urls)
        with open(destino, 'wb') as f:
            f.write(data)
        tamanho = len(data) // 1024
        print(f'  ✅  {nome}  ({tamanho} KB)')
        ok += 1
    except Exception as e:
        print(f'  ❌  {nome}  →  {e}')
        erros_lista.append(nome)
        err += 1

    time.sleep(0.5)

print(f'\n✔  Concluido: {ok} OK  |  {err} erros')

if ok > 0:
    print('   Abre o index.html no browser — os GIFs devem aparecer! 🎉')

if erros_lista:
    print('\n   ⚠️  Nao foi possivel baixar automaticamente:')
    for nome in erros_lista:
        print(f'      • {nome}')
    print('\n   Solucao manual:')
    print('   1. Vai a https://fitnessprogramer.com')
    print('   2. Pesquisa o nome do exercicio')
    print('   3. Clica com o botao direito no GIF → "Guardar imagem como"')
    print('   4. Guarda na pasta gifs/ com o nome indicado acima')
