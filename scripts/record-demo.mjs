import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const baseURL = process.env.DEMO_URL ?? 'http://127.0.0.1:5173'
const outputDirectory = resolve('demo')
const videoPath = resolve(outputDirectory, 'brain-builder-demo.webm')
const screenshotPath = resolve(outputDirectory, 'brain-builder-backup.png')
const pause = (milliseconds) => new Promise((done) => setTimeout(done, milliseconds))

await mkdir(outputDirectory, { recursive: true })

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  baseURL,
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: outputDirectory, size: { width: 1280, height: 800 } },
})
const page = await context.newPage()
const video = page.video()

async function showStep(label) {
  await page.evaluate((text) => {
    document.querySelector('[data-demo-caption]')?.remove()
    const caption = document.createElement('div')
    caption.dataset.demoCaption = 'true'
    caption.textContent = text
    Object.assign(caption.style, {
      position: 'fixed',
      zIndex: '99999',
      top: '92px',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '12px 22px',
      border: '3px solid #06395b',
      borderRadius: '999px',
      background: '#fff',
      boxShadow: '0 6px 0 #06395b33',
      color: '#06395b',
      font: '800 16px system-ui',
      letterSpacing: '.04em',
    })
    document.body.append(caption)
  }, label)
}

async function identifyAnswer(district, band, prompt) {
  const bankResponse = await page.request.get(`/api/questions/district/${district}?band=${band}`)
  if (!bankResponse.ok()) throw new Error(`Could not load ${district} question bank.`)
  const bank = await bankResponse.json()
  const question = bank.find((item) => item.prompt.trim() === prompt.trim())
  if (!question) throw new Error(`Could not match recorded question: ${prompt}`)

  for (let answer = 0; answer < question.answers.length; answer += 1) {
    const check = await page.request.post(`/api/questions/district/${district}/check`, {
      data: { questionId: question.id, answer },
    })
    if ((await check.json()).correct) return answer
  }
  throw new Error(`No reviewed answer found for ${question.id}.`)
}

try {
  await page.goto('/', { waitUntil: 'networkidle' })
  await showStep('Your learning becomes a city you can grow')
  await page.locator('.brain-city').scrollIntoViewIfNeeded()
  await page.mouse.move(720, 450, { steps: 18 })
  await pause(3000)

  await showStep('Think → Attempt → Guidance → Reflect → Grow')
  await page.locator('.city-building').nth(1).click()
  await page.getByRole('button', { name: 'I HAVE A STRATEGY' }).click()
  await pause(1000)

  const questPrompt = await page.locator('.learning-card h2').innerText()
  const correctQuestAnswer = await identifyAnswer('logic', 'middle', questPrompt)
  const questAnswers = page.locator('.answer-grid button')
  const incorrectQuestAnswer = (correctQuestAnswer + 1) % await questAnswers.count()

  await showStep('An attempt comes before coaching')
  await questAnswers.nth(incorrectQuestAnswer).click()
  await page.getByRole('button', { name: /CHECK MY THINKING/ }).click()
  await page.getByText(/Good attempt/).waitFor()
  await pause(2200)

  await showStep('The coach supports the process—not the answer')
  await questAnswers.nth(correctQuestAnswer).click()
  await page.getByRole('button', { name: /CHECK MY THINKING/ }).click()
  await page.getByPlaceholder('I noticed... so I decided...').fill(
    'I modeled the relationship, applied the rule, and checked that the result matched the question.',
  )
  await page.getByRole('button', { name: /BUILD MY DISTRICT/ }).click()
  await page.getByText('Your effort built something real.').waitFor()
  await pause(3000)

  await showStep('Independent reasoning powers the Boss Battle')
  await page.getByRole('button', { name: 'Boss', exact: true }).click()
  await page.getByRole('button', { name: /Training Run/ }).click()
  await page.getByRole('button', { name: /START TRAINING RUN/ }).click()

  for (let attack = 0; attack < 5; attack += 1) {
    const prompt = await page.locator('.attack-console h1').innerText()
    const correctAnswer = await identifyAnswer('logic', 'middle', prompt)
    await page.locator('.attack-answers button').nth(correctAnswer).click()
    await page.getByRole('button', { name: /LAUNCH ATTACK/ }).click()
    if (attack < 4) {
      await page.getByText(/Direct hit/).waitFor()
      await pause(1100)
    }
  }

  await page.getByText('SYSTEM RESTORED!').waitFor({ timeout: 10_000 })
  await showStep('Victory rewards mastery—not answer shortcuts')
  await pause(4500)
  await page.screenshot({ path: screenshotPath, fullPage: false })
} finally {
  await page.close()
  await video?.saveAs(videoPath)
  await context.close()
  await browser.close()
}

console.log(`Recorded ${videoPath}`)
console.log(`Captured ${screenshotPath}`)
