# Workout Plan App

Responsive HTML workout plan with animated exercise GIFs.

## Run In Browser

Open `index.html` directly in your browser.

## Build Android APK (Capacitor)

This project is configured to generate an Android app using Capacitor.

### Requirements

- Node.js 18+
- Java 17 (recommended for recent Android toolchains)
- Android Studio with Android SDK installed

### Setup

```bash
npm install
```

### Sync Web Files to Android

```bash
npm run cap:sync
```

### Open in Android Studio

```bash
npm run cap:open
```

Then in Android Studio:

1. Wait for Gradle sync
2. Select build variant `debug` (or `release`)
3. Build APK via `Build > Build Bundle(s) / APK(s) > Build APK(s)`

### Build Debug APK from Terminal

```bash
npm run apk:debug
```

Debug APK output usually appears at:

`android/app/build/outputs/apk/debug/app-debug.apk`

## Project Structure

```text
app-academia/
|-- index.html
|-- baixar_gifs.py
|-- README.md
`-- gifs/
    |-- supino.gif
    |-- crucifixo.gif
    `-- ...
```

## How To Use

1. Clone the repository

```bash
git clone https://github.com/Gabriel3510/app-academia.git
cd app-academia
```

2. Download GIFs automatically

```bash
python3 baixar_gifs.py
```

3. Open the app

Open `index.html` directly in your browser.

## Included Weekly Split

- Monday: Cardio
- Tuesday: Chest, Triceps, Abs
- Wednesday: Back, Biceps, Abs
- Thursday: Legs, Shoulders
- Friday: Cardio

## GIF Source Note

GIF files are not included in the repository due to copyright considerations.
Run `baixar_gifs.py` to fetch them automatically.
