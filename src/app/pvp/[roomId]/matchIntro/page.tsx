'use client'

import { useSearchParams, useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import io from 'socket.io-client'

const socket = io('http://localhost:4000')

export default function MatchIntroPage() {
  const { data: session, status } = useSession()
  const { roomId } = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isReady, setIsReady] = useState(false)

  // Optional fallback (in case user is not logged in)
  if (status === 'loading') return <p>Loading session...</p>
  if (!session?.user) return <p className="text-red-500">❌ Not logged in</p>

  const username = session.user.name || 'Player_Anon'
  const rp = parseInt(searchParams.get('rp') || '0')

  useEffect(() => {
    socket.emit('joinRoom', { roomId, username })
  }, [roomId, username])

  const handleStartMatch = () => {
    setIsReady(true)
    setTimeout(() => {
      router.push(`/pvp/${roomId}`)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center space-y-6">
      <h1 className="text-3xl font-bold text-yellow-400">🎮 Match Lobby</h1>
      <p className="text-lg text-gray-300">Room ID: <span className="text-green-400">{roomId}</span></p>
      <p className="text-sm text-gray-400">Username: {username} | RP: {rp}</p>

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