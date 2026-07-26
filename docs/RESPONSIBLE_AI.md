# Responsible AI standard

## Human authority

The learner decides which step is wrong, how to repair it, why it was wrong, how to solve the transfer problem, and when to request a hint. The system must never silently complete these decisions.

## Model boundary

AI may generate constrained coaching hints and feedback on explanation clarity. It must not define mathematical correctness. Correct answers, equivalence rules, and flawed solution paths must come from a pre-reviewed question bank.

## Risks and controls

### Overreliance

- Hints are optional, progressive, and visibly costly.
- Hints reveal strategy before procedure and never reveal the final answer.
- A no-hint transfer round confirms that the learner can apply the strategy.

### Accuracy

- Use deterministic validators for closed-form answers.
- Version and review every question and answer key.
- Log content changes and permit educator reporting.

### Bias

- Explanation feedback must accept varied dialects, ages, and English proficiency.
- Evaluate prompts across diverse response styles before release.
- Do not infer intelligence, ability, disability, or intent from phrasing.
- Offer retry and educator-review paths for disputed feedback.

### Privacy

- Collect the minimum data needed for learning.
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
