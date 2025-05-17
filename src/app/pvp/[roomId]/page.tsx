"use client"

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import io from 'socket.io-client'
import Editor from '@monaco-editor/react'

const socket = io('http://localhost:4000')

function getLeague(rp: number) {
  if (rp < 200) return { name: 'Byte', time: 120, difficulty: 'Easy', win: 50, loss: -50 }
  if (rp < 500) return { name: 'Kilobyte', time: 120, difficulty: 'Easy', win: 50, loss: -50 }
  if (rp < 1000) return { name: 'Megabyte', time: 180, difficulty: 'Medium', win: 50, loss: -50 }
  if (rp < 2000) return { name: 'Gigabyte', time: 300, difficulty: 'Hard', win: 100, loss: -100 }
  return { name: 'Terabyte', time: 300, difficulty: 'Hard', win: 100, loss: -100 }
}

function getLeagueWindows(name: string) {
  if (name === 'Byte' || name === 'Kilobyte') {
    return {
      chaosStart: 30, chaosEnd: 90,
      sabotageWindows: [{ start: 60, end: 100 }],
      maxSabotageUses: 1
    }
  }
  if (name === 'Megabyte') {
    return {
      chaosStart: 30, chaosEnd: 145,
      sabotageWindows: [{ start: 115, end: 155 }],
      maxSabotageUses: 1
    }
  }
  if (name === 'Gigabyte' || name === 'Terabyte') {
    return {
      chaosStart: 45, chaosEnd: 240,
      sabotageWindows: [
        { start: 105, end: 150 },
        { start: 210, end: 255 }
      ],
      maxSabotageUses: 2
    }
  }
  return { chaosStart: 30, chaosEnd: 90, sabotageWindows: [], maxSabotageUses: 1 }
}

export default function PvpRoomPage() {
  const { roomId } = useParams()
  const router = useRouter()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const updateTimerRef = useRef<NodeJS.Timeout | null>(null) // ✅ Correct placement

  const [code, setCode] = useState('// Write your solution here\nfunction solve() {\n  console.log("Hello!")\n}')
  const [output, setOutput] = useState('')
  const [matchTime, setMatchTime] = useState(0)
  const [canSabotage, setCanSabotage] = useState(false)
  const [manualUsed, setManualUsed] = useState(0)
  const [isChaosActive, setIsChaosActive] = useState(false)
  const [chaosIntervalId, setChaosIntervalId] = useState<NodeJS.Timeout | null>(null)
  const [editorLocked, setEditorLocked] = useState(false)
  const [sabotaged, setSabotaged] = useState(false)



  import { useSession } from 'next-auth/react'
  const { data: session, status } = useSession()
  if (status === 'loading') return <p>Loading session...</p>
  if (!session?.user) return <p>Not logged in</p>

  const username = session.user.name
  const rp = session.user.xp


  const league = getLeague(rp)
  const windows = getLeagueWindows(league.name)
  const level = ['Byte', 'Kilobyte', 'Megabyte', 'Gigabyte', 'Terabyte'].indexOf(league.name) + 1

  const runInSandbox = () => {
    const iframe = iframeRef.current
    if (!iframe) return

    const codeToRun = `
      try {
        const logs = [];
        const originalLog = console.log;
        console.log = (...args) => logs.push(args.join(" "));
        ${code}
        parent.postMessage({ type: 'sandboxResult', logs }, '*');
      } catch (e) {
        parent.postMessage({ type: 'sandboxResult', logs: ['Error: ' + e.message] }, '*');
      }
    `

    const blob = new Blob([`<script>${codeToRun}<\/script>`], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    iframe.src = url
  }

  useEffect(() => {
    window.addEventListener('message', (event: MessageEvent) => {
      if (event.data?.type === 'sandboxResult') {
        setOutput(event.data.logs.join('\n'))
      }
    })
  }, [])

  useEffect(() => {
    socket.emit('joinRoom', { roomId, username })
    console.log(`Joined room: ${roomId}`)
  }, [roomId])

  useEffect(() => {
    const matchTimer = setInterval(() => setMatchTime(prev => prev + 1), 1000)
    return () => clearInterval(matchTimer)
  }, [])

  useEffect(() => {
    if (matchTime === windows.chaosStart) {
      const interval = setInterval(() => {
        socket.emit('autoSabotage', { roomId, level })
      }, 25000)
      setChaosIntervalId(interval)
      setIsChaosActive(true)
    }

    if (matchTime === windows.chaosEnd && chaosIntervalId) {
      clearInterval(chaosIntervalId)
      setIsChaosActive(false)
    }

    if (matchTime >= league.time && !editorLocked) {
      handleSubmit()
      setEditorLocked(true)
    }

    const inWindow = windows.sabotageWindows.some(({ start, end }) =>
      matchTime >= start && matchTime <= end && manualUsed < windows.maxSabotageUses
    )
    setCanSabotage(inWindow)
  }, [matchTime])

  useEffect(() => {
    socket.on('receiveSabotage', ({ chaos }) => {
      console.log('🧨 Sabotage received! Updating code...')
      setCode(chaos)
      setSabotaged(true)
      setTimeout(() => setSabotaged(false), 5000)
    })
    return () => {
      socket.off('receiveSabotage')
    }
  }, [])

  useEffect(() => {
    socket.emit("updateCode", { roomId, code })
  }, [code])

  const handleSabotage = () => {
    if (!canSabotage || manualUsed >= windows.maxSabotageUses) return
    socket.emit('sendSabotage', { roomId, level })
    setManualUsed(prev => prev + 1)
    setCanSabotage(false)
  }

  const handleSubmit = () => {
    runInSandbox()
    setManualUsed(windows.maxSabotageUses)
    setTimeout(() => router.push(`/pvp/results/${roomId}`), 3000)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-4">
      <h1 className="text-2xl font-bold text-yellow-400">🔥 PvP Chaos Match</h1>
      <p>Room: {roomId}</p>
      <p>League: {league.name} | Time: {matchTime}s / {league.time}s</p>

      {sabotaged && (
        <div className="bg-red-600 text-white p-3 rounded text-center font-bold">
          🧨 You were sabotaged by your opponent!
        </div>
      )}

      <Editor
        height="40vh"
        defaultLanguage="javascript"
        theme="vs-dark"
        value={code}
        onChange={(val) => !editorLocked && setCode(val || '')}
        options={{
          fontSize: 16,
          minimap: { enabled: false },
          automaticLayout: true,
          readOnly: editorLocked,
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          wrappingIndent: 'same',
        }}
      />

      <div className="flex gap-4">
        <button onClick={runInSandbox} className="bg-yellow-400 text-black px-6 py-2 font-bold rounded">▶️ Run Code</button>
        <button onClick={handleSubmit} className="bg-green-500 px-6 py-2 font-bold rounded">✅ Submit</button>
        <button
          onClick={handleSabotage}
          disabled={!canSabotage}
          className={`px-6 py-2 font-bold rounded ${canSabotage ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 cursor-not-allowed'}`}
        >
          🧨 Sabotage
        </button>
      </div>

      <pre className="bg-gray-900 p-4 rounded text-green-400 font-mono min-h-[100px] whitespace-pre-wrap">{output}</pre>
      <iframe ref={iframeRef} id="sandbox-frame" title="sandbox" sandbox="allow-scripts" className="hidden" />
    </div>
  )
}
