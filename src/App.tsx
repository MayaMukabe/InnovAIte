import { useEffect, useState } from 'react'

type Screen = 'academy' | 'quests' | 'boss' | 'library'
type DistrictId = 'memory' | 'logic' | 'reading' | 'creativity' | 'curiosity'
type CityProgress = Record<DistrictId, number>

const districts: Array<{ id: DistrictId; icon: string; name: string; building: string; skill: string; color: string }> = [
  { id: 'memory', icon: '▤', name: 'Memory District', building: 'Grand Library', skill: 'Recall & retention', color: 'green' },
  { id: 'logic', icon: '⚙', name: 'Logic District', building: 'Engineering Lab', skill: 'Reasoning & math', color: 'blue' },
  { id: 'reading', icon: '▥', name: 'Reading District', building: 'Knowledge Tower', skill: 'Comprehension', color: 'yellow' },
  { id: 'creativity', icon: '✦', name: 'Creativity District', building: 'Art Studio', skill: 'Ideas & expression', color: 'coral' },
  { id: 'curiosity', icon: '⌕', name: 'Curiosity District', building: 'Research Center', skill: 'Questions & discovery', color: 'purple' },
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

const Icon = ({ name }: { name: string }) => (
  <span className="icon" aria-hidden="true">{name}</span>
)

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
    ['academy', 'Academy', '▦'],
    ['quests', 'Quests', '▣'],
    ['boss', 'Boss', 'ϟ'],
    ['library', 'Library', '▤'],
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

function Academy({ city, startQuest }: { city: CityProgress; startQuest: (district: DistrictId) => void }) {
  const totalGrowth = Object.values(city).reduce((sum, value) => sum + value, 0)
  return (
    <main className="page academy-page">
      <section className="hero-card">
        <div className="hero-copy">
          <span className="eyebrow">BRAIN BUILDER</span>
          <h1>Grow your mind.<br /><em>Build your city.</em></h1>
          <p>Every thoughtful attempt upgrades a district in your Brain City. AI guides the journey—you do the thinking.</p>
          <button className="button button-gold" onClick={() => startQuest('logic')}>START TODAY’S QUEST <Icon name="ϟ" /></button>
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
          <div className="city-skyline" aria-label="Your growing virtual brain city">
            {districts.map((district) => (
              <button className={`city-building ${district.color}`} onClick={() => startQuest(district.id)} key={district.id}>
                <span className="building-level">LV {city[district.id]}</span>
                <span className="building-shape" style={{ height: `${76 + city[district.id] * 14}px` }}><Icon name={district.icon} /></span>
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
          {districts.slice(0, 3).map((district) => (
            <article className={`sector-card ${district.color}`} key={district.id}>
              <div className="sector-icon"><Icon name={district.icon} /></div>
              <span className="status-chip">LEVEL {city[district.id]}</span>
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

function Boss({ startQuest }: { startQuest: () => void }) {
  return (
    <main className="page">
      <section className="boss-landing">
        <div><span className="eyebrow coral">FINAL ATTACK MODE</span><h1>Prove it’s really yours.</h1><p>No hints. No answer reveals. Complete one fresh problem to confirm that your strategy transfers.</p><div className="boss-rules"><span>✓ New problem</span><span>✓ Student-led solution</span><span>✓ Encouraging feedback</span></div><button className="button button-coral" onClick={startQuest}>ENTER BOSS BATTLE <Icon name="ϟ" /></button></div>
        <img src={art.glitch} alt="Friendly robot Glitch battle character" />
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

function BrainQuest({ districtId, onComplete, goHome }: { districtId: DistrictId; onComplete: (district: DistrictId, xp: number) => void; goHome: () => void }) {
  const district = districts.find((item) => item.id === districtId)!
  const content = questContent[districtId]
  const [stage, setStage] = useState<'think' | 'attempt' | 'reflect' | 'grown'>('think')
  const [answer, setAnswer] = useState<number | null>(null)
  const [reflection, setReflection] = useState('')
  const [message, setMessage] = useState('')
  const [attempts, setAttempts] = useState(0)

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
    onComplete(districtId, attempts <= 1 ? 50 : 35)
  }

  return (
    <main className="page brain-quest-page">
      <button className="back-button" onClick={goHome}>← Back to Brain City</button>
      <div className="quest-heading"><div className={`quest-district-icon ${district.color}`}><Icon name={district.icon} /></div><div><span className="eyebrow">{district.name}</span><h1>{stage === 'grown' ? `${district.building} upgraded!` : 'Think first. Grow stronger.'}</h1></div></div>
      {stage === 'grown' ? (
        <section className="growth-result">
          <div className={`upgrade-building ${district.color}`}><Icon name={district.icon} /><span>↑</span></div>
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
            <blockquote><strong>AI Coach</strong>{stage === 'think' ? content.think : 'I will guide your process, but the decision stays yours.'}</blockquote>
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

  useEffect(() => {
    localStorage.setItem('brain-builder-city', JSON.stringify(city))
    localStorage.setItem('brain-builder-xp', String(xp))
  }, [city, xp])

  const startQuest = (district: DistrictId) => {
    setActiveDistrict(district)
    setScreen('quests')
  }
  const completeQuest = (district: DistrictId, reward: number) => {
    setCity((current) => ({ ...current, [district]: Math.min(current[district] + 1, 5) }))
    setXp((current) => current + reward)
  }

  return (
    <div className="app">
      <Header xp={xp} />
      {screen === 'academy' && <Academy city={city} startQuest={startQuest} />}
      {screen === 'library' && <Library />}
      {screen === 'boss' && <Boss startQuest={() => undefined} />}
      {screen === 'quests' && <BrainQuest districtId={activeDistrict} onComplete={completeQuest} goHome={() => setScreen('academy')} />}
      <Nav screen={screen} onChange={setScreen} />
    </div>
  )
}

export default App
