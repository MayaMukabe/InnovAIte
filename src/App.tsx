import { useEffect, useState } from 'react'
import {
  BookOpen, Brain, Check, CircleDot, ClipboardList, Cog, Download,
  Grid3X3, LibraryBig, Lightbulb, Palette, Search, ShieldCheck,
  Sparkles, Swords, Target, Telescope, Upload, UserRound, Zap,
  type LucideIcon,
} from 'lucide-react'
import { activityStreak, bossDamage, bossReward, canAfford, nextComicChapter, nextDistrictLevel, questReward, rankForXP } from './gameLogic'
import MaterialStudio from './MaterialStudio'
import { checkDistrictAnswer, loadDistrictQuestions, loadProfile, saveProfile } from './api'

type Screen = 'academy' | 'quests' | 'boss' | 'library'
type DistrictId = 'memory' | 'logic' | 'reading' | 'creativity' | 'curiosity'
type CityProgress = Record<DistrictId, number>
type LearningStats = {
  questsCompleted: number
  firstTryWins: number
  reflectionsWritten: number
  bossWins: number
  bestBossTime: number
  activityDates: string[]
}
type ComicId = 'gearbound' | 'skyLibrary' | 'starScouts'
type ComicProgress = Record<ComicId, number>
type LearnerBand = 'middle' | 'high' | 'proficient'

const learnerBandLabels: Record<LearnerBand, string> = {
  middle: 'Middle School',
  high: 'High School',
  proficient: 'Proficient',
}

const districts: Array<{ id: DistrictId; icon: string; name: string; building: string; skill: string; color: string; image: string }> = [
  { id: 'memory', icon: 'memory', name: 'Memory District', building: 'Grand Library', skill: 'Recall & retention', color: 'green', image: '/images/districts/grand-library.webp' },
  { id: 'logic', icon: 'logic', name: 'Logic District', building: 'Engineering Lab', skill: 'Reasoning & math', color: 'blue', image: '/images/districts/engineering-lab.webp' },
  { id: 'reading', icon: 'reading', name: 'Reading District', building: 'Knowledge Tower', skill: 'Comprehension', color: 'yellow', image: '/images/districts/knowledge-tower.webp' },
  { id: 'creativity', icon: 'creativity', name: 'Creativity District', building: 'Art Studio', skill: 'Ideas & expression', color: 'coral', image: '/images/districts/art-studio.webp' },
  { id: 'curiosity', icon: 'curiosity', name: 'Curiosity District', building: 'Research Center', skill: 'Questions & discovery', color: 'purple', image: '/images/districts/research-center.webp' },
]

const comicBooks: Array<{ id: ComicId; title: string; subtitle: string; theme: string; mark: string; costs: number[]; chapters: string[] }> = [
  { id: 'gearbound', title: 'Gearbound', subtitle: 'Inventors of the Open Sky', theme: 'cobalt', mark: 'G', costs: [120, 220, 340], chapters: ['The impossible engine wakes above Logic City.', 'A broken compass forces the crew to reason from clues.', 'The inventors combine their designs to cross the storm wall.'] },
  { id: 'skyLibrary', title: 'The Sky Library', subtitle: 'Pages Beyond the Clouds', theme: 'sunrise', mark: 'S', costs: [140, 240, 360], chapters: ['A living book chooses Maya for a hidden reading quest.', 'Missing pages rearrange the tower—and every detail matters.', 'Maya must explain the final riddle to open the sunrise archive.'] },
  { id: 'starScouts', title: 'Star Scouts', subtitle: 'The Curiosity Signal', theme: 'violet', mark: '★', costs: [160, 260, 380], chapters: ['Three research scouts detect a flower-shaped signal in space.', 'Their first hypothesis fails, revealing a better question.', 'The team follows the evidence to a moon that grows starlight.'] },
]

