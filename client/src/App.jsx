import React, { useEffect, useState } from 'react'

function App() {
  const [health, setHealth] = useState(null)
  const [summary, setSummary] = useState(null)
  const [resumeAnalysis, setResumeAnalysis] = useState(null)
  const [chatHistory, setChatHistory] = useState(null)
  const [sessionStatus, setSessionStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const healthResponse = await fetch('http://127.0.0.1:8000/health')
        const summaryResponse = await fetch('http://127.0.0.1:8000/api/platform-summary')
        const resumeAnalysisResponse = await fetch('http://127.0.0.1:8000/api/resume-analysis')
        const chatHistoryResponse = await fetch('http://127.0.0.1:8000/api/chat-history')
        const sessionStatusResponse = await fetch('http://127.0.0.1:8000/api/session-status')

        const healthData = await healthResponse.json()
        const summaryData = await summaryResponse.json()
        const resumeAnalysisData = await resumeAnalysisResponse.json()
        const chatHistoryData = await chatHistoryResponse.json()
        const sessionStatusData = await sessionStatusResponse.json()

        setHealth(healthData)
        setSummary(summaryData)
        setResumeAnalysis(resumeAnalysisData)
        setChatHistory(chatHistoryData)
        setSessionStatus(sessionStatusData)
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
        setResumeAnalysis({
          githubDetails: [],
          leetcodeDetails: {}
        })
        setChatHistory({
          intro: [],
          technical: []
        })
        setSessionStatus({
          resumeAvailable: false,
          introMessages: 0,
          technicalMessages: 0,
          hasInterviewData: false
        })
      }

      setLoading(false)
    }

    loadData()
  }, [])

  const githubProjects = resumeAnalysis?.githubDetails || []
  const leetcodeTopics = resumeAnalysis?.leetcodeDetails?.tagProblemCounts?.fundamental || []
  const introMessages = chatHistory?.intro || []
  const technicalMessages = chatHistory?.technical || []

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

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="content-panel rounded-3xl p-6">
            <h2 className="text-2xl font-semibold text-white">Session readiness</h2>
            <div className="mt-4 space-y-3">
              <div className="list-row rounded-2xl px-4 py-3 text-slate-200">
                Resume available: {loading ? 'Checking...' : sessionStatus?.resumeAvailable ? 'Yes' : 'No'}
              </div>
              <div className="list-row rounded-2xl px-4 py-3 text-slate-200">
                Intro messages stored: {loading ? 'Checking...' : sessionStatus?.introMessages}
              </div>
              <div className="list-row rounded-2xl px-4 py-3 text-slate-200">
                Technical messages stored: {loading ? 'Checking...' : sessionStatus?.technicalMessages}
              </div>
              <div className="list-row rounded-2xl px-4 py-3 text-slate-200">
                Interview data ready: {loading ? 'Checking...' : sessionStatus?.hasInterviewData ? 'Yes' : 'No'}
              </div>
            </div>
          </div>

          <div className="content-panel rounded-3xl p-6">
            <h2 className="text-2xl font-semibold text-white">Resume GitHub analysis</h2>
            <div className="mt-4 space-y-3">
              {githubProjects.length === 0 && (
                <div className="list-row rounded-2xl px-4 py-3 text-slate-200">
                  {loading ? 'Loading project data...' : 'No GitHub repository details found in the sample resume.'}
                </div>
              )}

              {githubProjects.map((item, index) => (
                <div key={index} className="list-row rounded-2xl px-4 py-3 text-slate-200">
                  {item[0] || 'Repository description unavailable'}
                </div>
              ))}
            </div>
          </div>

          <div className="content-panel rounded-3xl p-6">
            <h2 className="text-2xl font-semibold text-white">LeetCode topic snapshot</h2>
            <div className="mt-4 space-y-3">
              {leetcodeTopics.length === 0 && (
                <div className="list-row rounded-2xl px-4 py-3 text-slate-200">
                  {loading ? 'Loading coding profile...' : 'No LeetCode topic data found in the sample resume.'}
                </div>
              )}

              {leetcodeTopics.slice(0, 5).map((item) => (
                <div key={item.tagSlug} className="list-row rounded-2xl px-4 py-3 text-slate-200">
                  {item.tagName} - {item.problemsSolved} solved
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="content-panel rounded-3xl p-6">
            <h2 className="text-2xl font-semibold text-white">Introduction chat history</h2>
            <div className="mt-4 space-y-3">
              {introMessages.length === 0 && (
                <div className="list-row rounded-2xl px-4 py-3 text-slate-200">
                  {loading ? 'Loading intro chat...' : 'No introduction chat history found yet.'}
                </div>
              )}

              {introMessages.slice(-4).map((item, index) => (
                <div key={index} className="list-row rounded-2xl px-4 py-3 text-slate-200">
                  <span className="font-semibold text-cyan-200">{item.user || 'User'}:</span> {item.message}
                </div>
              ))}
            </div>
          </div>

          <div className="content-panel rounded-3xl p-6">
            <h2 className="text-2xl font-semibold text-white">Technical chat history</h2>
            <div className="mt-4 space-y-3">
              {technicalMessages.length === 0 && (
                <div className="list-row rounded-2xl px-4 py-3 text-slate-200">
                  {loading ? 'Loading technical chat...' : 'No technical chat history found yet.'}
                </div>
              )}

              {technicalMessages.slice(-4).map((item, index) => (
                <div key={index} className="list-row rounded-2xl px-4 py-3 text-slate-200">
                  <span className="font-semibold text-cyan-200">{item.user || 'User'}:</span> {item.message}
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
