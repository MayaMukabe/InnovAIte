# How the code works

## Navigation and progression

`App` switches between Academy, Quests, Boss, and Library. Academy contains district training, functional Subject Archives, and Material Studio. Library is the separate XP manga-reward workflow.

Learner progression contains XP, five district levels, activity dates, unlocks, and aggregate learning evidence. React updates immediately, caches it in `localStorage`, and debounces synchronization to the API. If the API is unavailable, play continues locally and the header shows offline mode. Rank, streak, Mindprint, and evidence cards are calculated from saved activity rather than demo numbers.

## Brain Builder quests

`BrainQuest` follows:

```text
think → attempt → guidance → reflect → grown
```

Choices remain hidden during the thinking pause. The learner then attempts an answer, receives a process clue after a mistake, and explains a successful strategy before earning growth. The client requests level-aware content from `/api/questions/district/:district?band=...` and submits attempts to `/api/questions/district/:district/check`; generative AI does not decide correctness. The 120-question bank covers five districts at Middle School, High School, and Proficient levels.

## Glitch Boss

`GlitchBoss` is independent from quests:

```text
intro → playing → won or lost
```

A one-second timer runs during combat. Training Run, Challenger, and Mastery Siege independently control the question band, timer, miss penalty, and bonus reward. Correct answers reduce the Boss’s 100 HP; a charged combo increases damage. Correct attacks trigger screen shake, damage particles, and floating values. The final strike swaps to a dedicated defeated-Boss image. Effects respect reduced-motion preferences.

## Material Studio

The learner selects a `.txt`, `.md`, or `.pdf` file. `multer` holds it in memory, `pdf-parse` extracts PDF text, and `server/materials.ts` turns source sentences into review cards and source-grounded cloze questions. The raw file is never written to disk.

The extracted set is saved by the prototype store and can be opened in Learn or Assess mode. The server checks answers and returns supporting source evidence. Completing a set grants XP once.

## XP Comic Shop

Manga reward metadata is authored in the client. Unlocking checks XP, deducts the price, persists ownership, and reveals one official licensed chapter link at a time. When a licensed publisher offers only volume pages, the interface labels and links that format honestly. Promotional artwork remains remotely hosted by each official franchise source; the app does not reproduce chapters or bypass publisher access controls.

## API and storage

`server/app.ts` exposes health, profile, reviewed-question, and material endpoints. `server/index.ts` starts it locally; `api/` exports it as Vercel Functions. Zod validates requests. `server/store.ts` serializes local JSON writes.

`src/gameLogic.ts` owns shared rewards, district caps, Boss damage, ranks, and streak calculations. Automated tests cover these rules and material generation.

## Production boundary

Local development uses JSON storage. Vercel uses ephemeral demo storage because function filesystems are not durable; browser progression remains local-first. Commercial use requires authentication and guardian consent, a transactional database, per-user authorization, malware scanning, encrypted object storage, retention/deletion controls, observability, and reviewed content operations.