const art = {
  mentor:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDOd_ko4QUhzikkX__kaGnWL29-rsV83IFNBHEDeRzk7yMEXV3zKYwSs1HizWBbl8g5_evOMnVVzznWikS_7_l-509mO9ElxYEl8HuIw0PQ3pdD1A3k7a2yoD0oEmbKwq_rlJviDZtGkCjkTm6MyAyBQ4IZZZY6T_a0ZwPV0lS7dwx_m4be6bzG2TNISU8cHBMy7jsK39NP1tE5IcTiw94DlFjcsSafIy4M4mCrdlI9jzQDnl7l4ofXW944nlhwJB_zDtyS_q1VK5A',
  avatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCwG-RIeyi8QoXefukniUwbU286D4prv_8bKSHDC98ta9_UDZd0DvFS32_eUUEroWRwEAgXxzPN6JtFpQ75-Egf_xUWQQH0jWozxI0VgS6eNDASG1zPIQXQbRVwWZXlSZ1ohruTuTi-EBa3A8eLlcNWN4MWg1v5_N-HOKhEb5xmA7GIz9KQkHh1RP2QgQer72AKTW55ubTowFg-ECHfMc4K4g0bn9p3U5xTDX9Roj4auIIe4tKLKWuTBTrvdV6MfQ4JP8_AOiI_Hi0',
  glitch:
    '/images/characters/glitch-boss.webp',
  geometry:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB7JpmuiTVFeYYGSdjKReCeqd7R6m7Uim6tI7X3mdgvWN0FhNzu4KRfF9qTbOZxoWGbMmrfWR71LYPmFxp4iiFZIMetko0t5ePYATdcpsGMttSEHWwSB9CwCu9npi6W9CkWqu_8HStxu_ieHBzw8B0Hf_xFXmdbpaoei5EPa41eplh5nPeD7VKsZVy1i80QBTK5NV7vIcZQzYdkhJ0CDwK4fcbqcBD90cMZEozthwt05Na0PcnWXdV4b5zMu2KSKdZSWWDCHNlvhRE',
  stories:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBmJy8a7bFkmDjQ9x9sb38LWo23iwEIipU--80-vybTTVK3VE-rVNRUwcfV0l6Z-4oAHpLsUeuH6SmddUn9xqAjM1E6YgmWligRIsm3ZLaoSN-0E18kzcBivQJtfDNRG_u8j2qR1Zkd38yvFNv3T23dEplORsqQqHGbwGLnLNtgntY6cyGBd5PdivyN625kZS1OA6wbPJOtBWaginus3HRdr449pfgCKzhEywbjLotz2t0T5eP7vDLkPYr0gvNJZaBmasl5QWHoNRs',
  chemistry:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAinB7GYzeT3_Z7oD8zRD6MlrK98IMDdsLh6CzM7XeAHa54pollD1bIzJsxNu8atY6u5fBQOy_8XcZHiaqrXONVQEuQ8imQ1YQtkbDYNSiLtqZrTAdXvaubxReSvuf-u9aWHsRM9H8MlJaIK3cJ7Z6idjahvpXuMdi64HKjmI4pDM34IKhLWalwG8Dvey7EOHBuhmDpKW5uL-aYhV5kAR8LsuQZo66hjOHwpq2owF7GdKgTkL5VH8lOD_mcr6w6SsNeN7AE8-GiMX8',
}

const icons: Record<string, LucideIcon> = {
  memory: BookOpen, logic: Cog, reading: LibraryBig, creativity: Palette, curiosity: Telescope,
  academy: Grid3X3, quests: ClipboardList, boss: Swords, library: LibraryBig,
  sparkles: Sparkles, zap: Zap, search: Search, upload: Upload, download: Download,
  brain: Brain, coach: Lightbulb, target: Target, student: UserRound, check: Check,
  reviewed: ShieldCheck, selected: CircleDot,
}

const iconAliases: Record<string, string> = {
  '✦': 'sparkles', 'ϟ': 'zap', '⌕': 'search', '⇧': 'upload', '⇩': 'download',
  '◎': 'brain', '◉': 'target', '♟': 'student', '✓': 'check',
  '▦': 'academy', '▣': 'quests', '▤': 'library',
}

const Icon = ({ name }: { name: string }) => {
  const Component = icons[iconAliases[name] ?? name] ?? Sparkles
  return <Component className="icon" aria-hidden="true" strokeWidth={2.4} />
}

