import { useState } from 'react'

type Screen = 'academy' | 'quests' | 'boss' | 'library'

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

function Header() {
  return (
    <header className="topbar">
      <div className="brand">
        <img src={art.avatar} alt="" />
        <div><strong>HERO</strong><span>ACADEMY</span></div>
      </div>
      <div className="level-pill"><Icon name="✦" /><span>LEVEL 12</span><strong>450 XP</strong></div>
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

function Academy({ startQuest }: { startQuest: () => void }) {
  const sectors = [
    { icon: '◎', title: 'Memory Training', copy: 'Strengthen recall without shortcuts.', value: 75, tone: 'green' },
    { icon: '◇', title: 'Logic Drills', copy: 'Find the flaw. Explain your thinking.', value: 42, tone: 'blue' },
    { icon: '≡', title: 'Speed Reading', copy: 'Read with focus and understanding.', value: 90, tone: 'yellow' },
  ]
  return (
    <main className="page academy-page">
      <section className="hero-card">
        <div className="hero-copy">
          <span className="eyebrow">TODAY’S HERO MISSION</span>
          <h1>Train your brain.<br /><em>Own your answer.</em></h1>
          <p>Battle a deliberately flawed solution, repair the logic, and prove you can do it independently.</p>
          <button className="button button-gold" onClick={startQuest}>START LOGIC BATTLE <Icon name="ϟ" /></button>
          <small>3 rounds · About 8 minutes · +120 XP</small>
        </div>
        <div className="mentor-art">
          <span className="speech">Ready, recruit?</span>
          <img src={art.mentor} alt="Hero Academy mentor welcoming students" />
        </div>
      </section>

      <section className="section">
        <div className="section-heading"><div><span className="eyebrow">YOUR TRAINING</span><h2>Power-up sectors</h2></div><button className="text-button">View all →</button></div>
        <div className="sector-grid">
          {sectors.map((sector) => (
            <article className={`sector-card ${sector.tone}`} key={sector.title}>
              <div className="sector-icon"><Icon name={sector.icon} /></div>
              <span className="status-chip">{sector.value > 80 ? 'POWERED UP' : sector.value > 60 ? 'ON TRACK' : 'NEXT UP'}</span>
              <h3>{sector.title}</h3><p>{sector.copy}</p>
              <div className="progress-label"><span>Mastery</span><strong>{sector.value}%</strong></div>
              <div className="progress"><span style={{ width: `${sector.value}%` }} /></div>
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

function App() {
  const [screen, setScreen] = useState<Screen>('academy')
  return (
    <div className="app">
      <Header />
      {screen === 'academy' && <Academy startQuest={() => setScreen('quests')} />}
      {screen === 'library' && <Library />}
      {screen === 'boss' && <Boss startQuest={() => setScreen('quests')} />}
      {screen === 'quests' && <Academy startQuest={() => undefined} />}
      <Nav screen={screen} onChange={setScreen} />
    </div>
  )
}

export default App
