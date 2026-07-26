import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

export type StoredProfile = {
  id: string
  xp: number
  city: Record<string, number>
  stats: Record<string, number>
  comics: Record<string, number>
  updatedAt: string
}

type Database = {
  profiles: Record<string, StoredProfile>
  studySets: Record<string, unknown>
}

const dataDirectory = path.resolve('server/data')
const dataFile = path.join(dataDirectory, 'store.json')
let writeQueue = Promise.resolve()

const emptyDatabase = (): Database => ({ profiles: {}, studySets: {} })

export async function readDatabase(): Promise<Database> {
  try {
    return JSON.parse(await readFile(dataFile, 'utf8')) as Database
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return emptyDatabase()
    throw error
  }
}

export async function updateDatabase(change: (database: Database) => void): Promise<Database> {
  let result = emptyDatabase()
  writeQueue = writeQueue.then(async () => {
    result = await readDatabase()
    change(result)
    await mkdir(dataDirectory, { recursive: true })
    await writeFile(dataFile, JSON.stringify(result, null, 2), 'utf8')
  })
  await writeQueue
  return result
}
