#!/usr/bin/env python3
"""
Download all exercise GIFs automatically.
Run from the project root:
  python3 baixar_gifs.py
"""

import os
import shutil
import time
import urllib.request

OUTPUT_DIR = "gifs"
BASE_FP = "https://fitnessprogramer.com/wp-content/uploads"
BASE_WTG = "https://weighttraining.guide/wp-content/uploads"

MONTHS_FP = [
    "2021/02", "2021/06", "2021/04", "2021/01", "2021/03", "2021/05",
    "2021/07", "2021/08", "2021/09", "2021/10", "2021/11", "2021/12",
    "2022/01", "2022/02", "2022/03", "2022/04", "2022/05", "2022/06",
    "2022/07", "2022/08", "2022/09", "2022/10", "2022/11", "2022/12",
    "2023/01", "2023/02", "2023/03", "2023/04", "2023/05", "2023/06",
    "2023/07", "2023/08", "2023/09", "2023/10", "2023/11", "2023/12",
    "2024/01", "2024/02", "2024/03", "2024/04", "2024/05", "2024/06",
    "2024/07", "2024/08", "2024/09", "2024/10", "2024/11", "2024/12",
]

MONTHS_WTG = [
    "2016/10", "2016/11", "2016/12",
    "2017/01", "2017/02", "2017/03", "2017/04", "2017/05", "2017/06",
    "2017/07", "2017/08", "2017/09", "2017/10", "2017/11", "2017/12",
    "2018/01", "2018/02", "2018/03", "2018/04", "2018/05", "2018/06",
    "2018/07", "2018/08", "2018/09", "2018/10", "2018/11", "2018/12",
    "2019/01", "2019/02", "2019/03", "2019/04",
]


def urls_fp(slugs):
    return [f"{BASE_FP}/{month}/{slug}" for slug in slugs for month in MONTHS_FP]


def urls_wtg(slugs):
    return [f"{BASE_WTG}/{month}/{slug}" for slug in slugs for month in MONTHS_WTG]


GIF_SOURCES = [
    # Base workout GIFs
    ("supino.gif", urls_fp(["Barbell-Bench-Press.gif", "Bench-Press.gif"])),
    ("crucifixo.gif", urls_fp(["Pec-Deck-Fly.gif", "Cable-Crossover.gif", "Chest-Fly.gif"])),
    ("triceps-polia.gif", urls_fp(["Pushdown.gif", "Triceps-Pushdown.gif", "Cable-Pushdown.gif"])),
    ("triceps-frances.gif", urls_fp(["Dumbbell-Lying-Triceps-Extension.gif", "Lying-Triceps-Extension.gif", "Skull-Crusher.gif"])),
    ("prancha.gif", urls_fp(["Plank.gif", "Front-Plank.gif", "Forearm-Plank.gif", "High-Plank.gif", "Prone-Plank.gif"])),
    ("abdominal.gif", urls_fp(["Crunch.gif", "Abdominal-Crunch.gif", "Basic-Crunch.gif", "Sit-Up.gif"])),
    ("puxada.gif", urls_fp(["Lat-Pulldown.gif", "Cable-Lat-Pulldown.gif", "Front-Lat-Pulldown.gif"])),
    ("remada.gif", urls_fp(["Seated-Cable-Rows.gif", "Cable-Seated-Row.gif", "Seated-Row.gif"])),
    ("biceps-halteres.gif", urls_fp(["Dumbbell-Bicep-Curl.gif", "Dumbbell-Curl.gif", "Alternating-Dumbbell-Curl.gif"])),
    ("biceps-barra.gif", urls_fp(["Barbell-Curl.gif", "Barbell-Bicep-Curl.gif"])),
    ("elevacao-pernas.gif", urls_fp(["Hanging-Leg-Hip-Raise.gif", "Hanging-Leg-Raise.gif", "Lying-Leg-Raise.gif"])),
    ("prancha-lateral.gif", urls_fp(["Side-Plank.gif", "Lateral-Plank.gif", "Side-Bridge.gif"])),
    ("goblet-squat.gif", urls_fp(["Goblet-Squat.gif", "Dumbbell-Goblet-Squat.gif"])),
    (
        "leg-press.gif",
        urls_fp([
            "Leg-Press.gif", "45-Degree-Leg-Press.gif", "Horizontal-Leg-Press.gif",
            "Machine-Leg-Press.gif", "Sled-Leg-Press.gif", "Seated-Leg-Press.gif",
            "Incline-Leg-Press.gif", "Leg-Press-Machine.gif", "Vertical-Leg-Press.gif",
        ])
        + urls_wtg([
            "leg-press.gif", "45-degree-leg-press.gif", "leg-press-1.gif",
            "horizontal-leg-press.gif", "seated-leg-press.gif",
        ]),
    ),
    (
        "extensao-pernas.gif",
        urls_fp([
            "Leg-Extension.gif", "Knee-Extension.gif", "Machine-Leg-Extension.gif",
            "Seated-Leg-Extension.gif", "Leg-Extensor.gif", "Quadriceps-Extension.gif",
            "Lever-Leg-Extension.gif", "Lever-Knee-Extension.gif", "Leg-Extension-Machine.gif",
        ])
        + urls_wtg([
            "leg-extension.gif", "leg-extension-1.gif", "knee-extension.gif",
            "seated-leg-extension.gif", "machine-leg-extension.gif",
        ]),
    ),
    ("elevacao-lateral.gif", urls_fp(["Dumbbell-Lateral-Raise.gif", "Lateral-Raise.gif"])),
    ("desenvolvimento-ombro.gif", urls_fp(["Dumbbell-Shoulder-Press.gif", "Shoulder-Press.gif"])),

    # Variation GIFs used in the app
    ("supino-inclinado.gif", urls_fp(["Incline-Barbell-Bench-Press.gif", "Incline-Dumbbell-Bench-Press.gif", "Incline-Bench-Press.gif"])),
    ("flexao.gif", urls_fp(["Push-up.gif", "Push-Up.gif", "Knee-Push-Up.gif"])),
    ("peck-deck.gif", urls_fp(["Pec-Deck-Fly.gif", "Pec-Deck.gif", "Machine-Chest-Fly.gif"])),
    ("triceps-overhead.gif", urls_fp(["Overhead-Triceps-Extension.gif", "Cable-Overhead-Triceps-Extension.gif", "Dumbbell-Overhead-Triceps-Extension.gif"])),
    ("dead-bug.gif", urls_fp(["Dead-Bug.gif", "Deadbug.gif"])),
    ("barra-assistida.gif", urls_fp(["Assisted-Pull-up.gif", "Machine-Assisted-Pull-Up.gif", "Assisted-Chin-Up.gif"])),
    ("remada-unilateral.gif", urls_fp(["One-Arm-Dumbbell-Row.gif", "Single-Arm-Dumbbell-Row.gif", "Dumbbell-One-Arm-Row.gif"])),
    ("rosca-martelo.gif", urls_fp(["Hammer-Curl.gif", "Dumbbell-Hammer-Curl.gif"])),
    ("russian-twist.gif", urls_fp(["Russian-Twist.gif", "Medicine-Ball-Russian-Twist.gif"])),
    ("passada.gif", urls_fp(["Dumbbell-Lunge.gif", "Walking-Lunge.gif", "Bodyweight-Lunge.gif"])),
    ("mesa-flexora.gif", urls_fp(["Lying-Leg-Curl.gif", "Seated-Leg-Curl.gif", "Leg-Curl.gif"])),
    ("arnold-press.gif", urls_fp(["Arnold-Press.gif", "Dumbbell-Arnold-Press.gif"])),
]


