# InnovAIte — Hero Academy

Brain Builder: Grow Your Mind is a game-based learning prototype that helps K–12 students practice independent reasoning in an AI-rich world. Learning grows a virtual Brain City, while timed Glitch Boss battles let students apply the skills they have built.

## Core experience

The prototype contains two independent loops:

1. **Brain Builder quests:** choose one of five cognitive districts, think before seeing choices, attempt a challenge, receive process-only guidance, explain the strategy, and upgrade the city.
2. **Glitch Boss battles:** solve five rapid-fire problems in 90 seconds. Correct answers damage the boss, consecutive hits earn combo damage, and mistakes cost time.
3. **Material Studio:** upload TXT, Markdown, or PDF notes, learn through grounded source cards, then take an evidence-backed assessment.
4. **Adventure Comics:** spend learning-earned XP to unlock original comic chapters and read them inside the app.

AI is framed as a coach, never the mathematical authority. Correctness remains grounded in a pre-reviewed question bank; the student controls every decision and whether to request a hint.

The Academy also includes adaptive district recommendations, a five-skill Mindprint, effort evidence, unlockable achievements, best Boss time, private progress export, and a visible responsible-AI trust model.

## Quick start

Requirements: Node.js 20.19+ or 22.12+ and npm.

```bash
npm install
npm run dev
```

`npm run dev` starts the Express API and Vite app together.

- App: [http://localhost:5173](http://localhost:5173)
- API health: [http://localhost:8787/api/health](http://localhost:8787/api/health)

## Commands

```bash
npm run dev      # Start the development server
npm run start    # Serve the built app and API
npm run lint     # Run static analysis
npm run test     # Run automated game-rule tests
npm run build    # Type-check and create a production build
npm run build:server # Type-check the API
npm run preview  # Preview the production build locally
```

## Technology

- React 19 and TypeScript
- Vite
- Express 5 and Zod validation
- Multer memory uploads and pdf-parse
- Serialized file-backed development persistence
- Plain CSS with responsive design tokens
- ESLint with TypeScript and React Hooks rules

Progress syncs to Express and is cached in `localStorage` for offline resilience. Raw uploaded files remain in memory during extraction; generated study-set excerpts are persisted locally. Original artwork is stored under `public/images`.

## Documentation

- [Product specification](docs/PRODUCT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Responsible AI](docs/RESPONSIBLE_AI.md)
- [Plain-language code logic](logic.md)
- [Hackathon demo guide](docs/DEMO.md)
- [Visual asset provenance](docs/ASSETS.md)
- [API contract](docs/API.md)
- [Contributing](CONTRIBUTING.md)
- [Security policy](SECURITY.md)

## Project status

This repository is a functional full-stack hackathon prototype, not yet an approved production student-data system. Authentication, managed persistence, educator/guardian roles, browser accessibility tests, observability, rate limiting, backups, content operations, and COPPA/FERPA review remain required.

## License

No license has been granted yet. All rights reserved by the project owner.
