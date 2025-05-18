// src/app/pvp/[roomId]/page.tsx
"use client"

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { usePvpRoomLogic } from './pvpRoom.logic'
import Editor from '@monaco-editor/react'

export default function PvpRoomPage() {
  const { roomId } = useParams<{ roomId: string }>()
  if (!roomId) return <div>❌ Invalid room</div>
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') return <p>Loading session...</p>
  if (!session?.user) return <p>Not logged in</p>

  const username = session.user.name
  const rp = session.user.xp
  const leagueName = searchParams.get('league') || 'Byte'

  const {
    code,
    setCode,
    output,
    runInSandbox,
    handleSubmit,
    handleSabotage,
    canSabotage,
    matchTime,
    editorLocked,
    league,
    sabotaged,
    iframeRef
  } = usePvpRoomLogic({ roomId, router, username, rp, leagueName })

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-4">
      <h1 className="text-2xl font-bold text-yellow-400">🔥 PvP Chaos Match</h1>
      <p>Room: {roomId}</p>
      <p>League: {league.name} | Time: {matchTime}s / {league.time}s</p>

      {sabotaged && (
        <div className="bg-red-600 text-white p-3 rounded text-center font-bold">
          {
            sabotaged === "opponent"
              ? "🧨 You were sabotaged by your opponent!"
              : "💥 Chaos took over your own code!"
          }
        </div>
      )}

      <Editor
        height="40vh"
        defaultLanguage="python"
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
