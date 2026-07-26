export const learnerBands = ['middle', 'high', 'proficient'] as const
export type LearnerBand = typeof learnerBands[number]
export type District = 'memory' | 'logic' | 'reading' | 'creativity' | 'curiosity'

export type ReviewedQuestion = {
  id: string
  band: LearnerBand
  district: District
  prompt: string
  answers: string[]
  correct: number
  think: string
}

const words = ['Comet', 'Lantern', 'Forest', 'Shell', 'Compass', 'River', 'Quartz', 'Harbor']
const names = ['Maya', 'Leo', 'Amara', 'Noah', 'Sofia', 'Kai', 'Zuri', 'Eli']

function answerSet(correct: string, alternatives: string[], offset: number) {
  const options = [...alternatives.slice(0, 3)]
  options.splice(offset % 4, 0, correct)
  return { answers: options, correct: offset % 4 }
}

function makeQuestion(
  band: LearnerBand,
  district: District,
  index: number,
  prompt: string,
  answer: string,
  alternatives: string[],
  think: string,
): ReviewedQuestion {
  return {
    id: `${band}-${district}-${index + 1}`,
    band,
    district,
    prompt,
    ...answerSet(answer, alternatives, index),
    think,
  }
}

function buildBand(band: LearnerBand): ReviewedQuestion[] {
  return Array.from({ length: 8 }, (_, index) => {
    const a = index + (band === 'middle' ? 3 : band === 'high' ? 7 : 11)
    const b = index + 2
    const person = names[index]
    const item = words[index]

    if (band === 'middle') return [
      makeQuestion(band, 'memory', index, `Remember: ${item}, ${words[(index + 1) % 8]}, ${words[(index + 2) % 8]}, ${words[(index + 3) % 8]}. Which came third?`, words[(index + 2) % 8], [item, words[(index + 1) % 8], words[(index + 3) % 8]], 'Turn the sequence into a quick picture-story.'),
      makeQuestion(band, 'logic', index, `A workshop packs ${a} kits with ${b} gears in each. How many gears are packed?`, String(a * b), [String(a + b), String(a * b - b), String(a * b + a)], 'Model the situation as equal groups.'),
      makeQuestion(band, 'reading', index, `${person} brought a water bottle and wore a hat before walking onto the sunny field. What is the strongest inference?`, `${person} expects to be outside in warm weather`, [`${person} is going to sleep`, `${person} dislikes the field`, 'It will snow soon'], 'Combine details that point to the same likely explanation.'),
      makeQuestion(band, 'creativity', index, `Which revision makes “The ${item.toLowerCase()} moved” most vivid?`, `The ${item.toLowerCase()} swept past in a bright, rushing blur`, [`The ${item.toLowerCase()} was there`, `It moved`, `The ${item.toLowerCase()} did something`], 'Choose precise verbs and sensory details.'),
      makeQuestion(band, 'curiosity', index, `Which question is most testable for a class investigation ${index + 1}?`, `How does changing light time affect plant height over two weeks?`, ['Are plants beautiful?', 'Which plant is the best?', 'Why is nature interesting?'], 'A testable question names variables that can be measured.'),
    ]

    if (band === 'high') return [
      makeQuestion(band, 'memory', index, `Use the link “${item} → ${a}.” After recalling the links ${words[(index + 1) % 8]} → ${a + 2} and ${words[(index + 2) % 8]} → ${a + 4}, what number is paired with ${item}?`, String(a), [String(a + 2), String(a + 4), String(a - 1)], 'Retrieve the association rather than the order.'),
      makeQuestion(band, 'logic', index, `Solve ${a}x + ${b} = ${a * 4 + b}.`, 'x = 4', ['x = 2', `x = ${a}`, `x = ${b}`], 'Undo addition first, then divide by the coefficient.'),
      makeQuestion(band, 'reading', index, `A school added quiet study rooms. Visits rose, but survey responses stayed mixed. Which claim is best supported?`, 'The rooms increased library use, though opinions varied', ['Every student preferred the rooms', 'The rooms caused grades to rise', 'The survey proves the rooms failed'], 'Separate measured outcomes from opinions and unstated effects.'),
      makeQuestion(band, 'creativity', index, `A team must redesign a backpack for commuters. Which idea best combines two constraints?`, `A reflective, waterproof panel that folds into a rain cover`, ['A heavier decorative chain', 'A single-color zipper', 'A larger brand label'], 'Strong design choices satisfy more than one real need.'),
      makeQuestion(band, 'curiosity', index, `Which change would most improve experiment ${index + 1} comparing two study methods?`, 'Keep study time and test difficulty the same for both groups', ['Let each group take a different test', 'Remove all measurements', 'Choose the conclusion before collecting data'], 'Control other variables so the method is the main difference.'),
    ]

    return [
      makeQuestion(band, 'memory', index, `You must retain the concept “${item} regulates system ${a}” for a month. Which strategy is most durable?`, 'Space retrieval practice and explain the relationship from memory', ['Reread it five times in one sitting', 'Highlight every word', 'Copy it once without testing recall'], 'Durable memory grows through spaced retrieval and elaboration.'),
      makeQuestion(band, 'logic', index, `A process succeeds with probability 0.${a} on one independent trial. Which expression gives two consecutive successes?`, `0.${a} × 0.${a}`, [`0.${a} + 0.${a}`, `1 − 0.${a}`, `0.${a} ÷ 2`], 'For independent events joined by “and,” multiply probabilities.'),
      makeQuestion(band, 'reading', index, `An author cites one dramatic example, then claims it proves a universal rule. What is the central reasoning weakness?`, 'A single anecdote cannot establish a universal conclusion', ['The example contains too many statistics', 'Universal claims never need evidence', 'The author used a complete dataset'], 'Compare the breadth of the evidence with the breadth of the claim.'),
      makeQuestion(band, 'creativity', index, `Which concept best responds to the constraint “teach system ${a} without screens or spoken instructions”?`, 'A tactile model whose pieces only connect in the correct sequence', ['A narrated video tutorial', 'A paragraph on a monitor', 'A lecture with slides'], 'Innovate inside every constraint, not around one of them.'),
      makeQuestion(band, 'curiosity', index, `A result in trial ${index + 1} contradicts the hypothesis. What is the strongest next step?`, 'Replicate the trial, inspect assumptions, and report the result', ['Delete the result', 'Change the measurements afterward', 'Treat the hypothesis as proven'], 'Unexpected evidence should trigger verification, not concealment.'),
    ]
  }).flat()
}

export const questionBank = learnerBands.flatMap(buildBand)

export function questionsFor(district: District, band: LearnerBand) {
  return questionBank.filter((question) => question.district === district && question.band === band)
}

export function questionById(id: string) {
  return questionBank.find((question) => question.id === id)
}
