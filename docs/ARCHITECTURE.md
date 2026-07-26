# Architecture

## Overview

Brain Builder is a local-first React and Express application. The client owns interaction state and offline cache; the API owns persisted profiles, reviewed question checks, material extraction, and grounded study sets.

```text
Browser
├── Academy and illustrated Brain City
├── District quest state machine
│   └── Think → Attempt → Reflect → Grow
├── Timed Glitch Boss combat
├── XP comic shop and reader
└── Material Studio
    ├── Upload
    ├── Learn cards
    └── Source-grounded assessment

Express API
├── Health and version
├── Validated profile persistence
├── Reviewed question delivery
├── Server-side answer checks
└── Material extraction and study-set storage
```

## Key decisions

- React state keeps each game loop explicit and inspectable.
- Mathematical correctness is deterministic and server checked.
- District questions rotate daily from a reviewed server pool.
- Browser `localStorage` provides an offline progression cache.
- Profile changes sync to the API after a 500 ms debounce.
- API file writes are serialized to prevent overlapping updates in one process.
- Raw uploads use memory storage, a 5 MB limit, and a MIME allowlist.
- PDF text is extracted by `pdf-parse`; raw files are not written to disk.
- Grounded questions retain source sentences for evidence reveal.
- Local WebP assets avoid key visual hotlink dependencies.
- Reduced-motion preferences disable nonessential animation.

## Current persistence

`server/store.ts` provides serialized JSON persistence for single-process development. It stores profiles and generated study sets under the ignored `server/data/store.json`. This is real persistence but not a multi-instance production database.

## Production evolution

Before selling or deploying with students:

1. Replace demo IDs and JSON persistence with authenticated roles and managed PostgreSQL.
2. Add immutable content versions, educator approval, reporting, and rollback.
3. Add constrained AI coaching that cannot modify correctness.
4. Add malware scanning, parser sandboxing, deletion controls, and retention jobs.
5. Add observability, rate limiting, backups, integration tests, accessibility automation, and end-to-end tests.
6. Complete COPPA, FERPA, threat-model, and age-appropriate design reviews.

## Data boundary

The prototype syncs aggregate progress and generated study sets to a local API. Raw uploaded files are not persisted, but extracted excerpts are. Optional report export excludes answers and reflection text. Production must add explicit retention/deletion controls, tenant isolation, encrypted managed storage, and guardian/educator access workflows.