def request_headers_for(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "image/gif,image/*,*/*",
    }
    if "fitnessprogramer" in url:
        headers["Referer"] = "https://fitnessprogramer.com/"
    elif "weighttraining" in url:
        headers["Referer"] = "https://weighttraining.guide/"
    return headers


def download_from_candidates(urls):
    last_error = None
    for url in urls:
        try:
            request = urllib.request.Request(url, headers=request_headers_for(url))
            with urllib.request.urlopen(request, timeout=15) as response:
                data = response.read()

            if len(data) > 500 and data[:3] == b"GIF":
                return data, url
        except Exception as error:
            last_error = error
        time.sleep(0.08)

    raise RuntimeError(f"No working URL found. Last error: {last_error}")


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("\nDownloading exercise GIFs...\n")

    downloaded = 0
    failed = 0
    failed_files = []

    for filename, urls in GIF_SOURCES:
        destination = os.path.join(OUTPUT_DIR, filename)

        if os.path.exists(destination) and os.path.getsize(destination) > 1000:
            print(f"  SKIP {filename} (already exists)")
            downloaded += 1
            continue

        print(f"  TRY  {filename} ({len(urls)} candidate URLs)...", end="", flush=True)
        try:
            data, working_url = download_from_candidates(urls)
            with open(destination, "wb") as file_handle:
                file_handle.write(data)
            size_kb = len(data) // 1024
            print(f"\r  OK   {filename} ({size_kb} KB) from {working_url}")
            downloaded += 1
        except Exception:
            # Fallback: keep app functional using a similar already-downloaded movement.
            if filename == "remada-unilateral.gif":
                source = os.path.join(OUTPUT_DIR, "remada.gif")
                if os.path.exists(source) and os.path.getsize(source) > 1000:
                    shutil.copyfile(source, destination)
                    size_kb = os.path.getsize(destination) // 1024
                    print(f"\r  OK   {filename} ({size_kb} KB) from local fallback remada.gif")
                    downloaded += 1
                    continue

            print(f"\r  FAIL {filename} (not found)")
            failed += 1
            failed_files.append(filename)

    print(f"\nDone: {downloaded} succeeded | {failed} failed")

    if failed_files:
        print("\nCould not download these files automatically:")
        for filename in failed_files:
            print(f"  - {filename}")

        print("\nManual fallback links:")
        for filename in failed_files:
            if "press" in filename:
                link = "https://fitnessprogramer.com/?s=press"
            elif "curl" in filename or "rosca" in filename:
                link = "https://fitnessprogramer.com/?s=curl"
            elif "lunge" in filename or "passada" in filename:
                link = "https://fitnessprogramer.com/?s=lunge"
            else:
                link = "https://fitnessprogramer.com/?s=exercise"
            print(f"  - {filename}: {link}")


if __name__ == "__main__":
    main()
