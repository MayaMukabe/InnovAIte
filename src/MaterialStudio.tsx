import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, BookOpen, Check, FileText, GraduationCap, Upload, X } from 'lucide-react'

type StudySet = {
  id: string
  title: string
  sourceType: string
  cards: Array<{ id: string; idea: string }>
  questions: Array<{ id: string; prompt: string; choices: string[]; source: string }>
}

type StudioMode = 'learn' | 'assess'

export default function MaterialStudio({ onReward }: { onReward: (xp: number) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [sets, setSets] = useState<StudySet[]>([])
  const [active, setActive] = useState<StudySet | null>(null)
  const [mode, setMode] = useState<StudioMode>('learn')
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState<number | null>(null)
  const [result, setResult] = useState<{ correct: boolean; source: string } | null>(null)
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  const [rewarded, setRewarded] = useState<string[]>(() => JSON.parse(localStorage.getItem('brain-builder-material-rewards') ?? '[]') as string[])

  useEffect(() => {
    fetch('/api/materials')
      .then((response) => response.ok ? response.json() as Promise<StudySet[]> : Promise.reject())
      .then(setSets)
      .catch(() => setStatus('Start the Brain Builder API to upload and reopen study sets.'))
  }, [])

  const upload = async () => {
    if (!file) return
    setBusy(true); setStatus('Spark is finding the key ideas…')
    try {
      const form = new FormData()
      form.append('material', file)
      const response = await fetch('/api/materials', { method: 'POST', body: form })
      const payload = await response.json() as StudySet & { error?: string }
      if (!response.ok) throw new Error(payload.error || 'Upload could not be processed.')
      setSets((current) => [payload, ...current.filter((set) => set.id !== payload.id)])
      setFile(null); setStatus(`${payload.title} is ready to learn and assess.`)
      open(payload, 'learn')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Upload could not be processed.')
    } finally {
      setBusy(false)
    }
  }

  const open = (set: StudySet, nextMode: StudioMode) => {
    setActive(set); setMode(nextMode); setIndex(0); setAnswer(null); setResult(null)
  }

  const check = async () => {
    if (!active || answer === null) return
    setBusy(true)
    try {
      const response = await fetch(`/api/materials/${active.id}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: active.questions[index].id, answer }),
      })
      const payload = await response.json() as { correct: boolean; source: string; error?: string }
      if (!response.ok) throw new Error(payload.error)
      setResult(payload)
    } catch {
      setStatus('The assessment service is unavailable. Your place is saved.')
    } finally {
      setBusy(false)
    }
  }

  const nextQuestion = () => {
    if (!active) return
    if (index < active.questions.length - 1) {
      setIndex((current) => current + 1); setAnswer(null); setResult(null)
    } else {
      const earnsReward = !rewarded.includes(active.id)
      if (earnsReward) {
        const nextRewarded = [...rewarded, active.id]
        setRewarded(nextRewarded)
        localStorage.setItem('brain-builder-material-rewards', JSON.stringify(nextRewarded))
        onReward(40)
      }
      setStatus(`${active.title} assessment complete${earnsReward ? ' · +40 XP' : ' · Practice replayed'}`)
      setActive(null)
    }
  }

  return (
    <section className="section material-studio">
      <div className="studio-heading"><div><span className="studio-kicker">YOUR MATERIAL → ACTIVE LEARNING</span><h2>Material Studio</h2><p>Upload teacher-approved notes. Spark grounds every card and question in your source.</p></div><div className="supported-files"><FileText /><span>TXT · MD · PDF</span><small>5 MB maximum</small></div></div>
      <div className="upload-workbench">
        <label className={file ? 'has-file' : ''}><Upload /><strong>{file ? file.name : 'Choose a note or material'}</strong><span>{file ? `${Math.ceil(file.size / 1024)} KB · Ready` : 'Drop in a readable TXT, Markdown, or PDF'}</span><input type="file" accept=".txt,.md,.markdown,.pdf,text/plain,text/markdown,application/pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></label>
        <button className="studio-upload-button" onClick={upload} disabled={!file || busy}>{busy ? <span className="spinner" /> : <GraduationCap />}{busy ? 'BUILDING STUDY SET…' : 'TURN INTO A STUDY SET'}</button>
      </div>
      {status && <div className="studio-status" role="status"><span>✦</span>{status}</div>}
      {sets.length > 0 && <div className="study-set-grid">{sets.map((set) => <article key={set.id}><div className="set-icon"><BookOpen /></div><div><span>{set.sourceType.includes('pdf') ? 'PDF MATERIAL' : 'PERSONAL NOTES'}</span><h3>{set.title}</h3><p>{set.cards.length} key ideas · {set.questions.length} grounded questions</p></div><div><button onClick={() => open(set, 'learn')}>LEARN</button><button onClick={() => open(set, 'assess')}>ASSESS</button></div></article>)}</div>}

      {active && <div className="studio-backdrop" role="dialog" aria-modal="true" aria-label={`${active.title} ${mode} mode`}><article className="study-player"><header><button onClick={() => setActive(null)}><X /></button><div><span>{mode === 'learn' ? 'LEARN MODE' : 'ASSESS MODE'} · {active.title}</span><strong>{index + 1} / {mode === 'learn' ? active.cards.length : active.questions.length}</strong></div><i><b style={{ width: `${(index + 1) / (mode === 'learn' ? active.cards.length : active.questions.length) * 100}%` }} /></i></header>
        {mode === 'learn' ? <div className="learn-player"><span className="source-label">KEY IDEA FROM YOUR MATERIAL</span><BookOpen /><p>{active.cards[index].idea}</p><div><button disabled={index === 0} onClick={() => setIndex((current) => current - 1)}><ArrowLeft /> Previous</button>{index === active.cards.length - 1 ? <button className="primary" onClick={() => open(active, 'assess')}>ASSESS ME <GraduationCap /></button> : <button className="primary" onClick={() => setIndex((current) => current + 1)}>Next idea <ArrowRight /></button>}</div></div>
        : <div className="assess-player"><span className="source-label">GROUNDED CHECK</span><h2>{active.questions[index].prompt}</h2><div className="material-answers">{active.questions[index].choices.map((choice, choiceIndex) => <button className={answer === choiceIndex ? 'selected' : ''} disabled={result !== null} onClick={() => setAnswer(choiceIndex)} key={choice}><span>{String.fromCharCode(65 + choiceIndex)}</span>{choice}</button>)}</div>{result ? <div className={result.correct ? 'source-result correct' : 'source-result'}><Check /><div><strong>{result.correct ? 'Evidence matched!' : 'Recheck the source evidence'}</strong><p>“{result.source}”</p></div><button onClick={nextQuestion}>{index === active.questions.length - 1 ? 'FINISH' : 'NEXT'} <ArrowRight /></button></div> : <button className="check-material-button" disabled={answer === null || busy} onClick={check}>CHECK AGAINST MY MATERIAL</button>}</div>}
      </article></div>}
    </section>
  )
}