function Header({ xp, learnerBand, onBandChange, syncStatus }: { xp: number; learnerBand: LearnerBand; onBandChange: (band: LearnerBand) => void; syncStatus: 'loading' | 'synced' | 'offline' }) {
  return (
    <header className="topbar">
      <div className="brand">
        <img src={art.avatar} alt="" />
        <div><strong>HERO</strong><span>ACADEMY</span></div>
      </div>
      <div className="header-progress">
        <label className="band-picker"><span>LEARNING LEVEL</span><select value={learnerBand} onChange={(event) => onBandChange(event.target.value as LearnerBand)}>{Object.entries(learnerBandLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
        <span className={`sync-chip ${syncStatus}`}><i />{syncStatus === 'loading' ? 'Connecting' : syncStatus === 'synced' ? 'Progress synced' : 'Offline mode'}</span>
        <div className="level-pill"><Icon name="✦" /><span>HERO LEVEL {Math.floor(xp / 200) + 1}</span><strong>{xp} XP</strong></div>
      </div>
    </header>
  )
}

function Nav({ screen, onChange }: { screen: Screen; onChange: (screen: Screen) => void }) {
  const items: Array<[Screen, string, string]> = [
    ['academy', 'Academy', 'academy'],
    ['quests', 'Quests', 'quests'],
    ['boss', 'Boss', 'boss'],
    ['library', 'Library', 'library'],
  ]
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {items.map(([id, label, symbol]) => (
        <button className={screen === id ? 'active' : ''} onClick={() => onChange(id)} key={id}>
          <Icon name={symbol} /><span>{label}</span>
        </button>
      ))}
    </nav>
  )
}

function Academy({ city, stats, xp, startQuest }: { city: CityProgress; stats: LearningStats; xp: number; startQuest: (district: DistrictId) => void }) {
  const totalGrowth = Object.values(city).reduce((sum, value) => sum + value, 0)
  const recommended = districts.reduce((lowest, district) => city[district.id] < city[lowest.id] ? district : lowest, districts[0])
  const rank = rankForXP(xp)
  const streakDays = activityStreak(stats.activityDates ?? [])
  const today = new Date()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  const weekDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + index)
    return date.toISOString().slice(0, 10)
  })
  const activeDates = new Set(stats.activityDates ?? [])
  const weeklyWins = weekDates.filter((date) => activeDates.has(date)).length
  const exportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      xp,
      city,
      learningEvidence: stats,
      note: 'Learner-controlled report with progress totals only; no answers or written reflections.',
    }
    const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `brain-builder-progress-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }
  return (
    <main className="page academy-page">
      <section className="hero-card">
        <div className="hero-copy">
          <span className="eyebrow">BRAIN BUILDER</span>
          <h1>Grow your mind.<br /><em>Build your city.</em></h1>
          <p>Every thoughtful attempt upgrades a district in your Brain City. AI guides the journey—you do the thinking.</p>
          <button className="button button-gold" onClick={() => startQuest(recommended.id)}>BEGIN {recommended.name.replace(' District', '').toUpperCase()} MISSION <Icon name="zap" /></button>
          <small>Think → Attempt → Guidance → Understanding → Growth</small>
        </div>
        <div className="mentor-art">
          <span className="speech">Ready, recruit?</span>
          <img src={art.mentor} alt="Hero Academy mentor welcoming students" />
        </div>
      </section>

      <section className="section city-section">
        <div className="section-heading"><div><span className="eyebrow">YOUR MIND, MADE VISIBLE</span><h2>Brain City</h2></div><strong className="city-score">{totalGrowth} growth points</strong></div>
        <div className="brain-city">
          <div className="city-weather"><span>☀ MIND CITY · CLEAR</span><strong>Curiosity powers everything</strong></div>
          <div className="city-coach-tip"><img src="/images/characters/spark-coach.webp" alt="" /><span><strong>Spark’s pick</strong>{recommended.building} is ready for its next breakthrough!</span></div>
          <div className="city-skyline" aria-label="Your growing virtual brain city">
            {districts.map((district) => (
              <button className={`city-building ${district.color}`} onClick={() => startQuest(district.id)} key={district.id}>
                <span className="building-level">LV {city[district.id]}</span>
                <span className="building-shape" style={{ height: `${132 + city[district.id] * 9}px` }}><img src={district.image} alt="" /><i><Icon name={district.icon} /></i></span>
                <strong>{district.building}</strong><small>{district.skill}</small>
              </button>
            ))}
          </div>
          <div className="city-road"><span>✦</span><span>YOUR LEARNING JOURNEY</span><span>✦</span></div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading"><div><span className="eyebrow">CHOOSE WHAT TO GROW</span><h2>City districts</h2></div></div>
        <div className="sector-grid">
          {districts.map((district) => (
            <article className={`sector-card ${district.color}`} key={district.id}>
              <img className="district-card-art" src={district.image} alt={`${district.building} illustrated district`} />
              <div className="sector-icon"><Icon name={district.icon} /></div>
              <span className="status-chip">{district.id === recommended.id ? 'RECOMMENDED' : `LEVEL ${city[district.id]}`}</span>
              <h3>{district.name}</h3><p>Upgrade your {district.building} through {district.skill.toLowerCase()} challenges.</p>
              <div className="progress-label"><span>Next upgrade</span><strong>{city[district.id] * 18}%</strong></div>
              <div className="progress"><span style={{ width: `${Math.min(city[district.id] * 18, 100)}%` }} /></div>
              <button className="district-action" onClick={() => startQuest(district.id)}>Train here →</button>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-grid section">
        <article className="rank-card">
          <span className="eyebrow">CURRENT RANK</span>
          <div className="rank-medal">{rank.mark}<span>★</span></div><h2>{rank.name}</h2><p>{rank.next - xp} XP until your next rank milestone.</p>
          <div className="rank-stats"><div><strong>{weeklyWins}</strong><span>Active days</span></div><div><strong>{xp.toLocaleString()}</strong><span>Hero XP</span></div></div>
        </article>
        <article className="activity-card">
          <div className="section-heading"><div><span className="eyebrow">THIS WEEK</span><h2>Thinking streak</h2></div><strong className="streak">🔥 {streakDays} {streakDays === 1 ? 'day' : 'days'}</strong></div>
          <div className="week">{['M','T','W','T','F','S','S'].map((day, index) => <span className={activeDates.has(weekDates[index]) ? 'done' : ''} key={`${day}${index}`}>{activeDates.has(weekDates[index]) ? <Icon name="check" /> : day}</span>)}</div>
          <p><strong>{stats.questsCompleted + stats.bossWins} learning wins</strong> completed. Return tomorrow to keep your pathway active.</p>
        </article>
      </section>

      <section className="section impact-section">
        <div className="section-heading"><div><span className="eyebrow">LEARNING EVIDENCE</span><h2>Your Mindprint</h2></div><span className="evidence-note">Private · Stored on this device</span></div>
        <div className="impact-grid">
          <article className="mindprint-card">
            <div className="mindprint-core" style={{ background: `conic-gradient(var(--blue) ${Math.round(totalGrowth / 25 * 100)}%, #e5edf2 0)` }}><Icon name="brain" /><strong>{Math.round(totalGrowth / 25 * 100)}%</strong><small>mind potential</small></div>
            <div className="mindprint-skills">{districts.map((district) => <div key={district.id}><span>{district.name.replace(' District','')}</span><i><b className={district.color} style={{ width: `${city[district.id] / 5 * 100}%` }} /></i><strong>LV {city[district.id]}</strong></div>)}</div>
          </article>
          <article className="evidence-card">
            <span className="eyebrow">EFFORT THAT COUNTS</span><h3>Growth is more than accuracy</h3>
            <div className="evidence-stats"><div><strong>{stats.questsCompleted}</strong><span>Quests completed</span></div><div><strong>{stats.reflectionsWritten}</strong><span>Strategies explained</span></div><div><strong>{stats.firstTryWins}</strong><span>First-try wins</span></div><div><strong>{stats.bestBossTime || '—'}{stats.bestBossTime ? 's' : ''}</strong><span>Best boss finish</span></div></div>
            <p>We reward attempts, revision, explanation, and transfer—not just getting an answer fast.</p>
            <button className="report-button" onClick={exportReport}><Icon name="⇩" /> Export my private progress report</button>
          </article>
        </div>
      </section>

    </main>
  )
}

