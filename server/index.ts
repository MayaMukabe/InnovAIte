import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'
import { districtQuestions } from './questions.js'
import { readDatabase, updateDatabase } from './store.js'

const app = express()
const port = Number(process.env.PORT) || 8787
const profileSchema = z.object({
  xp: z.number().int().min(0).max(1_000_000),
  city: z.record(z.string(), z.number().int().min(1).max(5)),
  stats: z.record(z.string(), z.number().int().min(0)),
  comics: z.record(z.string(), z.number().int().min(0).max(3)),
})

app.disable('x-powered-by')
app.use(express.json({ limit: '100kb' }))

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, service: 'brain-builder-api', version: 1 })
})

app.get('/api/profile/:id', async (request, response, next) => {
  try {
    const database = await readDatabase()
    response.json(database.profiles[request.params.id] ?? null)
  } catch (error) {
    next(error)
  }
})

app.put('/api/profile/:id', async (request, response, next) => {
  try {
    const parsed = profileSchema.parse(request.body)
    const profile = { id: request.params.id, ...parsed, updatedAt: new Date().toISOString() }
    await updateDatabase((database) => { database.profiles[profile.id] = profile })
    response.json(profile)
  } catch (error) {
    next(error)
  }
})

app.get('/api/questions/district/:district', (request, response) => {
  const district = request.params.district as keyof typeof districtQuestions
  const questions = districtQuestions[district]
  if (!questions) return response.status(404).json({ error: 'Unknown district.' })
  response.json(questions.map((question, index) => ({
    id: `${district}-${index}`,
    prompt: question.prompt,
    answers: question.answers,
    think: question.think,
  })))
})

app.post('/api/questions/district/:district/check', (request, response) => {
  const district = request.params.district as keyof typeof districtQuestions
  const parsed = z.object({ questionId: z.string(), answer: z.number().int() }).parse(request.body)
  const index = Number(parsed.questionId.split('-').at(-1))
  const question = districtQuestions[district]?.[index]
  if (!question) return response.status(404).json({ error: 'Question not found.' })
  response.json({ correct: parsed.answer === question.correct, guidance: parsed.answer === question.correct ? null : question.think })
})

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const productionDirectory = path.resolve(currentDirectory, '../dist')
app.use(express.static(productionDirectory))
app.get('*splat', (_request, response) => response.sendFile(path.join(productionDirectory, 'index.html')))

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  void _next
  if (error instanceof z.ZodError) return response.status(400).json({ error: 'Invalid request.', details: error.issues })
  console.error(error)
  response.status(500).json({ error: 'Something went wrong.' })
})

app.listen(port, () => {
  console.log(`Brain Builder API listening on http://localhost:${port}`)
})
