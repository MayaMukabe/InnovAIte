# How the code works

## App navigation

`App` stores the current screen: `academy`, `quests`, `boss`, or `library`. The bottom navigation changes that value and React displays the matching component.

## Brain City

`city` stores one level for each district: memory, logic, reading, creativity, and curiosity. A level controls the illustrated building’s height and progress bar. XP, district levels, and aggregate learning statistics are saved to browser `localStorage`.

The Academy compares all five levels and recommends the lowest one. This transparent rule is the prototype’s adaptive-learning starting point; no hidden model profiles the learner.

## Brain Builder quests

`BrainQuest` moves through:

```text
think → attempt → reflect → grown
```

- **Think:** The problem appears before answer choices.
- **Attempt:** The student commits to an answer.
- **Guidance:** A wrong attempt receives a strategy clue, not the answer.
- **Reflect:** A correct attempt requires a written strategy.
- **Grown:** The selected district gains one level and the learner earns XP.

Approved answers live in `questContent`; generative AI does not decide correctness.

## Glitch Boss

`GlitchBoss` is an independent state machine:

```text
intro → playing → won or lost
```

A React effect runs a one-second timer and cleans it up when combat closes. The boss starts with 100 HP. Correct answers deal 20 damage; a charged combo deals 25. Incorrect answers reset the combo and remove seven seconds. Zero HP wins; zero time loses. Victory grants 150 XP plus the remaining seconds.

## Evidence and reports

The app tracks completed quests, reflections, first-try wins, Boss wins, and best finish time. These totals power the Mindprint and achievements.

Report export creates a JSON file in the browser. It includes totals, XP, and district levels but excludes answers and written reflections.

## Shared rules

`src/gameLogic.ts` owns district caps, quest rewards, Boss damage, and Boss rewards. `src/gameLogic.test.ts` verifies them. The UI imports those functions so gameplay and tests share one source of truth.

## Production boundaries

A production version should move reviewed questions to a versioned content API, progress to a privacy-reviewed service, and coaching to a constrained AI endpoint. AI may coach the process or assess explanation clarity; it must not replace the approved answer key.
