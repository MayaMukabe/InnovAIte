import express from 'express'
import multer from 'multer'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PDFParse } from 'pdf-parse'
import { z } from 'zod'
import { buildStudySet, safeStudySet, type MaterialStudySet } from './materials.js'
import { districtQuestions } from './questions.js'
import { readDatabase, updateDatabase } from './store.js'

const app = express()
const port = Number(process.env.PORT) || 8787
const profileSchema = z.object({
  xp: z.number().int().min(0).max(1_000_000),
  city: z.object({
    memory: z.number().int().min(1).max(5),
    logic: z.number().int().min(1).max(5),
    reading: z.number().int().min(1).max(5),
    creativity: z.number().int().min(1).max(5),
    curiosity: z.number().int().min(1).max(5),
  }),
  stats: z.object({
    questsCompleted: z.number().int().min(0),
    firstTryWins: z.number().int().min(0),
    reflectionsWritten: z.number().int().min(0),
    bossWins: z.number().int().min(0),
    bestBossTime: z.number().int().min(0),
    activityDates: z.array(z.iso.date()).max(60),
  }),
  comics: z.object({
    gearbound: z.number().int().min(0).max(3),
    skyLibrary: z.number().int().min(0).max(3),
    starScouts: z.number().int().min(0).max(3),
  }),
})

app.disable('x-powered-by')
app.use(express.json({ limit: '100kb' }))

const materialUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_request, file, callback) => {
    const accepted = new Set(['text/plain', 'text/markdown', 'application/pdf'])
    if (accepted.has(file.mimetype)) callback(null, true)
    else callback(new Error('Use a TXT, Markdown, or PDF file.'))
  },
})

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

app.post('/api/materials', materialUpload.single('material'), async (request, response, next) => {
  let parser: PDFParse | null = null
  try {
    if (!request.file) return response.status(400).json({ error: 'Choose a material to upload.' })
    let text = request.file.buffer.toString('utf8')
    if (request.file.mimetype === 'application/pdf') {
      parser = new PDFParse({ data: request.file.buffer })
      text = (await parser.getText()).text
    }
    const studySet = buildStudySet(request.file.originalname.replace(/\.[^.]+$/, ''), request.file.mimetype, text)
    await updateDatabase((database) => { database.studySets[studySet.id] = studySet })
    response.status(201).json(safeStudySet(studySet))
  } catch (error) {
    if (error instanceof Error && error.message.includes('complete, readable')) {
      return response.status(422).json({ error: error.message })
    }
    next(error)
  } finally {
    await parser?.destroy()
  }
})

app.get('/api/materials', async (_request, response, next) => {
  try {
    const database = await readDatabase()
    response.json(Object.values(database.studySets).map((studySet) => safeStudySet(studySet as MaterialStudySet)))
  } catch (error) {
    next(error)
  }
})

app.post('/api/materials/:id/check', async (request, response, next) => {
  try {
    const parsed = z.object({ questionId: z.string(), answer: z.number().int().min(0).max(3) }).parse(request.body)
    const database = await readDatabase()
    const studySet = database.studySets[request.params.id] as MaterialStudySet | undefined
    const question = studySet?.questions.find((item) => item.id === parsed.questionId)
    if (!question) return response.status(404).json({ error: 'Study question not found.' })
    response.json({ correct: parsed.answer === question.correct, source: question.source })
  } catch (error) {
    next(error)
  }
})

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const productionDirectory = path.resolve(currentDirectory, '../dist')
app.use(express.static(productionDirectory))
app.get('*splat', (_request, response) => response.sendFile(path.join(productionDirectory, 'index.html')))

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  void _next
  if (error instanceof z.ZodError) return response.status(400).json({ error: 'Invalid request.', details: error.issues })
  if (error instanceof multer.MulterError) return response.status(400).json({ error: error.code === 'LIMIT_FILE_SIZE' ? 'Files must be 5 MB or smaller.' : error.message })
  if (error instanceof Error && error.message.startsWith('Use a')) return response.status(400).json({ error: error.message })
  console.error(error)
  response.status(500).json({ error: 'Something went wrong.' })
})

app.listen(port, () => {
  console.log(`Brain Builder API listening on http://localhost:${port}`)
})
