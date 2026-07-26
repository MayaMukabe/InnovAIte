export type MaterialQuestion = {
  id: string
  prompt: string
  choices: string[]
  correct: number
  source: string
}

export type MaterialStudySet = {
  id: string
  title: string
  sourceType: string
  createdAt: string
  cards: Array<{ id: string; idea: string }>
  questions: MaterialQuestion[]
}

const stopWords = new Set([
  'about', 'after', 'again', 'because', 'before', 'being', 'between', 'could',
  'every', 'first', 'from', 'have', 'into', 'more', 'other', 'should', 'their',
  'there', 'these', 'they', 'this', 'through', 'using', 'were', 'which', 'with',
])

function cleanText(text: string): string {
  return text.replace(/\0/g, '').replace(/\s+/g, ' ').trim().slice(0, 60_000)
}

function sentencesFrom(text: string): string[] {
  return cleanText(text)
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 30 && sentence.length <= 400)
    .slice(0, 12)
}

function keywordFrom(sentence: string): string {
  return sentence
    .match(/[A-Za-z][A-Za-z'-]{3,}/g)
    ?.filter((word) => !stopWords.has(word.toLowerCase()))
    .sort((left, right) => right.length - left.length)[0] ?? 'concept'
}

function escapeExpression(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function buildStudySet(title: string, sourceType: string, sourceText: string, id: string = crypto.randomUUID()): MaterialStudySet {
  const sentences = sentencesFrom(sourceText)
  if (sentences.length < 2) throw new Error('The material needs at least two complete, readable sentences.')

  const keywords = [...new Set(sentences.map(keywordFrom))]
  const questions = sentences.slice(0, Math.min(5, sentences.length)).map((sentence, index) => {
    const answer = keywordFrom(sentence)
    const distractors = keywords.filter((keyword) => keyword.toLowerCase() !== answer.toLowerCase()).slice(index, index + 3)
    const fallback = ['evidence', 'strategy', 'pattern', 'context'].filter((word) => word !== answer)
    const options = [answer, ...distractors, ...fallback].slice(0, 4)
    const shift = index % options.length
    const choices = [...options.slice(shift), ...options.slice(0, shift)]
    return {
      id: `material-${index}`,
      prompt: sentence.replace(new RegExp(`\\b${escapeExpression(answer)}\\b`, 'i'), '_____'),
      choices,
      correct: choices.indexOf(answer),
      source: sentence,
    }
  })

  return {
    id,
    title: title.slice(0, 100),
    sourceType,
    createdAt: new Date().toISOString(),
    cards: sentences.slice(0, 6).map((idea, index) => ({ id: `card-${index}`, idea })),
    questions,
  }
}

export function safeStudySet(studySet: MaterialStudySet) {
  return {
    ...studySet,
    questions: studySet.questions.map(({ correct: _correct, ...question }) => {
      void _correct
      return question
    }),
  }
}
