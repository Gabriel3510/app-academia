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
WTG  = 'https://weighttraining.guide/wp-content/uploads'

MESES_FP = [
    '2021/02','2021/06','2021/04','2021/01','2021/03','2021/05',
    '2021/07','2021/08','2021/09','2021/10','2021/11','2021/12',
    '2022/01','2022/02','2022/03','2022/04','2022/05','2022/06',
    '2022/07','2022/08','2022/09','2022/10','2022/11','2022/12',
    '2023/01','2023/02','2023/03','2023/04','2023/05','2023/06',
    '2023/07','2023/08','2023/09','2023/10','2023/11','2023/12',
    '2024/01','2024/02','2024/03','2024/04','2024/05','2024/06',
    '2024/07','2024/08','2024/09','2024/10','2024/11','2024/12',
]

MESES_WTG = [
    '2016/10','2016/11','2016/12',
    '2017/01','2017/02','2017/03','2017/04','2017/05','2017/06',
    '2017/07','2017/08','2017/09','2017/10','2017/11','2017/12',
    '2018/01','2018/02','2018/03','2018/04','2018/05','2018/06',
    '2018/07','2018/08','2018/09','2018/10','2018/11','2018/12',
    '2019/01','2019/02','2019/03','2019/04',
]

def urls_fp(slugs):
    return [f'{BASE}/{m}/{s}' for s in slugs for m in MESES_FP]

def urls_wtg(slugs):
    return [f'{WTG}/{m}/{s}' for s in slugs for m in MESES_WTG]

gifs = [
    ('supino.gif',               urls_fp(['Barbell-Bench-Press.gif','Bench-Press.gif'])),
    ('crucifixo.gif',            urls_fp(['Pec-Deck-Fly.gif','Cable-Crossover.gif','Chest-Fly.gif'])),
    ('triceps-polia.gif',        urls_fp(['Pushdown.gif','Triceps-Pushdown.gif','Cable-Pushdown.gif'])),
    ('triceps-frances.gif',      urls_fp(['Dumbbell-Lying-Triceps-Extension.gif','Lying-Triceps-Extension.gif','Skull-Crusher.gif'])),
    ('prancha.gif',              urls_fp(['Plank.gif','Front-Plank.gif','Forearm-Plank.gif','High-Plank.gif','Prone-Plank.gif'])),
    ('abdominal.gif',            urls_fp(['Crunch.gif','Abdominal-Crunch.gif','Basic-Crunch.gif','Sit-Up.gif'])),
    ('puxada.gif',               urls_fp(['Lat-Pulldown.gif','Cable-Lat-Pulldown.gif','Front-Lat-Pulldown.gif'])),
    ('remada.gif',               urls_fp(['Seated-Cable-Rows.gif','Cable-Seated-Row.gif','Seated-Row.gif'])),
    ('biceps-halteres.gif',      urls_fp(['Dumbbell-Bicep-Curl.gif','Dumbbell-Curl.gif','Alternating-Dumbbell-Curl.gif'])),
    ('biceps-barra.gif',         urls_fp(['Barbell-Curl.gif','Barbell-Bicep-Curl.gif'])),
    ('elevacao-pernas.gif',      urls_fp(['Hanging-Leg-Hip-Raise.gif','Hanging-Leg-Raise.gif','Lying-Leg-Raise.gif'])),
    ('prancha-lateral.gif',      urls_fp(['Side-Plank.gif','Lateral-Plank.gif','Side-Bridge.gif'])),
    ('goblet-squat.gif',         urls_fp(['Goblet-Squat.gif','Dumbbell-Goblet-Squat.gif'])),

    # leg-press e extensao-pernas: tenta fitnessprogramer + weighttraining.guide
    ('leg-press.gif',
        urls_fp([
            'Leg-Press.gif','45-Degree-Leg-Press.gif','Horizontal-Leg-Press.gif',
            'Machine-Leg-Press.gif','Sled-Leg-Press.gif','Seated-Leg-Press.gif',
            'Incline-Leg-Press.gif','Leg-Press-Machine.gif','Vertical-Leg-Press.gif',
        ]) +
        urls_wtg([
            'leg-press.gif','45-degree-leg-press.gif','leg-press-1.gif',
            'horizontal-leg-press.gif','seated-leg-press.gif',
        ])
    ),
    ('extensao-pernas.gif',
        urls_fp([
            'Leg-Extension.gif','Knee-Extension.gif','Machine-Leg-Extension.gif',
            'Seated-Leg-Extension.gif','Leg-Extensor.gif','Quadriceps-Extension.gif',
            'Lever-Leg-Extension.gif','Lever-Knee-Extension.gif','Leg-Extension-Machine.gif',
        ]) +
        urls_wtg([
            'leg-extension.gif','leg-extension-1.gif','knee-extension.gif',
            'seated-leg-extension.gif','machine-leg-extension.gif',
        ])
    ),

    ('elevacao-lateral.gif',     urls_fp(['Dumbbell-Lateral-Raise.gif','Lateral-Raise.gif'])),
    ('desenvolvimento-ombro.gif',urls_fp(['Dumbbell-Shoulder-Press.gif','Shoulder-Press.gif'])),
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'image/gif,image/*,*/*',
}

def tentar_download(urls):
    ultimo_erro = None
    for url in urls:
        try:
            h = dict(headers)
            if 'fitnessprogramer' in url:
                h['Referer'] = 'https://fitnessprogramer.com/'
            elif 'weighttraining' in url:
                h['Referer'] = 'https://weighttraining.guide/'
            req = urllib.request.Request(url, headers=h)
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = resp.read()
            if len(data) > 500 and data[:3] == b'GIF':
                return data, url
        except Exception as e:
            ultimo_erro = e
        time.sleep(0.1)
    raise Exception(f'Nenhuma URL funcionou. Ultimo erro: {ultimo_erro}')

print('\n\U0001f3cb\ufe0f  A baixar GIFs dos exercicios...\n')

ok = 0
err = 0
erros_lista = []

for nome, urls in gifs:
    destino = os.path.join('gifs', nome)

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
        print(f'\r  \u2705  {nome}  ({tamanho} KB)                                      ')
        ok += 1
    except Exception as e:
        print(f'\r  \u274c  {nome}  \u2192 nao encontrado                                ')
        erros_lista.append(nome)
        err += 1

print(f'\n\u2714  Concluido: {ok} OK  |  {err} erros')
if ok > 0:
    print('   Abre o index.html no browser \u2014 os GIFs devem aparecer! \U0001f389')

if erros_lista:
    print('\n   \u26a0\ufe0f  Guarda manualmente na pasta gifs/ com o nome indicado:')
    links = {
        'leg-press.gif':       'https://fitnessprogramer.com/?s=leg+press',
        'extensao-pernas.gif': 'https://fitnessprogramer.com/?s=leg+extension',
    }
    for nome in erros_lista:
        link = links.get(nome, 'https://fitnessprogramer.com')
        print(f'      \u2022 {nome}  \u2192  {link}')
