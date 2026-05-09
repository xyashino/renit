---
version: 1.1
updated: 09.05.2026
---

# Application Domains — RentIt

Dokument definiuje szczegółowe bounded contexts aplikacji RentIt Mobile.
Każda domena posiada własną warstwę aplikacji, domeny, infrastruktury i UI zgodnie z ADR `docs/adr/0001-domain-boundaries.md`.

---

## 1. Authentication (Tożsamość i Dostęp)

**Responsibility:** Logowanie, rejestracja, zarządzanie sesją, przechowywanie tokenu i tożsamość użytkownika w kontekście całej aplikacji.

**Folder:** `src/domains/authentication/`

**Key Concepts:**
- Logowanie email/hasło
- Rejestracja nowego konta
- Przechowywanie i odczyt tokenu JWT
- Kontekst sesji dostępny globalnie (`AuthContext`)
- Redirect po autoryzacji (entry point aplikacji)
- Logout i czyszczenie sesji
- Obsługa błędów uwierzytelniania

**Screens:**
- `app/(auth)/sign-in.tsx` → `src/domains/authentication/ui/screens/sign-in-screen.tsx`
- `app/(auth)/sign-up.tsx` → `src/domains/authentication/ui/screens/sign-up-screen.tsx`
- `app/index.tsx` — redirect na podstawie stanu sesji

**Application Layer (`application/`):**
- `hooks/use-sign-in.ts` — logika logowania z obsługą błędów i nawigacją
- `hooks/use-sign-up.ts` — logika rejestracji z obsługą błędów i nawigacją
- `schemas/auth.ts` — schematy walidacji formularzy (zod)
- `auth-context.tsx` — React Context z tokenem, userId, isLoading, logout

**Infrastructure Layer (`infrastructure/`):**
- `auth-api.ts` — wywołania `POST /api/auth/login`, `POST /api/auth/register`, mapowanie DTO → AuthResponse

**UI Layer (`ui/`):**
- `components/sign-in-form-card.tsx`
- `components/sign-up-form-card.tsx`
- `screens/sign-in-screen.tsx`
- `screens/sign-up-screen.tsx`

**Entities / Value Objects:**
- `AuthUser { id, firstName, lastName, email }` — tożsamość zalogowanego użytkownika
- `AuthToken` — surowy string JWT
- `AuthSession { token, userId, email }` — stan sesji

**Out of Scope:**
- Dane profilowe poza sesją (handled by User Profile domain)
- Role i uprawnienia biznesowe (handled by każdej domenie osobno)
- Reset hasła (nie zaimplementowany)

---

## 2. User Profile (Profil Użytkownika)

**Responsibility:** Odczyt i edycja danych profilowych zalogowanego użytkownika.

**Folder:** `src/domains/user-profile/`

**Key Concepts:**
- Wyświetlanie aktualnych danych użytkownika (imię, nazwisko, email, adres)
- Edycja i zapis profilu
- Formularz profilu z walidacją
- Spójność danych użytkownika z API

**Screens:**
- `app/(tabs)/profile.tsx` → `src/domains/user-profile/ui/screens/profile-screen.tsx`

**Application Layer (`application/`):**
- `hooks/use-profile-form.ts` — pobieranie i aktualizacja profilu, obsługa stanu formularza

**Infrastructure Layer (`infrastructure/`):**
- `users-api.ts` — wywołania `GET /api/users/{id}`, `PUT /api/users/{id}`, mapowanie DTO → UserProfile

**UI Layer (`ui/`):**
- `components/profile-form.tsx`
- `screens/profile-screen.tsx`

**Entities / Value Objects:**
- `UserProfile { id, firstName, lastName, email, address? }` — pełne dane profilowe

**Out of Scope:**
- Sesja i token (handled by Authentication domain)
- Powiązanie profilu ze sprzętem lub rezerwacjami (handled by Owner Inventory, Rentals)

---

## 3. Equipment Catalog (Katalog Sprzętu)

**Responsibility:** Publiczne przeglądanie dostępnego sprzętu, filtrowanie po kategoriach, szczegóły oferty oraz opinie w trybie odczytu.

**Folder:** `src/domains/equipment-catalog/`

**Key Concepts:**
- Lista sprzętu z filtrowaniem po kategorii
- Wyszukiwanie i przeglądanie ofert
- Szczegóły sprzętu: nazwa, opis, cena/dzień, kaucja, adres, status dostępności
- Kategorie sprzętu jako elementy nawigacji
- Prezentacja ocen i opinii innych użytkowników (read-only)
- Wejście do formularza rezerwacji (przekazanie kontekstu do domeny Rentals)

**Screens:**
- `app/(tabs)/index.tsx` → ekran główny z listą i filtrami
- `app/equipment/[id].tsx` → szczegóły sprzętu + formularz rezerwacji (z domeny Rentals)

**Application Layer (`application/`):**
- `hooks/use-equipment-search.ts` — lista sprzętu, stan kategorii, filtrowanie
- `hooks/use-product-detail.ts` — dane szczegółowe jednej oferty, opinie, średnia ocena

