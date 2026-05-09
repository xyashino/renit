# RentIt Mobile - Struktura kodu

Dokument opisuje docelowa strukture kodu aplikacji mobilnej zgodna z ADR `docs/adr/0001-domain-boundaries.md`.

## Cel

- Utrzymac jasne granice domenowe.
- Odseparowac routing od logiki biznesowej.
- Przenosic logike do `src/domains/*` i `src/shared/*`.

## Struktura katalogow

```text
RentIt.Mobile/
  app/                              # Expo Router: routing i cienkie ekrany
    (auth)/
    (tabs)/
    equipment/
    rentals/
    reviews/

  src/
    domains/
      authentication/
        application/                # use-case, hooki domenowe
        domain/                     # encje, reguly biznesowe, value objects
        infrastructure/             # API, repozytoria, mapowanie DTO
        ui/                         # komponenty specyficzne dla domeny

      user-profile/
        application/
        domain/
        infrastructure/
        ui/

      equipment-catalog/
        application/
        domain/
        infrastructure/
        ui/

      owner-inventory/
        application/
        domain/
        infrastructure/
        ui/

      rentals/
        application/
        domain/
        infrastructure/
        ui/

      reviews/
        application/
        domain/
        infrastructure/
        ui/

    shared/
      api/                          # wspolne klienty/interceptory API
      ui/                           # komponenty wielokrotnego uzycia
      hooks/                        # wspolne hooki
      types/                        # typy wspoldzielone miedzy domenami
      utils/                        # helpery bez logiki domenowej
```

## Zasady

- Pliki w `app/*` powinny byc cienkie: pobieraja dane i renderuja UI.
- Reguly biznesowe i orchestration flow trzymamy w `src/domains/*/application` oraz `src/domains/*/domain`.
- Integracje z backendem i mapowanie DTO trzymamy w `src/domains/*/infrastructure`.
- Kod wspolny, ktory nie nalezy do konkretnej domeny, trafia do `src/shared/*`.
- Interakcje miedzy domenami realizujemy przez jawne kontrakty, nie przez bezposrednie importy internali innej domeny.

## Migracja (kroki praktyczne)

1. Zostaw routing w `app/*`.
2. Przenos logike ekranow do odpowiednich domen.
3. Wydziel wspolne elementy do `src/shared/*`.
4. Dla zmian granic domen tworz nowe ADR, bez przepisywania historii.
