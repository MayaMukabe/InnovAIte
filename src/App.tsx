import { useEffect, useState } from 'react'
import {
  BookOpen, Brain, Check, CircleDot, ClipboardList, Cog, Download,
  Grid3X3, LibraryBig, Lightbulb, Palette, Search, ShieldCheck,
  Sparkles, Swords, Target, Telescope, Upload, UserRound, Zap,
  type LucideIcon,
} from 'lucide-react'
import { bossDamage, bossReward, nextDistrictLevel, questReward } from './gameLogic'

type Screen = 'academy' | 'quests' | 'boss' | 'library'
type DistrictId = 'memory' | 'logic' | 'reading' | 'creativity' | 'curiosity'
type CityProgress = Record<DistrictId, number>
type LearningStats = {
  questsCompleted: number
  firstTryWins: number
  reflectionsWritten: number
  bossWins: number
  bestBossTime: number
}

const districts: Array<{ id: DistrictId; icon: string; name: string; building: string; skill: string; color: string; image: string }> = [
  { id: 'memory', icon: 'memory', name: 'Memory District', building: 'Grand Library', skill: 'Recall & retention', color: 'green', image: '/images/districts/grand-library.webp' },
  { id: 'logic', icon: 'logic', name: 'Logic District', building: 'Engineering Lab', skill: 'Reasoning & math', color: 'blue', image: '/images/districts/engineering-lab.webp' },
  { id: 'reading', icon: 'reading', name: 'Reading District', building: 'Knowledge Tower', skill: 'Comprehension', color: 'yellow', image: '/images/districts/knowledge-tower.webp' },
  { id: 'creativity', icon: 'creativity', name: 'Creativity District', building: 'Art Studio', skill: 'Ideas & expression', color: 'coral', image: '/images/districts/art-studio.webp' },
  { id: 'curiosity', icon: 'curiosity', name: 'Curiosity District', building: 'Research Center', skill: 'Questions & discovery', color: 'purple', image: '/images/districts/research-center.webp' },
]