**Infrastructure Layer (`infrastructure/`):**
- `equipment-api.ts` — wywołania `GET /api/equipment`, `GET /api/equipment/{id}`, mapowanie DTO → Equipment
- `reviews-api.ts` — wywołania `GET /api/reviews` dla danego sprzętu, mapowanie DTO → Review

**UI Layer (`ui/`):**
- `components/equipment-card.tsx`
- `components/equipment-image.tsx`
- `components/category-filter.tsx`
- `screens/equipment-list-screen.tsx`
- `screens/equipment-detail-screen.tsx`

**Entities / Value Objects:**
- `Equipment { id, name, description?, imageUrl?, pricePerDay, deposit, address, userId, category, status, tags?, reviews? }`
- `Category { id, key, label, icon }` — wartości słownikowe filtrowania
- `Status { id, key: 'available' | 'rented' | 'unavailable', label }` — dostępność sprzętu
- `Review { id, rating, comment?, createdAt, authorId, equipmentId, rentalId }` — opinia po zakończonym wypożyczeniu

**Out of Scope:**
- Dodawanie, edycja, usuwanie sprzętu (handled by Owner Inventory domain)
- Cykl życia rezerwacji (handled by Rentals domain)
- Wystawianie opinii (handled by Reviews domain)

---

## 4. Owner Inventory (Zarządzanie Ofertą Właściciela)

**Responsibility:** Operacje CRUD na sprzęcie właściciela oraz podgląd przychodzących rezerwacji dla konkretnego sprzętu.

**Folder:** `src/domains/owner-inventory/`

**Key Concepts:**
- Lista sprzętu należącego do zalogowanego właściciela
- Dodawanie nowego ogłoszenia sprzętu
- Edycja istniejącego ogłoszenia
- Usuwanie ogłoszenia (z potwierdzeniem)
- Zmiana statusu sprzętu (dostępny / niedostępny)
- Podgląd rezerwacji złożonych na konkretny sprzęt

**Screens:**
- `app/(tabs)/equipment.tsx` → lista „Mój sprzęt"
- `app/equipment/add.tsx` → formularz dodawania (modal)
- `app/equipment/edit.tsx` → formularz edycji (modal)
- `app/equipment/rentals.tsx` → lista rezerwacji danego sprzętu

**Application Layer (`application/`):**
- `hooks/use-my-equipment.ts` — lista sprzętu właściciela, akcja usunięcia z potwierdzeniem
- `hooks/use-add-equipment.ts` — formularz dodawania, submit do API
- `hooks/use-edit-equipment.ts` — ładowanie danych, formularz edycji, submit do API

**Infrastructure Layer (`infrastructure/`):**
- `equipment-api.ts` — wywołania `POST /api/equipment`, `PUT /api/equipment/{id}`, `DELETE /api/equipment/{id}`, mapowanie DTO
- `rentals-api.ts` (read) — wywołania `GET /api/rentals` + filtrowanie po `equipmentId`

**UI Layer (`ui/`):**
- `components/equipment-list-card.tsx`
- `components/add-equipment-form.tsx`
- `components/edit-equipment-form.tsx`
- `screens/my-equipment-screen.tsx`
- `screens/add-equipment-screen.tsx`
- `screens/edit-equipment-screen.tsx`
- `screens/equipment-rentals-screen.tsx`

**Entities / Value Objects:**
- `Equipment` (shared type z Equipment Catalog — ten sam byt, inny kontekst użycia)
- `EquipmentDraft { name, description?, imageUrl?, pricePerDay, deposit, address, categoryId, statusId }` — dane formularza przed zapisem

**Out of Scope:**
- Publiczne przeglądanie katalogu (handled by Equipment Catalog domain)
- Zarządzanie cyklem życia rezerwacji jako strona właściciela (handled by Rentals domain)

---

## 5. Rentals (Rezerwacje i Wypożyczenia)

**Responsibility:** Pełny cykl życia rezerwacji: złożenie, szczegóły, zmiany statusu, historia oraz akcje właściciela i klienta.

**Folder:** `src/domains/rentals/`

**Key Concepts:**
- Złożenie nowej rezerwacji przez klienta (zakres dat, notatka, adres)
- Podsumowanie kosztu przed złożeniem rezerwacji
- Statusy rezerwacji: `pending` (oczekuje) / `rented` (aktywna) / `available` (zakończona/anulowana)
- Widok historii i filtrowanie po statusie
- Szczegóły rezerwacji ze sprzętem, kosztem i terminem
- Potwierdzenie rezerwacji przez właściciela
- Anulowanie rezerwacji przez klienta
- Oznaczenie wypożyczenia jako zakończone przez właściciela
- Ekran potwierdzenia po złożeniu rezerwacji

**Screens:**
- `app/(tabs)/rentals.tsx` → lista moich wypożyczeń z zakładkami (aktywne / oczekujące / historia)
- `app/rental/[id].tsx` → szczegóły rezerwacji + akcje
- `app/rental/confirmed.tsx` → ekran sukcesu po złożeniu rezerwacji
- `app/equipment/[id].tsx` (część) → formularz `NewRentalForm` wbudowany w szczegóły sprzętu

