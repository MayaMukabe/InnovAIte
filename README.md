# InnovAIte — Hero Academy

Brain Builder: Grow Your Mind is a game-based learning prototype that helps K–12 students practice independent reasoning in an AI-rich world. Learning grows a virtual Brain City, while timed Glitch Boss battles let students apply the skills they have built.

## Core experience

The prototype contains two independent loops:

1. **Brain Builder quests:** choose one of five cognitive districts, think before seeing choices, attempt a challenge, receive process-only guidance, explain the strategy, and upgrade the city.
2. **Glitch Boss battles:** solve five rapid-fire problems in 90 seconds. Correct answers damage the boss, consecutive hits earn combo damage, and mistakes cost time.

AI is framed as a coach, never the mathematical authority. Correctness remains grounded in a pre-reviewed question bank; the student controls every decision and whether to request a hint.

## Quick start

Requirements: Node.js 20.19+ or 22.12+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Commands

```bash
npm run dev      # Start the development server
npm run lint     # Run static analysis
npm run build    # Type-check and create a production build
npm run preview  # Preview the production build locally
```

## Technology

- React 19 and TypeScript
- Vite
- Plain CSS with responsive design tokens
- ESLint with TypeScript and React Hooks rules

The prototype intentionally has no backend. Brain City levels and XP are stored only in the current browser using `localStorage`; no responses are transmitted. Artwork is hotlinked from the supplied design references and should be replaced with licensed, project-owned assets before production.

## Documentation

- [Product specification](docs/PRODUCT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Responsible AI](docs/RESPONSIBLE_AI.md)
- [Plain-language code logic](LOGIC.md)
- [Hackathon demo guide](docs/DEMO.md)
- [Contributing](CONTRIBUTING.md)
- [Security policy](SECURITY.md)

## Project status

This repository is a functional front-end prototype, not a production student-data system. Authentication, a reviewed content service, secure server persistence, educator controls, accessibility testing with students, and COPPA/FERPA review are required before classroom deployment.

## License

No license has been granted yet. All rights reserved by the project owner.
