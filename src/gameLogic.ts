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
