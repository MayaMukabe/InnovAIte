# Responsible AI standard

## Human authority

The learner forms a strategy, commits to an answer, decides how to use coaching, explains the reasoning, and solves Boss Battle problems without hints. The system must never silently complete these decisions.

## Model boundary

AI may generate constrained coaching hints and feedback on explanation clarity. It must not define mathematical correctness. Correct answers, equivalence rules, and flawed solution paths must come from a pre-reviewed question bank.

## Risks and controls

### Overreliance

- Choices remain hidden until the student confirms a thinking pause.
- Guidance follows an attempt, targets the process, and never reveals the final answer.
- Reflection makes the learner articulate a strategy.
- No-hint Boss Battles test application under a new constraint.
- City growth rewards persistence and explanation, not only first-try correctness.

### Accuracy

- Use deterministic validators for closed-form answers.
- Version and review every question and answer key.
- Ground uploaded-material practice in extractable source sentences and return source evidence.
- Label generated practice as study support, not an authoritative interpretation.
- Log content changes and permit educator reporting.

### Bias

- Explanation feedback must accept varied dialects, ages, and English proficiency.
- Evaluate prompts across diverse response styles before release.
- Do not infer intelligence, ability, disability, or intent from phrasing.
- Offer retry and educator-review paths for disputed feedback.

### Privacy

- Collect the minimum data needed for learning.
- Keep raw uploads in memory and enforce strict type and size limits.
- Never use the prototype JSON store for real student records.
- Do not use student responses to train models by default.
- Establish COPPA and FERPA controls before collecting identifiable student data.
- Publish retention, deletion, access, and incident-response procedures.

### Safety and accessibility

- Feedback remains specific, encouraging, and never mocking.
- Avoid shame-based streaks, rankings, or penalties.
- Meet WCAG 2.2 AA, including keyboard, contrast, zoom, reduced motion, and screen-reader support.
- Let learners adjust pacing and language complexity.

## Release gate

No AI coaching feature may ship to students without documented content review, age-appropriate safety testing, bias evaluation, privacy review, failure-mode testing, and a clearly owned rollback process.
