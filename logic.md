# How the code works

## Navigation and progression

`App` switches between Academy, Quests, Boss, and Library. Library opens Material Studio or the XP Comic Shop as separate workflows.

Learner progression contains XP, five district levels, activity dates, unlocks, and aggregate learning evidence. React updates immediately, caches it in `localStorage`, and debounces synchronization to the API. If the API is unavailable, play continues locally and the header shows offline mode. Rank, streak, Mindprint, and evidence cards are calculated from saved activity rather than demo numbers.

## Brain Builder quests

`BrainQuest` follows:

```text
think → attempt → guidance → reflect → grown
```

Choices remain hidden during the thinking pause. The learner then attempts an answer, receives a process clue after a mistake, and explains a successful strategy before earning growth. The client requests reviewed content from `/api/questions/daily` and submits attempts to `/api/questions/check`; generative AI does not decide correctness. A small local question remains available offline.

## Glitch Boss

`GlitchBoss` is independent from quests:

```text
intro → playing → won or lost
```

A one-second timer runs during combat. Correct answers reduce the Boss’s 100 HP; a charged combo increases damage. Incorrect answers reset the combo and remove time. Correct attacks trigger screen shake, damage particles, and floating values. The final strike swaps to a dedicated defeated-Boss image and launches the victory sequence. Effects respect reduced-motion preferences.

## Material Studio

The learner selects a `.txt`, `.md`, or `.pdf` file. `multer` holds it in memory, `pdf-parse` extracts PDF text, and `server/materials.ts` turns source sentences into review cards and source-grounded cloze questions. The raw file is never written to disk.

The extracted set is saved by the prototype store and can be opened in Learn or Assess mode. The server checks answers and returns supporting source evidence. Completing a set grants XP once.

## XP Comic Shop

Comic metadata and chapters are authored in the client. Unlocking checks the learner’s XP, deducts the price, persists ownership, and opens the chapter reader.

## API and storage

`server/index.ts` exposes health, profile, reviewed-question, and material endpoints. Zod validates requests. `server/store.ts` serializes JSON writes to prevent simultaneous updates from corrupting the prototype database.

`src/gameLogic.ts` owns shared rewards, district caps, Boss damage, ranks, and streak calculations. Automated tests cover these rules and material generation.

## Production boundary

The JSON store is for a local hackathon build, not multi-user deployment. Commercial use requires authentication and guardian consent, a transactional database, per-user authorization, malware scanning, encrypted object storage, retention/deletion controls, observability, and reviewed content operations. AI may coach the process; it must not replace the approved answer key.
