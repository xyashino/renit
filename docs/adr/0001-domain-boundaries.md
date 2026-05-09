# ADR 0001: Domain Boundaries for RentIt

- Status: Accepted
- Date: 2026-05-09
- Deciders: Product + Engineering
- Related: `APPLICATION_DOMAINS.md`

## Context

The application currently includes features for authentication, profile management, equipment listing and management, rentals, and reviews.
As the codebase grows, feature boundaries can become unclear, causing coupling between UI flows, API services, and business rules.

We need a shared architecture decision that defines stable domain boundaries for implementation and future refactoring in the mobile app.

## Decision

We adopt the following bounded contexts:

1. Authentication
2. User Profile
3. Equipment Catalog
4. Owner Inventory
5. Rentals
6. Reviews

Each domain owns its application logic and infrastructure adapters.
Cross-domain interactions are allowed only through explicit APIs/contracts (not through direct internal coupling).

`APPLICATION_DOMAINS.md` is the canonical high-level domain description.

## Consequences

### Positive

- Clear ownership of business logic per domain.
- Easier migration to `src/domains/*` feature-first structure.
- Better testability by isolating rules and use-cases.
- Lower risk of accidental coupling between owner and client flows.

### Negative

- Some temporary duplication may appear during migration.
- Initial refactor effort is required to align existing hooks/services.

### Neutral

- Routing can remain in `app/*` (Expo Router) while internals move to domain modules.

## Implementation Notes

- Keep route files thin; move logic to domain-level hooks/use-cases.
- Place shared primitives in `src/shared/*`.
- Prefer explicit DTO mapping in domain infrastructure layer.
- Track future boundary changes with new ADRs (do not rewrite history).
