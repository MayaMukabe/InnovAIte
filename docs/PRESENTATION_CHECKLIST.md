# Hackathon presentation checklist

## Step 1 — Assign the story

- [ ] Replace the demo persona or keep “Maya” consistently.
- [ ] Add the project title, every team member’s name, and each person’s role.
- [ ] Choose one speaker and one teammate to operate the prototype.
- [ ] Make sure every teammate can explain the problem and human–AI boundary without notes.

## Step 2 — Practice the 2:30 pitch

- [ ] Practice from [`docs/DEMO.md`](./DEMO.md) with a visible timer.
- [ ] Complete three runs under 2:30 without rushing the final sentence.
- [ ] Rehearse the exact incorrect answer, correct answer, reflection, and Boss answer.
- [ ] Practice switching to the backup video in under five seconds.
- [ ] Record one rehearsal and remove filler words or repeated explanations.

## Step 3 — Prepare the presentation device

- [ ] Run `npm install` before arriving.
- [ ] Confirm `npm run dev` opens the prototype at the URL Vite prints.
- [ ] Use Chrome at 100% zoom in full-screen or presentation mode.
- [ ] Turn off notifications, sleep, automatic updates, and unrelated browser extensions.
- [ ] Connect power and bring the correct display adapter.
- [ ] Test once with venue Wi-Fi and once with Wi-Fi disabled.

## Step 4 — Prepare backups

- [ ] Keep [`demo/brain-builder-demo.webm`](../demo/brain-builder-demo.webm) open in a second tab.
- [ ] Keep [`demo/brain-builder-backup.png`](../demo/brain-builder-backup.png) in the slide deck.
- [ ] Store the deck, video, screenshot, and repository URL on the device and one USB drive.
- [ ] Export the final deck to PDF.
- [ ] Confirm every submitted link opens in an incognito window.

## Step 5 — Make responsible-AI disclosure explicit

Use this wording:

> AI tools supported brainstorming, implementation, visual iteration, testing, and documentation. Our team owns the problem framing, product boundaries, interaction design, review decisions, and presentation. Inside the prototype, AI is limited to coaching and grounded transformation; reviewed content owns correctness.

- [ ] Name the AI tools the team actually used.
- [ ] Cite the College Board research brief.
- [ ] Do not imply that production generative coaching, secure school accounts, or compliance controls are complete.
- [ ] Explain that prototype uploads are processed in memory and real student data should not be used.
- [ ] Explain how future writing feedback will be tested across ages, dialects, and English fluency.
- [ ] Explain why students—not AI—control attempts, hints, explanations, and retries.

## Step 6 — Answer likely judge questions

**How is this different from another quiz app?**  
It rewards the learning process—attempts, revision, explanation, and transfer—and turns that evidence into a persistent city rather than rewarding answer speed alone.

**Why use AI at all?**  
AI can adapt process coaching and transform a learner’s approved material into grounded practice. The product deliberately prevents it from replacing the student’s decisions or owning correctness.

**How do you know it works?**  
The prototype proves the interaction model. A pilot would compare no-hint completion, explanation quality, delayed transfer, persistence, and learner confidence before and after use.

**What prevents hallucinated answers?**  
Reviewed questions and server-side validation own correctness. Generated support is constrained to coaching around known answers, and material-based practice exposes source evidence.

**Is it ready for children’s data?**  
No. The hackathon prototype demonstrates the product and technical boundaries. Secure authentication, managed storage, consent and deletion workflows, educator controls, security review, and COPPA/FERPA implementation are release requirements.

**What is the business path?**  
Begin with a small educator-led pilot, validate learning outcomes and retention, then offer schools a reviewed-content platform with educator dashboards and guardian controls. Entertainment rewards require licensed partnerships before commercial release.

## Step 7 — Final five-minute check

- [ ] Prototype opens and the API sync indicator is healthy.
- [ ] Demo state, learner level, quest, and Boss difficulty are correct.
- [ ] Backup video plays from beginning to end.
- [ ] Team and project names are correct.
- [ ] Sharing permissions work.
- [ ] Water is nearby; phones are silent.
- [ ] Start with the learner, not the technology.
- [ ] End on the memorized closing sentence.
