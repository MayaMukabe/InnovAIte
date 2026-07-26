import { describe, expect, it } from 'vitest'
import { bossDamage, bossReward, canAfford, nextComicChapter, nextDistrictLevel, questReward } from './gameLogic'

describe('Brain City progression', () => {
  it('upgrades a district by one level', () => {
    expect(nextDistrictLevel(2)).toBe(3)
  })

  it('caps district buildings at level five', () => {
    expect(nextDistrictLevel(5)).toBe(5)
  })

  it('rewards a first-try solution without removing retry rewards', () => {
    expect(questReward(1)).toBe(50)
    expect(questReward(3)).toBe(35)
  })
})

describe('XP comic economy', () => {
  it('unlocks only when the learner has enough XP', () => {
    expect(canAfford(220, 220)).toBe(true)
    expect(canAfford(219, 220)).toBe(false)
  })

  it('never unlocks beyond the final chapter', () => {
    expect(nextComicChapter(2)).toBe(3)
    expect(nextComicChapter(3)).toBe(3)
  })
})

describe('Glitch Boss combat', () => {
  it('deals standard damage before a combo is charged', () => {
    expect(bossDamage(0)).toBe(20)
    expect(bossDamage(1)).toBe(20)
  })

  it('deals bonus damage after two consecutive previous hits', () => {
    expect(bossDamage(2)).toBe(25)
  })

  it('adds remaining time to the base victory reward', () => {
    expect(bossReward(42)).toBe(192)
  })
})