function ComicShelf({ xp, progress, onUnlock }: { xp: number; progress: ComicProgress; onUnlock: (comic: ComicId, cost: number) => boolean }) {
  const [reading, setReading] = useState<{ comic: ComicId; chapter: number } | null>(null)
  const [shopMessage, setShopMessage] = useState('')
  const openComic = reading ? comicBooks.find((comic) => comic.id === reading.comic)! : null
  const unlock = (comic: typeof comicBooks[number]) => {
    const nextChapter = progress[comic.id]
    const cost = comic.costs[nextChapter]
    if (onUnlock(comic.id, cost)) setShopMessage(`${comic.title} Chapter ${nextChapter + 1} unlocked!`)
    else setShopMessage(`You need ${cost - xp} more XP. Complete quests or defeat the Boss.`)
  }

  return (
    <section className="section comic-section">
      <div className="comic-banner"><div><span className="eyebrow">XP REWARD SHOP</span><h2>Adventure Comics</h2><p>Your learning powers the next chapter. Spend XP you earn—never real money.</p></div><div className="comic-wallet"><Sparkles /><span>YOUR WALLET</span><strong>{xp} XP</strong></div></div>
      {shopMessage && <div className="shop-message" role="status"><Icon name="sparkles" />{shopMessage}</div>}
      <div className="comic-grid">{comicBooks.map((comic) => {
        const unlocked = progress[comic.id]
        const complete = unlocked >= comic.chapters.length
        return <article className="comic-book" key={comic.id}>
          <div className={`comic-cover ${comic.theme}`} aria-label={`${comic.title} graphic cover`}><b aria-hidden="true">{comic.mark}</b><span>{comic.subtitle}</span><h3>{comic.title}</h3><i>{unlocked}/{comic.chapters.length} CHAPTERS</i></div>
          <div className="chapter-dots">{comic.chapters.map((_, index) => <button disabled={index >= unlocked} className={index < unlocked ? 'open' : ''} onClick={() => setReading({ comic: comic.id, chapter: index })} key={index}>{index < unlocked ? <BookOpen /> : '🔒'}<span>Ch. {index + 1}</span></button>)}</div>
          {complete ? <button className="button button-green" onClick={() => setReading({ comic: comic.id, chapter: unlocked - 1 })}>READ COLLECTION</button> : <button className="button comic-unlock" onClick={() => unlock(comic)}>UNLOCK CHAPTER {unlocked + 1} · {comic.costs[unlocked]} XP</button>}
        </article>
      })}</div>
      {reading && openComic && <div className="reader-backdrop" role="dialog" aria-modal="true" aria-label={`${openComic.title} chapter ${reading.chapter + 1}`} onClick={() => setReading(null)}><article className="comic-reader" onClick={(event) => event.stopPropagation()}><button className="reader-close" onClick={() => setReading(null)}>×</button><aside className={`reader-title-card ${openComic.theme}`}><b>{openComic.mark}</b><strong>{openComic.title}</strong><span>{openComic.subtitle}</span></aside><div><span className="eyebrow">{openComic.title.toUpperCase()} · CHAPTER {reading.chapter + 1}</span><h2>{openComic.chapters[reading.chapter]}</h2><p>The city shimmered beneath the clouds as the young heroes faced a problem no machine could solve for them. They gathered the clues, shared their ideas, and tested the first plan.</p><p>When that plan failed, they did not ask for an instant answer. They looked again, noticed what had changed, and built a stronger explanation together.</p><blockquote>“A wrong attempt isn’t wasted,” Spark said. “It gives your next idea somewhere to begin.”</blockquote><button className="button button-gold" onClick={() => setReading(null)}>BOOKMARK & CLOSE</button></div></article></div>}
    </section>
  )
}

function Library({ xp, comics, onUnlock, onMaterialReward }: { xp: number; comics: ComicProgress; onUnlock: (comic: ComicId, cost: number) => boolean; onMaterialReward: (xp: number) => void }) {
  return (
    <main className="page library-page">
      <section className="page-intro">
        <span className="eyebrow">TRAINING ARCHIVE</span><h1>Hero Library</h1><p>Practice from trusted materials and explore new skill scrolls.</p>
        <label className="search"><Icon name="⌕" /><input aria-label="Search library" placeholder="Search techniques, topics, or subjects" /><span>⌘ K</span></label>
      </section>
      <ComicShelf xp={xp} progress={comics} onUnlock={onUnlock} />
      <MaterialStudio onReward={onMaterialReward} />
    </main>
  )
}

