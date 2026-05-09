# RentIt - szybki start

## Wymagania
- Docker Desktop (dla SQL Server)
- .NET SDK 10
- Node.js + npm

## 1) Uruchom baze danych (SQL Server)
W katalogu root projektu:

```bash
docker compose -f docker-compose-db.yml up -d
```

## 2) Uruchom backend (API)

```bash
cd RentIt.Server
dotnet run
```

API domyslnie:
- `http://localhost:5113`
- OpenAPI: `http://localhost:5113/openapi/v1.json`

## 3) Uruchom aplikacje mobilna

```bash
cd RentIt.Mobile
npm install
npm start
```

## 4) (Opcjonalnie) Pobierz spec i wygeneruj typy API w mobile
W `RentIt.Mobile`:

```bash
npm run api:swagger
npm run api:types
```

## Zatrzymanie bazy
W root projektu:

```bash
docker compose -f docker-compose-db.yml down
```

