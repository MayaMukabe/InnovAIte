# 2:30 hackathon pitch and demo

## The story in one sentence

Brain Builder turns the effort of independent thinking into a city students can grow—and turns AI from an answer machine into a coach.

## Exact pitch

### 0:00–0:20 — Hook and user

> Meet Maya, a 14-year-old who uses AI whenever homework gets difficult. She finishes faster, but she is practicing how to ask for answers—not how to reason through uncertainty. What if every independent thought helped her build something she was proud of?

**Screen:** Begin on Maya’s Brain City. Point to the five cognitive districts.

### 0:21–0:40 — Problem

> College Board found that high-school students using generative AI for schoolwork rose from 79% to 84% in just four months. AI access is not the enemy. Passive use is. Students need productive struggle, feedback, and visible evidence that their own thinking is growing.

**Action:** Select the Logic District and open its featured quest.

### 0:41–1:30 — Prototype demo

> Brain Builder makes Maya’s mind a city. Every district represents a skill, and learning upgrades its buildings. Before help appears, Maya must think and attempt.

**Action:** Submit the rehearsed incorrect answer.

> She does not receive the solution. Her coach gives a process hint and returns control to her.

**Action:** Submit the correct answer and a short strategy explanation. Show the reward and return to the city.

> Her effort becomes visible growth—not merely a score. Now the Boss Battle tests transfer without hints.

**Action:** Open the pre-staged Boss Battle and submit one rehearsed correct answer.

> A correct strategy deals real damage. The timer, health, and animation make independent reasoning the exciting part.

### 1:31–1:50 — Human–AI design

> The student controls the strategy, answer, hint timing, explanation, and retry. AI may coach the process or transform an uploaded note into practice, but it never owns mathematical truth. Correctness stays in a reviewed, server-validated question bank, and source-based questions show their evidence.

**Screen:** Hold on the Boss damage state or a Material Studio evidence card.

### 1:51–2:15 — Impact and feasibility

> We would pilot Brain Builder with middle- and high-school learners and measure no-hint completion, explanation quality, transfer, persistence, and confidence—not screen time. The prototype already separates learning, combat, grounded materials, and local progress. Next, we add educator review, secure accounts, school data controls, and accessibility testing before handling real student data.

**Screen:** Return to the upgraded Brain City.

### 2:16–2:30 — Close

> In an AI-first world, the winning skill is not getting answers faster. It is building a mind strong enough to know what to do with them. Help us make every student the hero of their own thinking.

## Live-demo runbook

### Before entering the room

1. Start the API with `npm run dev:api`.
2. Start the app with `npm run dev`.
3. Open `http://localhost:5173` in Chrome.
4. Set browser zoom to 100% and close unrelated tabs and notifications.
5. Rehearse the exact wrong answer, correct answer, and explanation.
6. Pre-stage the Boss Battle so one correct response produces a clear hit.
7. Keep the backup video open in a separate tab.

### Click path

1. **Academy** → scroll just enough to frame Brain City.
2. **Logic District** → **Train here** → featured quest.
3. Submit the rehearsed incorrect answer.
4. Use one coach hint, then submit the correct answer.
5. Enter: “I identified the relationship, applied the rule, and checked the result.”
6. Return to **Academy**, then open **Boss**.
7. Start the preselected battle and land one correct hit.
8. Stop clicking; explain the human–AI boundary over the damage state.

## Recovery lines

- If the API is unavailable: “The live service has paused, so I’ll switch to our recorded journey while explaining the same validated flow.”
- If a click is slow: “While this loads, notice that the interface rewards an attempt before assistance.”
- If the demo state is wrong: “The important behavior is this boundary: the learner attempts, coaching supports, and reviewed content verifies.”
- If time is called early: jump to the close immediately.

## Source

- [College Board research brief on high-school generative AI use](https://research.collegeboard.org/media/pdf/ai-research-brief-1_vf.pdf)