const fallbackBossQuestions = [
  { prompt: 'Solve: 5x + 10 = 35', choices: ['x = 3', 'x = 5', 'x = 7', 'x = 9'], correct: 1 },
  { prompt: 'Which number makes 4(y − 2) = 24 true?', choices: ['4', '6', '8', '10'], correct: 2 },
  { prompt: 'A pattern grows 3, 7, 11, 15… What comes next?', choices: ['17', '18', '19', '20'], correct: 2 },
  { prompt: 'What is 25% of 80?', choices: ['15', '20', '25', '30'], correct: 1 },
  { prompt: 'Solve: 3(z + 4) = 27', choices: ['z = 3', 'z = 5', 'z = 7', 'z = 9'], correct: 1 },
]

function GlitchBoss({ onReward }: { onReward: (xp: number, secondsRemaining: number) => void }) {
  const difficulties = {
    training: { name: 'Training Run', band: 'middle' as LearnerBand, time: 105, penalty: 5, reward: 0, description: 'Steady pace · Middle School reasoning' },
    challenger: { name: 'Challenger', band: 'high' as LearnerBand, time: 90, penalty: 7, reward: 35, description: 'Faster clock · High School reasoning' },
    mastery: { name: 'Mastery Siege', band: 'proficient' as LearnerBand, time: 75, penalty: 10, reward: 75, description: 'High pressure · Proficient reasoning' },
  }
  type Difficulty = keyof typeof difficulties
  const [difficulty, setDifficulty] = useState<Difficulty>('challenger')
  const rules = difficulties[difficulty]
  const [questions, setQuestions] = useState<QuestContent[]>(fallbackBossQuestions.map((item, index) => ({ id: undefined, prompt: item.prompt, answers: item.choices, correct: item.correct, think: `boss-${index}` })))
  const [status, setStatus] = useState<'intro' | 'playing' | 'finishing' | 'won' | 'lost'>('intro')
  const [time, setTime] = useState(rules.time)
  const [hp, setHp] = useState(100)
  const [question, setQuestion] = useState(0)
  const [answer, setAnswer] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const [combo, setCombo] = useState(0)
  const [lastDamage, setLastDamage] = useState(0)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (status !== 'playing') return
    const timer = window.setInterval(() => {
      setTime((current) => {
        if (current <= 1) {
          window.clearInterval(timer)
          setStatus('lost')
          return 0
        }
        return current - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [status])

  const start = async () => {
    setTime(rules.time); setHp(100); setQuestion(0); setAnswer(null); setFeedback(''); setCombo(0); setLastDamage(0)
    try {
      const bank = await loadDistrictQuestions('logic', rules.band)
      setQuestions(bank.slice(0, 5))
    } catch {
      setQuestions(fallbackBossQuestions.map((item) => ({ prompt: item.prompt, answers: item.choices, correct: item.correct, think: '' })))
    }
    setStatus('playing')
  }
  const attack = async () => {
    if (answer === null) return
    setChecking(true)
    const activeQuestion = questions[question]
    let isCorrect = answer === activeQuestion.correct
    try {
      if (activeQuestion.id) isCorrect = (await checkDistrictAnswer('logic', activeQuestion.id, answer)).correct
    } catch {
      setFeedback('Battle link interrupted. Your timer is paused while you retry.')
      setChecking(false)
      return
    }
    if (isCorrect) {
      const damage = bossDamage(combo)
      const nextHp = Math.max(0, hp - damage)
      setHp(nextHp)
      setCombo((value) => value + 1)
      setLastDamage(damage)
      setFeedback(`Direct hit! −${damage} boss HP${damage > 20 ? ' · Combo bonus!' : ''}`)
      if (nextHp === 0 || question === questions.length - 1) {
        setStatus('finishing')
        onReward(bossReward(time) + rules.reward, time)
        window.setTimeout(() => setStatus('won'), 1600)
      } else {
        window.setTimeout(() => {
          setQuestion((value) => value + 1)
          setAnswer(null)
          setFeedback('')
          setLastDamage(0)
        }, 650)
      }
    } else {
      setTime((current) => Math.max(0, current - rules.penalty))
      setCombo(0)
      setFeedback(`Attack blocked! Review your strategy. −${rules.penalty} seconds`)
    }
    setChecking(false)
  }

  if (status === 'intro') return (
    <main className="page">
      <section className="boss-landing">
        <div><span className="eyebrow coral">GLITCH BOSS · LIVE BATTLE</span><h1>Defeat the corruption.</h1><p>Choose a combat tier, then solve five rapid-fire reasoning problems before the clock reaches zero.</p>
          <div className="difficulty-picker" role="group" aria-label="Boss difficulty">{(Object.entries(difficulties) as Array<[Difficulty, typeof rules]>).map(([id, item]) => <button className={difficulty === id ? 'selected' : ''} onClick={() => setDifficulty(id)} key={id}><span>{item.name}</span><small>{item.description}</small><i>{item.time}s · −{item.penalty}s per miss</i></button>)}</div>
          <div className="boss-rules"><span>⏱ {rules.time} seconds</span><span>⚔ Correct = damage</span><span>⌁ Mistake = −{rules.penalty} seconds</span></div><button className="button button-coral" onClick={start}>START {rules.name.toUpperCase()} <Icon name="ϟ" /></button></div>
        <img src={art.glitch} alt="Glitch Boss battle character" />
      </section>
    </main>
  )

  if (status === 'won' || status === 'lost') return (
    <main className="page boss-result-page">
      <section className={`boss-result ${status}`}>
        <span className="eyebrow">{status === 'won' ? 'BOSS DEFEATED' : 'TIME EXPIRED'}</span><h1>{status === 'won' ? 'SYSTEM RESTORED!' : 'THE GLITCH ESCAPED'}</h1>
        {status === 'won' && <div className="victory-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} />)}</div>}
        <img src={status === 'won' ? '/images/characters/glitch-defeated.webp' : art.glitch} alt="" /><h2>{status === 'won' ? `Victory with ${time}s remaining` : 'Persistence builds power'}</h2>
        <p>{status === 'won' ? `You cleared ${rules.name} and earned ${bossReward(time) + rules.reward} XP.` : 'No progress was lost. Review your strategies and return stronger.'}</p>
        <button className="button button-gold" onClick={start}>{status === 'won' ? 'BATTLE AGAIN' : 'RETRY BATTLE'} →</button>
      </section>
    </main>
  )

  const current = questions[question]
  return (
    <main className="boss-arena">
      <section className="arena-top">
        <div className="boss-name"><span>⚠</span><div><small>{rules.name.toUpperCase()} · {learnerBandLabels[rules.band]}</small><strong>THE GLITCH</strong></div></div>
        <div className={`battle-timer ${time <= 20 ? 'danger' : ''}`}><small>TIME LEFT</small><strong>{Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}</strong></div>
        <div className="arena-score"><small>COMBO</small><strong>×{combo}</strong></div>
      </section>
      <section className={`arena-scene ${status === 'finishing' ? 'final-blow' : ''} ${feedback.startsWith('Attack') ? 'attack-blocked' : ''}`}>
        <div className="boss-combatant">
          <div className="boss-hp"><span>BOSS HP <strong>{hp}/100</strong></span><i><b style={{ width: `${hp}%` }} /></i></div>
          <img className={feedback.startsWith('Direct') ? 'damaged' : ''} src={art.glitch} alt="The Glitch Boss" />
          {lastDamage > 0 && <span className="damage-number">−{lastDamage}{lastDamage > 20 && <small> CRITICAL!</small>}</span>}
          {feedback.startsWith('Direct') && <div className="hit-particles" aria-hidden="true">{Array.from({ length: 10 }, (_, index) => <i key={index} />)}</div>}
          <span className="boss-taunt">{feedback || 'Solve fast, hero. Your clock is already running!'}</span>
        </div>
        <article className="attack-console">
          <div className="console-label"><span>ATTACK {question + 1} / {questions.length}</span><strong>{rules.name.toUpperCase()}</strong></div>
          <h1>{current.prompt}</h1>
          <div className="attack-answers">{current.answers.map((choice, index) => <button className={answer === index ? 'selected' : ''} disabled={checking} onClick={() => setAnswer(index)} key={choice}><span>{String.fromCharCode(65 + index)}</span>{choice}</button>)}</div>
          <button className="button button-coral attack-button" disabled={answer === null || checking} onClick={attack}>{checking ? 'VERIFYING…' : 'LAUNCH ATTACK'} <Icon name="ϟ" /></button>
          <p><Icon name="◉" /> No hints in Boss Battles. Trust the mind you built.</p>
        </article>
        {status === 'finishing' && <div className="finishing-overlay"><Icon name="zap" /><strong>FINAL STRIKE!</strong><span>Corruption cleared</span></div>}
      </section>
    </main>
  )
}

type QuestContent = { id?: string; prompt: string; answers: string[]; correct?: number; think: string }

const questContent: Record<DistrictId, QuestContent> = {
  memory: { prompt: 'Study this sequence: Moon, Key, River, Star. Which item came second?', answers: ['River', 'Key', 'Moon', 'Star'], correct: 1, think: 'Picture each object in a different room of your home.' },
  logic: { prompt: 'A robot has 3 boxes with 4 gears in each. How many gears are there?', answers: ['7', '10', '12', '14'], correct: 2, think: 'How could equal groups help you model the problem?' },
  reading: { prompt: 'Maya packed an umbrella because dark clouds filled the sky. What can you infer?', answers: ['It may rain', 'It is nighttime', 'She is traveling', 'It is snowing'], correct: 0, think: 'Connect the clue in the sentence to what usually happens next.' },
  creativity: { prompt: 'Which change makes “The bird flew” more vivid?', answers: ['The bird was there', 'The scarlet bird soared above silver clouds', 'A bird flew', 'It moved'], correct: 1, think: 'Look for specific details that help you imagine the scene.' },
  curiosity: { prompt: 'Which question would best begin an investigation about plant growth?', answers: ['Are plants nice?', 'Which color is best?', 'How does light duration affect height?', 'Do I like plants?'], correct: 2, think: 'A strong research question identifies something measurable.' },
}

function BrainQuest({ districtId, learnerBand, onComplete, goHome }: { districtId: DistrictId; learnerBand: LearnerBand; onComplete: (district: DistrictId, xp: number, firstTry: boolean) => void; goHome: () => void }) {
  const district = districts.find((item) => item.id === districtId)!
  const [content, setContent] = useState<QuestContent>(questContent[districtId])
  const [stage, setStage] = useState<'think' | 'attempt' | 'reflect' | 'grown'>('think')
  const [answer, setAnswer] = useState<number | null>(null)
  const [reflection, setReflection] = useState('')
  const [message, setMessage] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [checking, setChecking] = useState(false)
  const coachLine = stage === 'think'
    ? `Try this: ${content.think}`
    : stage === 'attempt' && attempts > 0
      ? `Let’s shift perspective. ${content.think}`
      : stage === 'reflect'
        ? 'You solved it—now teach the strategy back to me. Teaching makes the pathway stronger!'
        : 'Trust your first strategy, then adjust if the evidence changes.'

  useEffect(() => {
    loadDistrictQuestions(districtId, learnerBand)
      .then((questions) => {
        const day = Math.floor(Date.now() / 86_400_000)
        setContent(questions[day % questions.length])
      })
      .catch(() => setContent(questContent[districtId]))
  }, [districtId, learnerBand])

  const checkAnswer = async () => {
    if (answer === null) return
    setAttempts((value) => value + 1)
    setChecking(true)
    let isCorrect = answer === content.correct
    let guidance = content.think
    try {
      if (content.id) {
        const result = await checkDistrictAnswer(districtId, content.id, answer)
        isCorrect = result.correct
        guidance = result.guidance ?? content.think
      }
    } catch {
      if (content.correct === undefined) {
        setMessage('Spark lost the connection before checking. Try again when the sync light returns.')
        setChecking(false)
        return
      }
    }
    if (isCorrect) {
      setMessage('You found it. Now explain the thinking that got you there.')
      setStage('reflect')
    } else {
      setMessage(`Good attempt. Coach clue: ${guidance}`)
    }
    setChecking(false)
  }
  const grow = () => {
    if (reflection.trim().split(/\s+/).length < 5) {
      setMessage('Tell us a little more about your strategy—at least one clear sentence.')
      return
    }
    setStage('grown')
    setMessage('')
    onComplete(districtId, questReward(attempts), attempts <= 1)
  }

  return (
    <main className="page brain-quest-page">
      <button className="back-button" onClick={goHome}>← Back to Brain City</button>
      <div className="quest-heading"><div className={`quest-district-icon ${district.color}`}><Icon name={district.icon} /></div><div><span className="eyebrow">{district.name} · {learnerBandLabels[learnerBand]}</span><h1>{stage === 'grown' ? `${district.building} upgraded!` : 'Think first. Grow stronger.'}</h1></div></div>
      {stage === 'grown' ? (
        <section className="growth-result">
          <div className={`upgrade-building ${district.color}`}><img src={district.image} alt={`${district.building} upgraded`} /><span>↑</span></div>
          <span className="status-chip">DISTRICT GROWTH</span><h2>Your effort built something real.</h2><p>You earned growth for attempting, improving, and explaining—not just for being correct.</p>
          <button className="button button-gold" onClick={goHome}>SEE YOUR CITY →</button>
        </section>
      ) : (
        <section className="learning-loop">
          <aside>
            <span className="eyebrow">LEARNING PATH</span>
            {['Think', 'Attempt', 'Reflect', 'Grow'].map((item, index) => {
              const active = ['think','attempt','reflect','grown'].indexOf(stage) >= index
              return <span className={active ? 'active' : ''} key={item}><i>{active ? '✓' : index + 1}</i>{item}</span>
            })}
            <div className="coach-companion"><div className="coach-portrait"><img src="/images/characters/spark-coach.webp" alt="Spark, your AI learning coach" /><span><Icon name="sparkles" /></span></div><strong>Spark · AI Coach</strong><p>{coachLine}</p><small>Guides your thinking · Never gives the answer</small></div>
          </aside>
          <article className="learning-card">
            {stage === 'think' && <><span className="eyebrow">THINK BEFORE ANSWERS</span><h2>{content.prompt}</h2><div className="think-pause"><Icon name="◎" /><div><strong>Take a thinking pause</strong><p>Build a strategy in your head before choices appear.</p></div></div><button className="button button-blue" onClick={() => setStage('attempt')}>I HAVE A STRATEGY →</button></>}
            {stage === 'attempt' && <><span className="eyebrow">YOUR ATTEMPT</span><h2>{content.prompt}</h2><div className="answer-grid">{content.answers.map((item, index) => <button className={answer === index ? 'selected' : ''} disabled={checking} onClick={() => setAnswer(index)} key={item}><span>{String.fromCharCode(65 + index)}</span>{item}</button>)}</div><button className="button button-blue" disabled={answer === null || checking} onClick={checkAnswer}>{checking ? 'CHECKING WITH REVIEWED BANK…' : 'CHECK MY THINKING →'}</button></>}
            {stage === 'reflect' && <><span className="eyebrow">MAKE THINKING VISIBLE</span><h2>How did you decide?</h2><p>Explain your strategy in your own words. There is more than one good way to think.</p><textarea value={reflection} onChange={(event) => setReflection(event.target.value)} rows={6} placeholder="I noticed... so I decided..." autoFocus /><button className="button button-green" onClick={grow}>BUILD MY DISTRICT <Icon name="✦" /></button></>}
            {message && <div className="coach-message" role="status"><Icon name="✦" /><span>{message}</span></div>}
          </article>
        </section>
      )}
    </main>
  )
}

function App() {
  const [screen, setScreen] = useState<Screen>('academy')
  const [syncStatus, setSyncStatus] = useState<'loading' | 'synced' | 'offline'>('loading')
  const [syncReady, setSyncReady] = useState(false)
  const [activeDistrict, setActiveDistrict] = useState<DistrictId>('logic')
  const [learnerBand, setLearnerBand] = useState<LearnerBand>(() => (localStorage.getItem('brain-builder-band') as LearnerBand) || 'middle')
  const [xp, setXp] = useState(() => Number(localStorage.getItem('brain-builder-xp')) || 450)
  const [city, setCity] = useState<CityProgress>(() => {
    const saved = localStorage.getItem('brain-builder-city')
    return saved ? JSON.parse(saved) as CityProgress : { memory: 3, logic: 2, reading: 4, creativity: 1, curiosity: 1 }
  })
  const [stats, setStats] = useState<LearningStats>(() => {
    const saved = localStorage.getItem('brain-builder-stats')
    const stored = saved ? JSON.parse(saved) as Partial<LearningStats> : {}
    return { questsCompleted: 0, firstTryWins: 0, reflectionsWritten: 0, bossWins: 0, bestBossTime: 0, activityDates: [], ...stored }
  })
  const [comics, setComics] = useState<ComicProgress>(() => {
    const saved = localStorage.getItem('brain-builder-comics')
    return saved ? JSON.parse(saved) as ComicProgress : { gearbound: 0, skyLibrary: 0, starScouts: 0 }
  })

  useEffect(() => {
    localStorage.setItem('brain-builder-city', JSON.stringify(city))
    localStorage.setItem('brain-builder-xp', String(xp))
    localStorage.setItem('brain-builder-stats', JSON.stringify(stats))
    localStorage.setItem('brain-builder-comics', JSON.stringify(comics))
    localStorage.setItem('brain-builder-band', learnerBand)
  }, [city, comics, learnerBand, stats, xp])

  useEffect(() => {
    loadProfile()
      .then((profile) => {
        if (profile) {
          setXp(profile.xp)
          setLearnerBand(profile.learnerBand ?? 'middle')
          setCity({ memory: 1, logic: 1, reading: 1, creativity: 1, curiosity: 1, ...profile.city } as CityProgress)
          setStats({
            questsCompleted: profile.stats.questsCompleted ?? 0,
            firstTryWins: profile.stats.firstTryWins ?? 0,
            reflectionsWritten: profile.stats.reflectionsWritten ?? 0,
            bossWins: profile.stats.bossWins ?? 0,
            bestBossTime: profile.stats.bestBossTime ?? 0,
            activityDates: profile.stats.activityDates ?? [],
          })
          setComics({ gearbound: 0, skyLibrary: 0, starScouts: 0, ...profile.comics } as ComicProgress)
        }
        setSyncStatus('synced')
      })
      .catch(() => setSyncStatus('offline'))
      .finally(() => setSyncReady(true))
  }, [])

  useEffect(() => {
    if (!syncReady) return
    const sync = window.setTimeout(() => {
      saveProfile({ xp, learnerBand, city, stats, comics })
        .then(() => setSyncStatus('synced'))
        .catch(() => setSyncStatus('offline'))
    }, 500)
    return () => window.clearTimeout(sync)
  }, [city, comics, learnerBand, stats, syncReady, xp])

  const startQuest = (district: DistrictId) => {
    setActiveDistrict(district)
    setScreen('quests')
  }
  const completeQuest = (district: DistrictId, reward: number, firstTry: boolean) => {
    setCity((current) => ({ ...current, [district]: nextDistrictLevel(current[district]) }))
    setXp((current) => current + reward)
    setStats((current) => ({
      ...current,
      questsCompleted: current.questsCompleted + 1,
      reflectionsWritten: current.reflectionsWritten + 1,
      firstTryWins: current.firstTryWins + (firstTry ? 1 : 0),
      activityDates: [...new Set([...current.activityDates, new Date().toISOString().slice(0, 10)])].slice(-60),
    }))
  }
  const completeBoss = (reward: number, secondsRemaining: number) => {
    setXp((current) => current + reward)
    setStats((current) => ({
      ...current,
      bossWins: current.bossWins + 1,
      bestBossTime: Math.max(current.bestBossTime, secondsRemaining),
      activityDates: [...new Set([...current.activityDates, new Date().toISOString().slice(0, 10)])].slice(-60),
    }))
  }
  const unlockComic = (comic: ComicId, cost: number) => {
    if (!canAfford(xp, cost)) return false
    setXp((current) => current - cost)
    setComics((current) => ({ ...current, [comic]: nextComicChapter(current[comic]) }))
    return true
  }
  const completeMaterial = (reward: number) => {
    setXp((current) => current + reward)
    setStats((current) => ({
      ...current,
      activityDates: [...new Set([...current.activityDates, new Date().toISOString().slice(0, 10)])].slice(-60),
    }))
  }

  return (
    <div className="app">
      <Header xp={xp} learnerBand={learnerBand} onBandChange={setLearnerBand} syncStatus={syncStatus} />
      {screen === 'academy' && <Academy city={city} stats={stats} xp={xp} startQuest={startQuest} />}
      {screen === 'library' && <Library xp={xp} comics={comics} onUnlock={unlockComic} onMaterialReward={completeMaterial} />}
      {screen === 'boss' && <GlitchBoss onReward={completeBoss} />}
      {screen === 'quests' && <BrainQuest districtId={activeDistrict} learnerBand={learnerBand} onComplete={completeQuest} goHome={() => setScreen('academy')} />}
      <Nav screen={screen} onChange={setScreen} />
    </div>
  )
}

export default App