const art = {
  mentor:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDOd_ko4QUhzikkX__kaGnWL29-rsV83IFNBHEDeRzk7yMEXV3zKYwSs1HizWBbl8g5_evOMnVVzznWikS_7_l-509mO9ElxYEl8HuIw0PQ3pdD1A3k7a2yoD0oEmbKwq_rlJviDZtGkCjkTm6MyAyBQ4IZZZY6T_a0ZwPV0lS7dwx_m4be6bzG2TNISU8cHBMy7jsK39NP1tE5IcTiw94DlFjcsSafIy4M4mCrdlI9jzQDnl7l4ofXW944nlhwJB_zDtyS_q1VK5A',
  avatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCwG-RIeyi8QoXefukniUwbU286D4prv_8bKSHDC98ta9_UDZd0DvFS32_eUUEroWRwEAgXxzPN6JtFpQ75-Egf_xUWQQH0jWozxI0VgS6eNDASG1zPIQXQbRVwWZXlSZ1ohruTuTi-EBa3A8eLlcNWN4MWg1v5_N-HOKhEb5xmA7GIz9KQkHh1RP2QgQer72AKTW55ubTowFg-ECHfMc4K4g0bn9p3U5xTDX9Roj4auIIe4tKLKWuTBTrvdV6MfQ4JP8_AOiI_Hi0',
  glitch:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD2oArwOnRv-de8zXddesTy1mLaXM3MjnfNfPUTcf_TZs_La4GFBY_eRlYEjavPrBBpWNJHszTX0313Fj9otZioEFIORnZJpLELLT2sHr90zP5b6GwXwd1nPef2TCXIcKr61R0xyJvhlXIvz1S4f0zr4Kbv0CnBf018PKVqXJVMAbi9AWDLmfeqaj_GuJjTo-gcDvzSzAokyQ1ak2KiDWCsfGatYUa1FJ-xTMYKbKIrjajhfAXMj70aPFdYG1P6Q4XwzY_0dXajilw',
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

function Header({ xp }: { xp: number }) {
  return (
    <header className="topbar">
      <div className="brand">
        <img src={art.avatar} alt="" />
        <div><strong>HERO</strong><span>ACADEMY</span></div>
      </div>
      <div className="level-pill"><Icon name="✦" /><span>LEVEL {Math.floor(xp / 200) + 1}</span><strong>{xp} XP</strong></div>
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
  const achievements = [
    { icon: '⌂', name: 'City Founder', unlocked: totalGrowth >= 12 },
    { icon: '◎', name: 'Deep Thinker', unlocked: stats.reflectionsWritten >= 3 },
    { icon: 'ϟ', name: 'Boss Breaker', unlocked: stats.bossWins >= 1 },
    { icon: '★', name: 'First-Try Hero', unlocked: stats.firstTryWins >= 3 },
  ]
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
          <div className="rank-medal">Ⅲ<span>★</span></div><h2>Gold Hero</h2><p>Top 5% this week. One more quest to reach Diamond.</p>
          <div className="rank-stats"><div><strong>24</strong><span>Weekly wins</span></div><div><strong>1,240</strong><span>Hero points</span></div></div>
        </article>
        <article className="activity-card">
          <div className="section-heading"><div><span className="eyebrow">THIS WEEK</span><h2>Thinking streak</h2></div><strong className="streak">🔥 4 days</strong></div>
          <div className="week">{['M','T','W','T','F','S','S'].map((day, index) => <span className={index < 4 ? 'done' : ''} key={`${day}${index}`}>{index < 4 ? '✓' : day}</span>)}</div>
          <p><strong>12 problems</strong> solved without answer reveals. That’s real learner power.</p>
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
        <div className="achievement-row">{achievements.map((badge) => <article className={badge.unlocked ? 'unlocked' : ''} key={badge.name}><Icon name={badge.icon} /><div><strong>{badge.name}</strong><span>{badge.unlocked ? 'Unlocked' : 'Keep growing to unlock'}</span></div></article>)}</div>
      </section>

    </main>
  )
}

function Library() {
  return (
    <main className="page library-page">
      <section className="page-intro">
        <span className="eyebrow">TRAINING ARCHIVE</span><h1>Hero Library</h1><p>Practice from trusted materials and explore new skill scrolls.</p>
        <label className="search"><Icon name="⌕" /><input aria-label="Search library" placeholder="Search techniques, topics, or subjects" /><span>⌘ K</span></label>
      </section>
      <section className="section">
        <div className="section-heading"><div><span className="eyebrow">PICK UP WHERE YOU LEFT OFF</span><h2>Recent study</h2></div></div>
        <div className="recent-grid">
          <article className="recent-card"><div className="ring">75%</div><div><h3>Algebra Alchemy</h3><p>Chapter 4 · Linear Potions</p><button className="small-button">Resume →</button></div></article>
          <article className="recent-card"><div className="ring ring-blue">30%</div><div><h3>Logic Spells</h3><p>Level 1 · Boolean Runes</p><button className="small-button">Resume →</button></div></article>
          <article className="upload-card"><Icon name="⇧" /><div><h3>Add your study materials</h3><p>Turn teacher-approved notes into private practice.</p></div><button className="button button-blue">UPLOAD</button></article>
        </div>
      </section>
      <section className="section">
        <div className="section-heading"><div><span className="eyebrow">DISCOVER</span><h2>Trending skill scrolls</h2></div><button className="text-button">Browse all →</button></div>
        <div className="scroll-grid">
          <article className="scroll-card featured"><img src={art.geometry} alt="" /><div><span className="status-chip">PREMIUM QUEST</span><h3>The Geometry of Gliding</h3><p>Master flight paths by calculating angles and velocity.</p><button className="button button-green">UNLOCK SCROLL</button></div></article>
          <article className="scroll-card"><img src={art.stories} alt="" /><div><span className="eyebrow">LANGUAGE ARTS · +450 XP</span><h3>Story Weaving</h3><p>Craft stronger narratives through choice and reflection.</p><button className="text-button">Explore →</button></div></article>
          <article className="scroll-card"><img src={art.chemistry} alt="" /><div><span className="eyebrow">SCIENCE · +600 XP</span><h3>Elemental Chemistry</h3><p>Learn the reaction rules of the physical world.</p><button className="text-button">Explore →</button></div></article>
        </div>
      </section>
    </main>
  )
}

const bossQuestions = [
  { prompt: 'Solve: 5x + 10 = 35', choices: ['x = 3', 'x = 5', 'x = 7', 'x = 9'], correct: 1 },
  { prompt: 'Which number makes 4(y − 2) = 24 true?', choices: ['4', '6', '8', '10'], correct: 2 },
  { prompt: 'A pattern grows 3, 7, 11, 15… What comes next?', choices: ['17', '18', '19', '20'], correct: 2 },
  { prompt: 'What is 25% of 80?', choices: ['15', '20', '25', '30'], correct: 1 },
  { prompt: 'Solve: 3(z + 4) = 27', choices: ['z = 3', 'z = 5', 'z = 7', 'z = 9'], correct: 1 },
]

function GlitchBoss({ onReward }: { onReward: (xp: number, secondsRemaining: number) => void }) {
  const [status, setStatus] = useState<'intro' | 'playing' | 'won' | 'lost'>('intro')
  const [time, setTime] = useState(90)
  const [hp, setHp] = useState(100)
  const [question, setQuestion] = useState(0)
  const [answer, setAnswer] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const [combo, setCombo] = useState(0)

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

  const start = () => {
    setTime(90); setHp(100); setQuestion(0); setAnswer(null); setFeedback(''); setCombo(0); setStatus('playing')
  }
  const attack = () => {
    if (answer === null) return
    if (answer === bossQuestions[question].correct) {
      const damage = bossDamage(combo)
      const nextHp = Math.max(0, hp - damage)
      setHp(nextHp)
      setCombo((value) => value + 1)
      setFeedback(`Direct hit! −${damage} boss HP${damage > 20 ? ' · Combo bonus!' : ''}`)
      if (nextHp === 0 || question === bossQuestions.length - 1) {
        setStatus('won')
        onReward(bossReward(time), time)
      } else {
        window.setTimeout(() => {
          setQuestion((value) => value + 1)
          setAnswer(null)
          setFeedback('')
        }, 650)
      }
    } else {
      setTime((current) => Math.max(0, current - 7))
      setCombo(0)
      setFeedback('Attack blocked! Review your strategy. −7 seconds')
    }
  }

  if (status === 'intro') return (
    <main className="page">
      <section className="boss-landing">
        <div><span className="eyebrow coral">GLITCH BOSS · LIVE BATTLE</span><h1>Defeat the corruption.</h1><p>Solve five rapid-fire reasoning problems before the clock reaches zero. Every correct answer damages the boss. Consecutive hits charge a combo attack.</p><div className="boss-rules"><span>⏱ 90 seconds</span><span>⚔ Correct = damage</span><span>⌁ Mistake = −7 seconds</span></div><button className="button button-coral" onClick={start}>START BOSS BATTLE <Icon name="ϟ" /></button></div>
        <img src={art.glitch} alt="Glitch Boss battle character" />
      </section>
    </main>
  )

  if (status === 'won' || status === 'lost') return (
    <main className="page boss-result-page">
      <section className={`boss-result ${status}`}>
        <span className="eyebrow">{status === 'won' ? 'BOSS DEFEATED' : 'TIME EXPIRED'}</span><h1>{status === 'won' ? 'SYSTEM RESTORED!' : 'THE GLITCH ESCAPED'}</h1>
        <img src={art.glitch} alt="" /><h2>{status === 'won' ? `Victory with ${time}s remaining` : 'Persistence builds power'}</h2>
        <p>{status === 'won' ? `You earned ${bossReward(time)} XP for speed and accuracy.` : 'No progress was lost. Review your strategies and return stronger.'}</p>
        <button className="button button-gold" onClick={start}>{status === 'won' ? 'BATTLE AGAIN' : 'RETRY BATTLE'} →</button>
      </section>
    </main>
  )

  const current = bossQuestions[question]
  return (
    <main className="boss-arena">
      <section className="arena-top">
        <div className="boss-name"><span>⚠</span><div><small>LEVEL 5 BOSS</small><strong>THE GLITCH</strong></div></div>
        <div className={`battle-timer ${time <= 20 ? 'danger' : ''}`}><small>TIME LEFT</small><strong>{Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}</strong></div>
        <div className="arena-score"><small>COMBO</small><strong>×{combo}</strong></div>
      </section>
      <section className="arena-scene">
        <div className="boss-combatant">
          <div className="boss-hp"><span>BOSS HP <strong>{hp}/100</strong></span><i><b style={{ width: `${hp}%` }} /></i></div>
          <img className={feedback.startsWith('Direct') ? 'damaged' : ''} src={art.glitch} alt="The Glitch Boss" />
          <span className="boss-taunt">{feedback || 'Solve fast, hero. Your clock is already running!'}</span>
        </div>
        <article className="attack-console">
          <div className="console-label"><span>ATTACK {question + 1} / {bossQuestions.length}</span><strong>+20 DAMAGE</strong></div>
          <h1>{current.prompt}</h1>
          <div className="attack-answers">{current.choices.map((choice, index) => <button className={answer === index ? 'selected' : ''} onClick={() => setAnswer(index)} key={choice}><span>{String.fromCharCode(65 + index)}</span>{choice}</button>)}</div>
          <button className="button button-coral attack-button" disabled={answer === null} onClick={attack}>LAUNCH ATTACK <Icon name="ϟ" /></button>
          <p><Icon name="◉" /> No hints in Boss Battles. Trust the mind you built.</p>
        </article>
      </section>
    </main>
  )
}

const questContent: Record<DistrictId, { prompt: string; answers: string[]; correct: number; think: string }> = {
  memory: { prompt: 'Study this sequence: Moon, Key, River, Star. Which item came second?', answers: ['River', 'Key', 'Moon', 'Star'], correct: 1, think: 'Picture each object in a different room of your home.' },
  logic: { prompt: 'A robot has 3 boxes with 4 gears in each. How many gears are there?', answers: ['7', '10', '12', '14'], correct: 2, think: 'How could equal groups help you model the problem?' },
  reading: { prompt: 'Maya packed an umbrella because dark clouds filled the sky. What can you infer?', answers: ['It may rain', 'It is nighttime', 'She is traveling', 'It is snowing'], correct: 0, think: 'Connect the clue in the sentence to what usually happens next.' },
  creativity: { prompt: 'Which change makes “The bird flew” more vivid?', answers: ['The bird was there', 'The scarlet bird soared above silver clouds', 'A bird flew', 'It moved'], correct: 1, think: 'Look for specific details that help you imagine the scene.' },
  curiosity: { prompt: 'Which question would best begin an investigation about plant growth?', answers: ['Are plants nice?', 'Which color is best?', 'How does light duration affect height?', 'Do I like plants?'], correct: 2, think: 'A strong research question identifies something measurable.' },
}

function BrainQuest({ districtId, onComplete, goHome }: { districtId: DistrictId; onComplete: (district: DistrictId, xp: number, firstTry: boolean) => void; goHome: () => void }) {
  const district = districts.find((item) => item.id === districtId)!
  const content = questContent[districtId]
  const [stage, setStage] = useState<'think' | 'attempt' | 'reflect' | 'grown'>('think')
  const [answer, setAnswer] = useState<number | null>(null)
  const [reflection, setReflection] = useState('')
  const [message, setMessage] = useState('')
  const [attempts, setAttempts] = useState(0)
  const coachLine = stage === 'think'
    ? `Try this: ${content.think}`
    : stage === 'attempt' && attempts > 0
      ? `Let’s shift perspective. ${content.think}`
      : stage === 'reflect'
        ? 'You solved it—now teach the strategy back to me. Teaching makes the pathway stronger!'
        : 'Trust your first strategy, then adjust if the evidence changes.'

  const checkAnswer = () => {
    setAttempts((value) => value + 1)
    if (answer === content.correct) {
      setMessage('You found it. Now explain the thinking that got you there.')
      setStage('reflect')
    } else {
      setMessage(`Good attempt. Coach clue: ${content.think}`)
    }
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
      <div className="quest-heading"><div className={`quest-district-icon ${district.color}`}><Icon name={district.icon} /></div><div><span className="eyebrow">{district.name}</span><h1>{stage === 'grown' ? `${district.building} upgraded!` : 'Think first. Grow stronger.'}</h1></div></div>
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
            {stage === 'attempt' && <><span className="eyebrow">YOUR ATTEMPT</span><h2>{content.prompt}</h2><div className="answer-grid">{content.answers.map((item, index) => <button className={answer === index ? 'selected' : ''} onClick={() => setAnswer(index)} key={item}><span>{String.fromCharCode(65 + index)}</span>{item}</button>)}</div><button className="button button-blue" disabled={answer === null} onClick={checkAnswer}>CHECK MY THINKING →</button></>}
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
  const [activeDistrict, setActiveDistrict] = useState<DistrictId>('logic')
  const [xp, setXp] = useState(() => Number(localStorage.getItem('brain-builder-xp')) || 450)
  const [city, setCity] = useState<CityProgress>(() => {
    const saved = localStorage.getItem('brain-builder-city')
    return saved ? JSON.parse(saved) as CityProgress : { memory: 3, logic: 2, reading: 4, creativity: 1, curiosity: 1 }
  })
  const [stats, setStats] = useState<LearningStats>(() => {
    const saved = localStorage.getItem('brain-builder-stats')
    return saved ? JSON.parse(saved) as LearningStats : { questsCompleted: 0, firstTryWins: 0, reflectionsWritten: 0, bossWins: 0, bestBossTime: 0 }
  })

  useEffect(() => {
    localStorage.setItem('brain-builder-city', JSON.stringify(city))
    localStorage.setItem('brain-builder-xp', String(xp))
    localStorage.setItem('brain-builder-stats', JSON.stringify(stats))
  }, [city, stats, xp])

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
    }))
  }
  const completeBoss = (reward: number, secondsRemaining: number) => {
    setXp((current) => current + reward)
    setStats((current) => ({
      ...current,
      bossWins: current.bossWins + 1,
      bestBossTime: Math.max(current.bestBossTime, secondsRemaining),
    }))
  }

  return (
    <div className="app">
      <Header xp={xp} />
      {screen === 'academy' && <Academy city={city} stats={stats} xp={xp} startQuest={startQuest} />}
      {screen === 'library' && <Library />}
      {screen === 'boss' && <GlitchBoss onReward={completeBoss} />}
      {screen === 'quests' && <BrainQuest districtId={activeDistrict} onComplete={completeQuest} goHome={() => setScreen('academy')} />}
      <Nav screen={screen} onChange={setScreen} />
    </div>
  )
}

export default App