**Application Layer (`application/`):**
- `hooks/use-my-rentals.ts` — lista rezerwacji, zakładki, filtrowanie, obsługa błędów
- `hooks/use-new-rental.ts` — formularz rezerwacji, obliczanie dni i ceny, submit
- `hooks/use-rental-detail.ts` — dane szczegółowe rezerwacji, mutacje statusu, akcje owner/client, nawigacja

**Infrastructure Layer (`infrastructure/`):**
- `rentals-api.ts` — wywołania `GET /api/rentals`, `GET /api/rentals/{id}`, `POST /api/rentals`, `PATCH /api/rentals/{id}/status`, `DELETE /api/rentals/{id}`, mapowanie DTO → Rental

**UI Layer (`ui/`):**
- `components/rental-card.tsx`
- `components/rental-row.tsx`
- `components/new-rental-form.tsx`
- `screens/rentals-screen.tsx`
- `screens/rental-detail-screen.tsx`
- `screens/rental-confirmed-screen.tsx`

**Entities / Value Objects:**
- `Rental { id, dateFrom, dateTo, notes?, address, clientId, equipmentId, statusId, client?, equipment?, status? }`
- `RentalStatus { key: 'available' | 'rented' | 'unavailable' }` — wartość obiektowa statusu
- `RentalDraft { dateFrom, dateTo, notes?, address, clientId, equipmentId, statusId }` — dane formularza przed zapisem

**Out of Scope:**
- Dane sprzętu poza rezerwacją (handled by Equipment Catalog domain)
- Wystawianie opinii po zakończeniu (handled by Reviews domain)
- Zarządzanie ogłoszeniami właściciela (handled by Owner Inventory domain)

---

## 6. Reviews (Opinie)

**Responsibility:** Zbieranie i przechowywanie ocen wystawianych przez klientów po zakończonym wypożyczeniu.

**Folder:** `src/domains/reviews/`

**Key Concepts:**
- Ocena (1–5) powiązana z konkretnym `rentalId` i `equipmentId`
- Opcjonalny komentarz tekstowy
- Wystawianie opinii dostępne tylko po zakończeniu rezerwacji
- Agregacja ocen widoczna w szczegółach sprzętu (Equipment Catalog)

**Application Layer (`application/`):**
- `hooks/use-reviews.ts` — pobieranie listy opinii dla sprzętu

**Infrastructure Layer (`infrastructure/`):**
- `reviews-api.ts` — wywołania `GET /api/reviews?equipmentId=`, mapowanie DTO → Review

**Entities / Value Objects:**
- `Review { id, rating, comment?, createdAt, authorId, equipmentId, rentalId, author? }`

**Out of Scope:**
- Wyświetlanie opinii na stronie szczegółów sprzętu (handled by Equipment Catalog domain — read-only)
- Lifecycle rezerwacji (handled by Rentals domain)

---

## Domain Interactions

```
Authentication
  → User Profile     (sesja dostarcza userId do operacji na profilu)
  → Equipment Catalog (uwierzytelniony użytkownik widzi pełny katalog)
  → Owner Inventory  (tylko właściciel może zarządzać swoim sprzętem)
  → Rentals          (tylko uwierzytelniony klient może złożyć rezerwację)

User Profile
  → Owner Inventory  (profil właściciela powiązany z jego ogłoszeniami)
  → Rentals          (profil klienta powiązany z jego rezerwacjami)

Equipment Catalog
  → Rentals          (wybrany sprzęt jest punktem wejścia do złożenia rezerwacji)
  → Reviews          (opinie agregowane i wyświetlane na detalu sprzętu)

Owner Inventory
  → Rentals          (ogłoszenia właściciela otrzymują rezerwacje od klientów)

Rentals
  → Reviews          (zakończone wypożyczenie umożliwia wystawienie opinii)

Reviews
  → Equipment Catalog (agregat ocen zasilany z Reviews, prezentowany w Catalog)
```

---

## Shared

Kod nieprzypisany do konkretnej domeny trafia do `src/shared/`:

| Folder | Zawartość |
|---|---|
| `shared/api/` | Klient HTTP (`apiClient`), interceptory, typy błędów API |
| `shared/ui/` | Komponenty wielokrotnego użytku (Button, Card, Text, Badge…) |
| `shared/hooks/` | Hooki pomocnicze niezwiązane z domeną |
| `shared/types/` | Typy wspólne między domenami (Status, Category, Tag) |
| `shared/utils/` | Funkcje pomocnicze (formatDate, cn, lookups) |
| `shared/constants/` | Stałe aplikacji (THEME, statusy, kategorie) |
| `shared/auth/` | Jawny kontrakt sesji cross-domain (np. `shared/auth/session`) |

### Cross-domain import rules

- Do: domeny mogą importować wyłącznie z `shared/*` przy komunikacji między domenami.
- Do not: domeny nie importują bezpośrednio `application/*`, `infrastructure/*`, `ui/*` innych domen.
- Authentication contract: inne domeny konsumują sesję tylko przez `shared/auth/session`.
