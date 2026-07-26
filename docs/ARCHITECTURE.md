# Architecture

## Overview

Hero Academy is currently a client-only React single-page application. `src/App.tsx` contains the prototype screens and state machine; `src/styles.css` contains the visual system and responsive behavior.

```text
Browser
├── App shell
│   ├── Header
│   └── Primary navigation
├── Academy / Library / Boss
└── Quest state machine
    ├── Detect
    ├── Repair
    ├── Explain
    ├── Transfer
    └── Victory
```

## Design decisions

- Local React state keeps the prototype inspectable and dependency-light.
- Mathematical checks are deterministic rather than model-generated.
- Navigation avoids a router while the screen set remains small.
- Plain CSS exposes all design tokens and avoids runtime styling overhead.
- Reduced-motion preferences are respected globally.

## Production evolution

Before production, split screen components and domain logic into separate modules, add route-level code splitting, and introduce:

1. A reviewed content API with immutable answer keys.
2. A privacy-preserving identity and progress service.
3. A constrained coaching service that cannot modify correctness.
4. Educator content-review and audit tooling.
5. Automated unit, integration, accessibility, and end-to-end tests.

## Data boundaries

The current prototype does not transmit or persist student responses. A production design should minimize collection, separate identity from learning events, define retention limits, encrypt data in transit and at rest, and support guardian/educator deletion workflows.
