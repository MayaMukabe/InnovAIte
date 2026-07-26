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

export function rankForXP(xp: number): { name: string; mark: string; next: number } {
  if (xp >= 2_500) return { name: 'Mind City Legend', mark: 'Ⅴ', next: xp + 1_000 }
  if (xp >= 1_500) return { name: 'Diamond Hero', mark: 'Ⅳ', next: 2_500 }
  if (xp >= 800) return { name: 'Gold Hero', mark: 'Ⅲ', next: 1_500 }
  if (xp >= 400) return { name: 'Silver Hero', mark: 'Ⅱ', next: 800 }
  return { name: 'Bronze Hero', mark: 'Ⅰ', next: 400 }
}

export function activityStreak(activityDates: string[], today = new Date()): number {
  const dates = new Set(activityDates)
  const cursor = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
  let streak = 0
  while (dates.has(cursor.toISOString().slice(0, 10))) {
    streak += 1
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }
  return streak
}
