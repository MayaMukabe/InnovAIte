export type ProfilePayload = {
  xp: number
  city: Record<string, number>
  stats: Record<string, number>
  comics: Record<string, number>
}

export async function loadProfile(id = 'demo'): Promise<(ProfilePayload & { id: string }) | null> {
  const response = await fetch(`/api/profile/${id}`)
  if (!response.ok) throw new Error('Profile service unavailable.')
  return response.json() as Promise<(ProfilePayload & { id: string }) | null>
}

export async function saveProfile(profile: ProfilePayload, id = 'demo'): Promise<void> {
  const response = await fetch(`/api/profile/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  })
  if (!response.ok) throw new Error('Profile could not be synced.')
}

export type DistrictQuestion = {
  id: string
  prompt: string
  answers: string[]
  think: string
}

export async function loadDistrictQuestions(district: string): Promise<DistrictQuestion[]> {
  const response = await fetch(`/api/questions/district/${district}`)
  if (!response.ok) throw new Error('Question service unavailable.')
  return response.json() as Promise<DistrictQuestion[]>
}

export async function checkDistrictAnswer(district: string, questionId: string, answer: number): Promise<{ correct: boolean; guidance: string | null }> {
  const response = await fetch(`/api/questions/district/${district}/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionId, answer }),
  })
  if (!response.ok) throw new Error('Answer check unavailable.')
  return response.json() as Promise<{ correct: boolean; guidance: string | null }>
}
