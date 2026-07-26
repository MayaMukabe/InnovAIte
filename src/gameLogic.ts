export function nextDistrictLevel(currentLevel: number): number {
  return Math.min(currentLevel + 1, 5)
}

export function questReward(attempts: number): number {
  return attempts <= 1 ? 50 : 35
}

export function bossDamage(combo: number): number {
  return combo >= 2 ? 25 : 20
}

export function bossReward(secondsRemaining: number): number {
  return 150 + Math.max(0, secondsRemaining)
}

export function canAfford(xp: number, cost: number): boolean {
  return xp >= cost
}

export function nextComicChapter(unlocked: number, totalChapters = 3): number {
  return Math.min(unlocked + 1, totalChapters)
}
