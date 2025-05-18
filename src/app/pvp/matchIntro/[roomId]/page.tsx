'use client'

import { useSearchParams, useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import io from 'socket.io-client'

const socket = io('http://localhost:4000')

export default function MatchIntroPage() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const { roomId } = useParams<{ roomId: string }>()
  const router = useRouter()

  const [isReady, setIsReady] = useState(false)

  // ✅ Fallback logic: query param → session → default
  const username = searchParams.get('username') || session?.user?.name || 'Player_Test'
  const rp = parseInt(searchParams.get('rp') || '500')
  const league = searchParams.get('league') || 'Byte'

  useEffect(() => {
    if (roomId && username) {
      socket.emit('joinRoom', { roomId, username })
    }
  }, [roomId, username])

  const handleStartMatch = () => {
    setIsReady(true)
    setTimeout(() => {
      router.push(`/pvp/${roomId}?username=${encodeURIComponent(username)}&league=${encodeURIComponent(league)}&rp=${rp}`)
    }, 1500)
  }

  if (status === 'loading') return <p className="text-white">Loading session...</p>

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center space-y-6">
      <h1 className="text-3xl font-bold text-yellow-400">🎮 Match Lobby</h1>
      <p className="text-lg text-gray-300">Room ID: <span className="text-green-400">{roomId}</span></p>
      <p className="text-sm text-gray-400">Username: {username} | RP: {rp} | League: {league}</p>

      <button
        onClick={handleStartMatch}
        className="bg-yellow-400 text-black px-6 py-2 rounded font-bold mt-4 hover:bg-yellow-500"
      >
        🚀 Start Match
      </button>

      {isReady && (
        <p className="text-sm text-green-400">Starting match...</p>
      )}
    </div>
  )
}