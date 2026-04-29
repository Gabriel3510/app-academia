#!/usr/bin/env sh

set -eu

if [ "$#" -lt 1 ]; then
  echo "Usage: ./scripts/run-gradle.sh <gradle-task> [args...]" >&2
  exit 1
fi

if ! command -v java >/dev/null 2>&1; then
  local_jdk_dir=$(find .local-jdk -maxdepth 1 -mindepth 1 -type d -name 'jdk-*' | sort | head -n 1)

  if [ -n "${local_jdk_dir:-}" ] && [ -x "$local_jdk_dir/bin/java" ]; then
    export JAVA_HOME="$PWD/$local_jdk_dir"
    export PATH="$JAVA_HOME/bin:$PATH"
  else
    echo "Java nao encontrado. Instale um JDK ou extraia um em .local-jdk/." >&2
    exit 1
  fi
fi

cd android
./gradlew "$@"