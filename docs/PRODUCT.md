# Product specification

## Problem

Frequent answer generation can replace productive struggle with passive completion. For middle- and high-school learners in particular, that can weaken critical thinking, confidence, learner agency, and the habit of explaining why a solution works.

## Users

Primary users are K–12 students, especially middle- and high-school learners who regularly use AI tools. Secondary users include educators and guardians who need trustworthy content and meaningful indicators of independent learning.

## Product promise

Brain Builder makes cognitive growth visible. Every effortful learning activity upgrades a virtual district, and Boss Battles turn growing skills into exciting transfer challenges.

## Brain Builder learning loop

| Stage | Student action | System role |
| --- | --- | --- |
| Think | Form a strategy before choices appear | Create a deliberate pause |
| Attempt | Commit to an answer | Validate against reviewed content |
| Guidance | Retry after a process-only clue | Coach without revealing the answer |
| Reflect | Explain the strategy in original words | Require visible reasoning |
| Grow | Upgrade the selected city building | Reward effort, progress, and understanding |

## Brain City districts

| Cognitive skill | Virtual district |
| --- | --- |
| Memory and retention | Grand Library |
| Logic, math, and reasoning | Engineering Lab |
| Reading and comprehension | Knowledge Tower |
| Creativity and expression | Imagination Forge |
| Curiosity and investigation | Research Center |

## Glitch Boss loop

Boss Battles are separate, no-hint transfer challenges. Training Run, Challenger, and Mastery Siege change the learner band, timer, miss penalty, and bonus reward. Correct answers damage a 100-HP boss and sustained combos raise damage.

## Prototype scope

Included:

- Five persistent Brain City districts
- Think–attempt–guidance–reflection–growth quest flow
- Distinct challenges for memory, logic, reading, creativity, and curiosity
- Independent timed Boss Battle with HP, damage, combo, and time penalties
- Deterministic correctness from local reviewed content
- Local-first XP and city progression with API synchronization
- Adaptive recommendations for the lowest-level district
- Real activity-based streak, rank, Mindprint, and best Boss time
- 120 level-aware reviewed questions across five cognitive districts
- Learner-controlled progress export with no response text
- Original local artwork for all five districts
- Material Studio for source-grounded learning and assessment from TXT, Markdown, or PDF
- XP Manga Reward Catalog with persistent chapter-by-chapter unlocks and official-reader links
- Validated Express API with reviewed question checks and prototype persistence

Not yet included:

- Authentication, household/classroom accounts, educator dashboards, or production analytics
- Production AI integration
- Full reviewed content-management service
- OCR, image ingestion, malware scanning, and large-document processing
- Classroom privacy and compliance controls

## Success measures

- Percentage of quests completed without hints
- Quality improvement between initial and later explanations
- Transfer-check accuracy
- Voluntary retry rate after incorrect attempts
- Learner-reported confidence and agency

Raw time-on-task and total clicks should not be treated as learning outcomes.

## Privacy-first progress sharing

Progress is cached on-device and synchronized to a local prototype API. Export is explicit and learner controlled. It excludes answer selections and written reflections. Identity, authorization, consent, deletion, and retention controls are required before use with real student data.
