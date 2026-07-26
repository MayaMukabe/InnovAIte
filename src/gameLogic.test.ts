import { describe, expect, it } from 'vitest'
import { activityStreak, bossDamage, bossReward, canAfford, nextComicChapter, nextDistrictLevel, questReward, rankForXP } from './gameLogic'

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
    expect(nextComicChapter(270, 271)).toBe(271)
    expect(nextComicChapter(271, 271)).toBe(271)
  })
})

describe('real learner progression', () => {
  it('derives rank from current XP', () => {
    expect(rankForXP(681).name).toBe('Silver Hero')
    expect(rankForXP(1_600).name).toBe('Diamond Hero')
  })

  it('counts consecutive activity days ending today', () => {
    const today = new Date('2026-07-25T12:00:00Z')
    expect(activityStreak(['2026-07-23', '2026-07-24', '2026-07-25'], today)).toBe(3)
    expect(activityStreak(['2026-07-21'], today)).toBe(0)
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
