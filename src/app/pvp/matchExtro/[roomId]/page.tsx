'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface MatchResult {
  winner: string;
  player1: string;
  player2: string;
  player1XP: number;
  player2XP: number;
  timeStarted: string;
  timeEnded: string;
  code1?: string;
  code2?: string;
}

export default function MatchExtroPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const [match, setMatch] = useState<MatchResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMatchResult() {
      try {
        const res = await fetch(`/api/pvp/result/${roomId}`)
        const data = await res.json()
        setMatch(data)
      } catch (err) {
        console.error("❌ Failed to load match result:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMatchResult()
  }, [roomId])

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex justify-center items-center">Loading match result...</div>
  }

  if (!match) {
    return <div className="min-h-screen bg-black text-white flex justify-center items-center">❌ Match not found</div>
  }

  const won = match.winner === match.player1

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-4">
      <h1 className="text-3xl font-bold text-yellow-400">🏁 Match Complete</h1>
      <p className="text-lg">Room ID: {roomId}</p>
      <p>Winner: <span className="text-green-400">{match.winner}</span></p>
      <p>{match.player1}: {match.player1XP >= 0 ? `+${match.player1XP}` : match.player1XP} XP</p>
      <p>{match.player2}: {match.player2XP >= 0 ? `+${match.player2XP}` : match.player2XP} XP</p>

      <div className="mt-6">
        <h2 className="text-xl font-bold text-blue-400">Match Duration</h2>
        <p>
          {new Date(match.timeStarted).toLocaleTimeString()} → {new Date(match.timeEnded).toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}