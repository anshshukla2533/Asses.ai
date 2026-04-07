import React, { useEffect, useState } from 'react'

function App() {
  const [health, setHealth] = useState(null)
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const healthResponse = await fetch('http://127.0.0.1:8000/health')
        const summaryResponse = await fetch('http://127.0.0.1:8000/api/platform-summary')

        const healthData = await healthResponse.json()
        const summaryData = await summaryResponse.json()

        setHealth(healthData)
        setSummary(summaryData)
      } catch (error) {
        setHealth({ status: 'offline', redis: 'disconnected' })
        setSummary({
          name: 'asses.ai',
          features: [
            'Resume Analysis',
            'Profile Scraping',
            'Voice Interaction',
            'Structured Interview Flow'
          ],
          rounds: [
            'Introduction and self-presentation',
            'Core CS concepts',
            'Algorithmic coding questions'
          ]
        })
      }

      setLoading(false)
    }

    loadData()
  }, [])

  return (
    <div className="min-h-screen app-shell">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="hero-panel rounded-3xl p-8">
          <p className="section-tag">Mock Interview Platform</p>
          <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
            {summary ? summary.name : 'asses.ai'}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-200">
            Practice structured interviews with resume-aware context, technical rounds, and voice-ready workflows.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="info-card rounded-2xl p-5">
              <p className="card-label">Backend status</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {loading ? 'Loading...' : health?.status}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Redis: {loading ? 'Checking...' : health?.redis}
              </p>
            </div>

            <div className="info-card rounded-2xl p-5">
              <p className="card-label">Interview flow</p>
              <p className="mt-2 text-sm text-slate-300">
                Introduction, fundamentals, and coding rounds aligned with the README goals.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="content-panel rounded-3xl p-6">
            <h2 className="text-2xl font-semibold text-white">Core features</h2>
            <div className="mt-4 space-y-3">
              {(summary?.features || []).map((item) => (
                <div key={item} className="list-row rounded-2xl px-4 py-3 text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="content-panel rounded-3xl p-6">
            <h2 className="text-2xl font-semibold text-white">Interview rounds</h2>
            <div className="mt-4 space-y-3">
              {(summary?.rounds || []).map((item, index) => (
                <div key={item} className="list-row rounded-2xl px-4 py-3 text-slate-200">
                  <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/20 text-sm font-semibold text-cyan-200">
                    {index + 1}
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
