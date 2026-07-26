import { describe, expect, it } from 'vitest'
import { learnerBands, questionBank, questionsFor } from './questions.js'

describe('reviewed question bank', () => {
  it('contains at least 100 distinct questions', () => {
    expect(questionBank.length).toBeGreaterThanOrEqual(100)
    expect(new Set(questionBank.map((question) => question.id)).size).toBe(questionBank.length)
  })

  it('covers every learner band and district evenly', () => {
    for (const band of learnerBands) {
      for (const district of ['memory', 'logic', 'reading', 'creativity', 'curiosity'] as const) {
        expect(questionsFor(district, band)).toHaveLength(8)
      }
    }
  })

  it('keeps every answer key valid', () => {
    for (const question of questionBank) {
      expect(question.answers).toHaveLength(4)
      expect(question.correct).toBeGreaterThanOrEqual(0)
      expect(question.correct).toBeLessThan(4)
    }
  })
})
