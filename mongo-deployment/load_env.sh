#!/bin/bash

# �cie�ki do plik�w .env i .env.admin
ENV_FILE="$(dirname "$0")/.env"
ENV_ADMIN_FILE="$(dirname "$0")/.env.admin"

# Funkcja do wczytywania zmiennych z pliku
load_env() {
    if [ -f "$1" ]; then
        while IFS='=' read -r key value; do
            if [ -n "$key" ] && [ "${key:0:1}" != '#' ]; then
                value=$(echo "$value" | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')
                export "$key=$value"
                echo "Za�adowano: $key=${value:0:3}***" # Pokazujemy tylko pierwsze 3 znaki warto�ci
            fi
        done < "$1"
    else
        echo "Plik $1 nie istnieje."
        exit 1
    fi
}

# Wczytaj zmienne z .env.admin
echo "Wczytywanie zmiennych z .env.admin:"
load_env "$ENV_ADMIN_FILE"

# Sprawd�, czy wszystkie potrzebne zmienne s� ustawione
required_vars_admin=(MONGO_INITDB_ROOT_USERNAME MONGO_INITDB_ROOT_PASSWORD MY_IP MONGO_INITDB_DATABASE_PORT_INTERNAL)
for var in "${required_vars_admin[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Brak wymaganej zmiennej $var w pliku .env.admin"
        exit 1
    fi
done

# Utw�rz CONNECTION_STRING
CONNECTION_STRING="mongodb://$MONGO_INITDB_ROOT_USERNAME:$MONGO_INITDB_ROOT_PASSWORD@$MY_IP:$MONGO_INITDB_DATABASE_PORT_INTERNAL/admin?authSource=admin&replicaSet=rs0"

echo "Utworzony CONNECTION_STRING:"
echo "$CONNECTION_STRING"

# Wczytaj zmienne z .env
echo "Wczytywanie zmiennych z .env:"
load_env "$ENV_FILE"

# Sprawd�, czy wszystkie potrzebne zmienne s� ustawione
required_vars=(MONGO_INITDB_DATABASE_USERNAME MONGO_INITDB_DATABASE_PASSWORD MONGO_INITDB_DATABASE_NAME)
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Brak wymaganej zmiennej $var w pliku .env"
        exit 1
    fi
done

# Wy�wietl zmienne przed eksportem
echo "Zmienne gotowe do eksportu:"
echo "MONGO_INITDB_DATABASE_USERNAME: $MONGO_INITDB_DATABASE_USERNAME"
echo "MONGO_INITDB_DATABASE_PASSWORD: ${MONGO_INITDB_DATABASE_PASSWORD:0:3}***"
echo "MONGO_INITDB_DATABASE_NAME: $MONGO_INITDB_DATABASE_NAME"
echo "CONNECTION_STRING: $CONNECTION_STRING"

# Tutaj mo�esz doda� eksport zmiennych, je�li wszystko jest poprawne
# export MONGO_INITDB_DATABASE_USERNAME
# export MONGO_INITDB_DATABASE_PASSWORD
# export MONGO_INITDB_DATABASE_NAME
# export CONNECTION_STRING

echo "Skrypt zako�czony. Zmienne s� gotowe do eksportu."
