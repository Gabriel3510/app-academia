# App Academia V1.1

Aplicativo de treino feito em HTML/CSS/JS com suporte a Android (APK) usando Capacitor.

## Funcionalidades

- Plano semanal de treino
- Marcação de progresso por dia e por exercício
- Troca de exercícios por variações equivalentes
- Tema claro/escuro
- Suporte a GIFs dos exercícios

## Executar no Navegador

```bash
python3 baixar_gifs.py
```

Depois abra `index.html` no navegador.

## Gerar APK (Debug)

### Requisitos

- Node.js 18+
- Java 17 com `javac` e `JAVA_HOME` configurado
- Android SDK configurado

Exemplo Linux (ajuste conforme seu JDK):

```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
```

### Comandos principais

```bash
npm install
npm run apk:debug
```

APK gerado em:

`android/app/build/outputs/apk/debug/app-debug.apk`

## Gerar APK (Release) v1.1

```bash
npm install
npm run apk:release:v1.1
```

APK gerado em:

`release/App-Academia-v1.1-release-unsigned.apk`

Observacao: este APK e de release sem assinatura final para loja.

## Colocar o APK de Debug no commit (opcional)

Para versionar o APK no Git sem depender da pasta de build do Android:

```bash
npm run apk:commit
```

Isso gera/copia para:

`release/App-Academia-V1-debug.apk`

Essa pasta `release/` e esse APK podem ser commitados normalmente.

## Fluxo de atualizacao (passo a passo)

1. Altere o app (`index.html`, lógica, estilos etc.)
2. Atualize GIFs se necessário:

```bash
python3 baixar_gifs.py
```

3. Gere APK atualizado (debug):

```bash
npm run apk:commit
```

Ou gere release v1.1:

```bash
npm run apk:release:v1.1
```

4. Commit:

```bash
git add .
git commit -m "Atualiza app e APK"
git push
```

## Estrutura do projeto

```text
app-academia/
|-- index.html
|-- styles.css
|-- baixar_gifs.py
|-- capacitor.config.json
|-- package.json
|-- android/
|-- gifs/
`-- release/
    |-- App-Academia-v1.1-release-unsigned.apk
    `-- App-Academia-V1-debug.apk
```

## Observações importantes

- A pasta `android/app/build` continua ignorada no Git (correto).
- O APK para commit fica em `release/`, não na pasta de build.
- Para distribuicao em loja (Play Store), o ideal e gerar release assinado.
