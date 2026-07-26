# Architecture

## Overview

Brain Builder is currently a client-only React single-page application. `src/App.tsx` contains the prototype screens, reviewed content, city progression, learning state machine, and boss combat engine. `src/styles.css` contains the visual system and responsive behavior.

```text
Browser
├── App shell
│   ├── Header
│   └── Primary navigation
├── Brain City
│   └── District quest state machine
│       ├── Think
│       ├── Attempt
│       ├── Reflect
│       └── Grow
├── Glitch Boss
│   ├── Countdown timer
│   ├── Question and attack engine
│   └── Victory / timeout result
└── Library
```

## Design decisions

- Local React state keeps the prototype inspectable and dependency-light.
- Mathematical checks are deterministic rather than model-generated.
- The Boss timer is created and cleaned up with a React effect.
- XP and district levels use `localStorage` so progress survives refreshes.
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

The current prototype does not transmit student responses. It stores only XP and district levels in browser `localStorage`. Clearing site data removes that progress. A production design should minimize collection, separate identity from learning events, define retention limits, encrypt data in transit and at rest, and support guardian/educator deletion workflows.
