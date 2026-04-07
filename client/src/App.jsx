import { useEffect, useState } from 'react'

function App() {
  const [health, setHealth] = useState(null)
  const [summary, setSummary] = useState(null)
  const [interviewModules, setInterviewModules] = useState(null)
  const [capabilities, setCapabilities] = useState(null)
  const [generatedQuestions, setGeneratedQuestions] = useState('')
  const [questionSource, setQuestionSource] = useState(null)
  const [customResumePath, setCustomResumePath] = useState('')
  const [customGithubDetails, setCustomGithubDetails] = useState('')
  const [customLeetcodeDetails, setCustomLeetcodeDetails] = useState('')
  const [backgroundSummary, setBackgroundSummary] = useState('')
  const [questionLoading, setQuestionLoading] = useState(false)
  const [resumeAnalysis, setResumeAnalysis] = useState(null)
  const [chatHistory, setChatHistory] = useState(null)
  const [sessionStatus, setSessionStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const healthResponse = await fetch('http://127.0.0.1:8000/health')
        const summaryResponse = await fetch('http://127.0.0.1:8000/api/platform-summary')
        const interviewModulesResponse = await fetch('http://127.0.0.1:8000/api/interview-modules')
        const capabilitiesResponse = await fetch('http://127.0.0.1:8000/api/capabilities')
        const generatedQuestionsResponse = await fetch('http://127.0.0.1:8000/api/generate-questions')
        const resumeAnalysisResponse = await fetch('http://127.0.0.1:8000/api/resume-analysis')
        const chatHistoryResponse = await fetch('http://127.0.0.1:8000/api/chat-history')
        const sessionStatusResponse = await fetch('http://127.0.0.1:8000/api/session-status')

        const healthData = await healthResponse.json()
        const summaryData = await summaryResponse.json()
        const interviewModulesData = await interviewModulesResponse.json()
        const capabilitiesData = await capabilitiesResponse.json()
        const generatedQuestionsData = await generatedQuestionsResponse.json()
        const resumeAnalysisData = await resumeAnalysisResponse.json()
        const chatHistoryData = await chatHistoryResponse.json()
        const sessionStatusData = await sessionStatusResponse.json()

        setHealth(healthData)
        setSummary(summaryData)
        setInterviewModules(interviewModulesData)
        setCapabilities(capabilitiesData)
        setGeneratedQuestions(generatedQuestionsData.questions)
        setQuestionSource(generatedQuestionsData.profileSource)
        setResumeAnalysis(resumeAnalysisData)
        setChatHistory(chatHistoryData)
        setSessionStatus(sessionStatusData)
      } catch {
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
        setInterviewModules({
          modules: [
            {
              id: 'intro',
              title: 'Introduction round',
              order: 1,
              description: 'Candidate introduction and conversational warm-up.'
            },
            {
              id: 'core-cs',
              title: 'Core CS concepts',
              order: 2,
              description: 'Fundamental OOP and DBMS discussion.'
            },
            {
              id: 'coding',
              title: 'Algorithmic coding round',
              order: 3,
              description: 'Problem-solving questions based on candidate profile context.'
            }
          ]
        })
        setCapabilities({
          resumeFileAvailable: false,
          redisConnected: false,
          githubScrapingAvailable: false,
          leetcodeScrapingAvailable: false,
          voiceSupportAvailable: false
        })
        setGeneratedQuestions('Unable to generate interview questions right now.')
        setQuestionSource(null)
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

  const handleCustomQuestionGeneration = async () => {
    setQuestionLoading(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/generate-questions/custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resumePath: customResumePath || null,
          githubDetails: customGithubDetails ? [customGithubDetails] : null,
          leetcodeDetails: customLeetcodeDetails || null,
          backgroundSummary: backgroundSummary || null
        })
      })

      const data = await response.json()
      setGeneratedQuestions(data.questions)
      setQuestionSource(data.profileSource)
    } catch {
      setGeneratedQuestions('Unable to generate custom interview questions right now.')
      setQuestionSource(null)
    }

    setQuestionLoading(false)
  }

  const handleClearCustomInputs = () => {
    setCustomResumePath('')
    setCustomGithubDetails('')
    setCustomLeetcodeDetails('')
    setBackgroundSummary('')
  }

  const githubProjects = resumeAnalysis?.githubDetails || []
  const modules = interviewModules?.modules || []
  const capabilityItems = [
    { label: 'Resume file', value: capabilities?.resumeFileAvailable },
    { label: 'Redis connection', value: capabilities?.redisConnected },
    { label: 'GitHub scraping', value: capabilities?.githubScrapingAvailable },
    { label: 'LeetCode scraping', value: capabilities?.leetcodeScrapingAvailable },
    { label: 'Voice support', value: capabilities?.voiceSupportAvailable }
  ]
  const leetcodeTopics = resumeAnalysis?.leetcodeDetails?.tagProblemCounts?.fundamental || []
  const introMessages = chatHistory?.intro || []
  const technicalMessages = chatHistory?.technical || []
  const healthClassName =
    health?.status === 'ok'
      ? 'status-pill status-pill-ok'
      : health?.status === 'degraded'
        ? 'status-pill status-pill-degraded'
        : 'status-pill status-pill-offline'

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
              <p className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${healthClassName}`}>
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
            <h2 className="text-2xl font-semibold text-white">Interview modules</h2>
            <div className="mt-4 space-y-3">
              {modules.map((item) => (
                <div key={item.id} className="list-row rounded-2xl px-4 py-3 text-slate-200">
                  <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/20 text-sm font-semibold text-cyan-200">
                    {item.order}
                  </span>
                  <span className="font-semibold text-white">{item.title}</span> - {item.description}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="content-panel rounded-3xl p-6">
            <h2 className="text-2xl font-semibold text-white">Custom question input</h2>
            <div className="mt-4 space-y-4">
              <input
                className="input-area w-full rounded-2xl px-4 py-3 text-slate-100"
                type="text"
                placeholder="Optional local resume path, for example C:\\Users\\name\\resume.pdf"
                value={customResumePath}
                onChange={(event) => setCustomResumePath(event.target.value)}
              />
              <textarea
                className="input-area w-full rounded-2xl px-4 py-3 text-slate-100"
                rows="4"
                placeholder="Paste GitHub project summary or repository details"
                value={customGithubDetails}
                onChange={(event) => setCustomGithubDetails(event.target.value)}
              />
              <textarea
                className="input-area w-full rounded-2xl px-4 py-3 text-slate-100"
                rows="4"
                placeholder="Paste LeetCode stats or coding profile details"
                value={customLeetcodeDetails}
                onChange={(event) => setCustomLeetcodeDetails(event.target.value)}
              />
              <textarea
                className="input-area w-full rounded-2xl px-4 py-3 text-slate-100"
                rows="3"
                placeholder="Add a short background summary"
                value={backgroundSummary}
                onChange={(event) => setBackgroundSummary(event.target.value)}
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  className="action-button rounded-2xl px-4 py-3 text-sm font-semibold text-slate-950"
                  onClick={handleCustomQuestionGeneration}
                  disabled={questionLoading}
                >
                  {questionLoading ? 'Generating...' : 'Generate custom questions'}
                </button>
                <button
                  type="button"
                  className="secondary-button rounded-2xl px-4 py-3 text-sm font-semibold text-slate-100"
                  onClick={handleClearCustomInputs}
                  disabled={questionLoading}
                >
                  Clear inputs
                </button>
              </div>
            </div>
          </div>

          <div className="content-panel rounded-3xl p-6">
            <h2 className="text-2xl font-semibold text-white">Generated interview questions</h2>
            <div className="mt-4 space-y-3">
              <div className="list-row rounded-2xl px-4 py-3 text-slate-200">
                Source: {loading || questionLoading ? 'Checking...' : questionSource?.usedResumePath ? `Resume path (${questionSource.resumePath})` : 'Direct pasted profile data'}
              </div>
              <div className="list-row rounded-2xl px-4 py-3 text-slate-200">
                Inputs used: {loading || questionLoading ? 'Checking...' : [
                  questionSource?.usedGithubDetails ? 'GitHub details' : null,
                  questionSource?.usedLeetcodeDetails ? 'LeetCode details' : null,
                  questionSource?.usedBackgroundSummary ? 'Background summary' : null
                ].filter(Boolean).join(', ') || 'None'}
              </div>
              <div className="list-row rounded-2xl px-4 py-3 whitespace-pre-line text-slate-200">
                {loading || questionLoading ? 'Generating questions...' : generatedQuestions}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="content-panel rounded-3xl p-6">
            <h2 className="text-2xl font-semibold text-white">Platform capabilities</h2>
            <div className="mt-4 space-y-3">
              {capabilityItems.map((item) => (
                <div key={item.label} className="list-row flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-slate-200">
                  <span>{item.label}</span>
                  <span className={`status-pill px-3 py-1 text-sm font-semibold ${loading ? 'status-pill-offline' : item.value ? 'status-pill-ok' : 'status-pill-offline'}`}>
                    {loading ? 'Checking...' : item.value ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              ))}
            </div>
          </div>

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
