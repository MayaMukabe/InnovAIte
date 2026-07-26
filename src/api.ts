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
