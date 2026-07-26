import { describe, expect, it } from 'vitest'
import { buildStudySet, safeStudySet } from './materials.js'

const notes = [
  'Photosynthesis converts light energy into chemical energy stored inside glucose molecules.',
  'Plants take in carbon dioxide and water while releasing oxygen during this important process.',
  'Chlorophyll is the green pigment that captures light energy inside structures called chloroplasts.',
].join(' ')

describe('uploaded material grounding', () => {
  it('builds learn cards and assessment questions from source sentences', () => {
    const set = buildStudySet('Plant Notes', 'text/plain', notes, 'test-set')
    expect(set.cards).toHaveLength(3)
    expect(set.questions[0].source).toContain('Photosynthesis')
    expect(set.questions[0].prompt).toContain('_____')
  })

  it('does not expose correct indexes in the client response', () => {
    const safe = safeStudySet(buildStudySet('Plant Notes', 'text/plain', notes, 'test-set'))
    expect(safe.questions[0]).not.toHaveProperty('correct')
  })

  it('rejects material without enough complete ideas', () => {
    expect(() => buildStudySet('Tiny', 'text/plain', 'One short note.')).toThrow()
  })
})
