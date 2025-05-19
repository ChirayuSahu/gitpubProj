'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface UserData {
  username: string;
  rating?: number;
  xpPoints?: number;
  campaignLevel?: number;
  wins?: number;
  losses?: number;
  avatarUrl?: string;
}

const Leaderboard = () => {
  const [users, setUsers] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/leaderboard?limit=50');
        const data = await res.json();
        if (data.leaderboard) {
          setUsers(data.leaderboard);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0E37] text-white relative p-4">
        <div className="flex items-center gap-4 mb-6 ml-4">
        <Link href="/" className="text-cyan-400 text-xl font-bold">
              <Image
                src="/back.png"
                alt="Back"
                style={{ width: '60px', height: '44px' }}
                className="cursor-pointer"
                width={34}
                height={34}
              />
            </Link>
      <h1 className="text-5xl font-bold text-blue-300 text-left ml-4 mb-6">LEADERBOARD</h1></div>
  
      {/* Top 3 */}
      <div className="flex justify-center gap-10 mb-10">
        {users.slice(0, 3).map((user, index) => (
          <div key={user.username} className={`flex flex-col items-center ${index === 0 ? 'scale-110' : ''}`}>
            <div className="relative flex flex-col items-center">
              <Image
                src={user.avatarUrl || '/default-avatar.png'}
                alt="avatar"
                width={80}
                height={80}
                className="w-[80px] h-[80px] object-cover border-2 border-cyan-400 shadow-[0_0_12px_3px_rgba(0,255,255,0.6)] mb-8"
              />
              <Image
                src="/glow_plate.png"
                alt="glowPlate"
                width={1250}
                height={1060}
                className="absolute -bottom-6 w-full h-auto"
              />
            </div>
            <p className="text-xl mt-8 text-cyan-300 font-semibold">{user.username.toUpperCase()}</p>
            <span className="text-2xl">{index === 0 && '🥇'}
            {index === 1 && '🥈'}
            {index === 2 && '🥉'}
            {(user.rating ?? user.xpPoints ?? 0).toLocaleString()}</span>
          </div>
        ))}
      </div>  

      {/* Scrollable Table */}
      <div className="overflow-x-auto border border-blue-300 rounded-xl text-2xl">
        <table className="table-auto w-full text-left border-collapse">
          <thead className="bg-[#0F1635] text-blue-200">
            <tr>
              <th className="p-3">RANK</th>
              <th className="p-3">USERNAME</th>
              <th className="p-3">RATING</th>
              <th className="p-3">CAMPAIGN LEVEL</th>
              <th className="p-3">WINS</th>
              <th className="p-3">LOSSES</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.username} className="border-t border-blue-900 hover:bg-[#182144] transition">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.rating ?? user.xpPoints ?? 0}</td>
                <td className="p-3">{user.campaignLevel ?? '-'}</td>
                <td className="p-3">{user.wins ?? '-'}</td>
                <td className="p-3">{user.losses ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;