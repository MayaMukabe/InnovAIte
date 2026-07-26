# How the code works

This is the simple mental model for the prototype.

## 1. The app chooses a screen

`App` keeps a `screen` value: `academy`, `quests`, `boss`, or `library`. The bottom navigation changes that value, and React displays the matching component.

## 2. Brain City stores five levels

`city` is an object with one number for each district:

```text
memory, logic, reading, creativity, curiosity
```

The number controls the building’s level and visual height. React saves the city object and total XP to browser `localStorage`. When the app opens again, it reads those saved values.

## 3. A Brain Builder quest follows four states

`BrainQuest` moves through:

```text
think → attempt → reflect → grown
```

- **Think:** The question appears without answer choices. The student pauses to form a strategy.
- **Attempt:** Choices appear and the student commits to one.
- **Guidance:** A wrong attempt shows a strategy clue, not the answer.
- **Reflect:** A correct attempt asks the student to explain the strategy.
- **Grown:** A complete explanation adds one level to the selected district and awards XP.

Questions and approved correct-answer indexes live in `questContent`. A generative model does not decide correctness.

## 4. The Glitch Boss has its own game state

`GlitchBoss` is independent from `BrainQuest`. Its `status` is:

```text
intro → playing → won or lost
```

When play starts, a React effect creates a one-second interval. Each tick subtracts one from `time`. The effect clears the interval when the battle ends or the component closes, preventing hidden timers.

The boss begins with 100 HP:

- Correct answer: 20 damage
- Three or more consecutive hits: 25 damage
- Incorrect answer: combo resets and seven seconds are removed
- Timer reaches zero: defeat
- HP reaches zero: victory

Victory awards 150 XP plus one XP for every second remaining.

## 5. React redraws the interface

Calling a state setter—such as `setHp`, `setCity`, or `setStage`—updates the value and makes React redraw the affected UI. HP bars, building heights, timer text, messages, and result screens are all derived from current state.

## 6. Where production services belong

The prototype is deliberately front-end only. A production version should move:

- reviewed questions and answer keys to a versioned content API;
- student progress to a privacy-reviewed secure service;
- process-only coaching to a constrained AI endpoint;
- teacher review, accessibility settings, and content reporting to dedicated tools.

The AI endpoint may coach or assess explanation clarity. It must never replace the reviewed answer key.
