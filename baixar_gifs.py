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

# Todos os meses possiveis no site (ordem de probabilidade)
MESES = [
    '2021/02','2021/06','2021/04','2021/01','2021/03','2021/05',
    '2021/07','2021/08','2021/09','2021/10','2021/11','2021/12',
    '2022/01','2022/02','2022/03','2022/04','2022/05','2022/06',
    '2022/07','2022/08','2022/09','2022/10','2022/11','2022/12',
    '2023/01','2023/02','2023/03','2023/04','2023/05','2023/06',
    '2023/07','2023/08','2023/09','2023/10','2023/11','2023/12',
]

def urls_para(slugs):
    """Gera todas as combinacoes de mes x slug."""
    result = []
    for slug in slugs:
        for mes in MESES:
            result.append(f'{BASE}/{mes}/{slug}')
    return result

# Para cada exercicio: lista de possiveis nomes de ficheiro (slugs)
gifs = [
    ('supino.gif',               urls_para(['Barbell-Bench-Press.gif','Bench-Press.gif'])),
    ('crucifixo.gif',            urls_para(['Pec-Deck-Fly.gif','Cable-Crossover.gif','Chest-Fly.gif','Machine-Fly.gif'])),
    ('triceps-polia.gif',        urls_para(['Pushdown.gif','Triceps-Pushdown.gif','Cable-Pushdown.gif','Rope-Pushdown.gif'])),
    ('triceps-frances.gif',      urls_para([
        'Dumbbell-Lying-Triceps-Extension.gif',
        'Lying-Triceps-Extension.gif',
        'EZ-Bar-Lying-Triceps-Extension.gif',
        'Skull-Crusher.gif',
        'EZ-Barbell-Skull-Crusher.gif',
        'Triceps-Extension.gif',
        'Dumbbell-Triceps-Extension.gif',
        'French-Press.gif',
        'Overhead-Triceps-Extension.gif',
        'Dumbbell-Overhead-Triceps-Extension.gif',
    ])),
    ('prancha.gif',              urls_para([
        'Plank.gif',
        'Front-Plank.gif',
        'Forearm-Plank.gif',
        'Elbow-Plank.gif',
        'Abdominal-Plank.gif',
    ])),
    ('abdominal.gif',            urls_para([
        'Crunch.gif',
        'Abdominal-Crunch.gif',
        'Basic-Crunch.gif',
        'Floor-Crunch.gif',
        'Sit-Up.gif',
        'Basic-Sit-Up.gif',
    ])),
    ('puxada.gif',               urls_para(['Lat-Pulldown.gif','Cable-Lat-Pulldown.gif','Front-Lat-Pulldown.gif'])),
    ('remada.gif',               urls_para([
        'Seated-Cable-Rows.gif',
        'Seated-Cable-Row.gif',
        'Cable-Seated-Row.gif',
        'Cable-Row.gif',
        'Low-Cable-Row.gif',
        'Seated-Row.gif',
        'Low-Row.gif',
        'Machine-Row.gif',
        'Seated-Machine-Row.gif',
    ])),
    ('biceps-halteres.gif',      urls_para(['Dumbbell-Bicep-Curl.gif','Dumbbell-Curl.gif','Alternating-Dumbbell-Curl.gif'])),
    ('biceps-barra.gif',         urls_para(['Barbell-Curl.gif','Barbell-Bicep-Curl.gif'])),
    ('elevacao-pernas.gif',      urls_para(['Hanging-Leg-Hip-Raise.gif','Hanging-Leg-Raise.gif','Lying-Leg-Raise.gif','Leg-Raise.gif'])),
    ('prancha-lateral.gif',      urls_para([
        'Side-Plank.gif',
        'Lateral-Plank.gif',
        'Side-Bridge.gif',
        'Side-Forearm-Plank.gif',
    ])),
    ('goblet-squat.gif',         urls_para([
        'Goblet-Squat.gif',
        'Dumbbell-Goblet-Squat.gif',
        'Kettlebell-Goblet-Squat.gif',
    ])),
    ('leg-press.gif',            urls_para([
        'Leg-Press.gif',
        '45-Degree-Leg-Press.gif',
        'Horizontal-Leg-Press.gif',
        'Machine-Leg-Press.gif',
        'Sled-Leg-Press.gif',
    ])),
    ('extensao-pernas.gif',      urls_para([
        'Leg-Extension.gif',
        'Knee-Extension.gif',
        'Machine-Leg-Extension.gif',
        'Seated-Leg-Extension.gif',
    ])),
    ('elevacao-lateral.gif',     urls_para(['Dumbbell-Lateral-Raise.gif','Lateral-Raise.gif','Side-Lateral-Raise.gif'])),
    ('desenvolvimento-ombro.gif',urls_para(['Dumbbell-Shoulder-Press.gif','Shoulder-Press.gif','Dumbbell-Military-Press.gif'])),
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://fitnessprogramer.com/',
    'Accept': 'image/gif,image/*,*/*',
}

def tentar_download(urls):
    """Tenta cada URL. Retorna (bytes, url) ou lanca excecao."""
    ultimo_erro = None
    for url in urls:
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = resp.read()
            if len(data) > 500 and data[:3] == b'GIF':
                return data, url
        except Exception as e:
            ultimo_erro = e
        time.sleep(0.15)
    raise Exception(f'Nenhuma URL funcionou. Ultimo erro: {ultimo_erro}')

print('\n\U0001f3cb\ufe0f  A baixar GIFs dos exercicios...\n')

ok = 0
err = 0
erros_lista = []

for nome, urls in gifs:
    destino = os.path.join('gifs', nome)

    # Se ja existe e e valido, salta
    if os.path.exists(destino) and os.path.getsize(destino) > 1000:
        print(f'  \u23ed\ufe0f  {nome}  (ja existe, a saltar)')
        ok += 1
        continue

    print(f'  \U0001f50d  {nome}  (a tentar {len(urls)} URLs)...', end='', flush=True)
    try:
        data, url_ok = tentar_download(urls)
        with open(destino, 'wb') as f:
            f.write(data)
        tamanho = len(data) // 1024
        print(f'\r  \u2705  {nome}  ({tamanho} KB)                          ')
        ok += 1
    except Exception as e:
        print(f'\r  \u274c  {nome}  \u2192 nao encontrado                      ')
        erros_lista.append(nome)
        err += 1

print(f'\n\u2714  Concluido: {ok} OK  |  {err} erros')

if ok > 0:
    print('   Abre o index.html no browser \u2014 os GIFs devem aparecer! \U0001f389')

if erros_lista:
    print('\n   \u26a0\ufe0f  Nao foi possivel baixar automaticamente:')
    for nome in erros_lista:
        print(f'      \u2022 {nome}')
    print('\n   Solucao manual:')
    print('   1. Vai a https://fitnessprogramer.com')
    print('   2. Pesquisa o nome do exercicio em ingles')
    print('   3. Clica com o botao direito no GIF \u2192 "Guardar imagem como"')
    print('   4. Guarda na pasta gifs/ com o nome indicado acima')
