'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import LoadingPage from '@/components/custom/loadingPage';
import Squares from '@/components/Squares/Squares';
import { hardcodedUsers, getRandomAvatar } from './leaderboard.helpers';
import TopMenu from '@/components/custom/topMenu';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/leaderboard?limit=50');
        const data = await res.json();
        let fetchedUsers: UserData[] = data.leaderboard || [];

        fetchedUsers = fetchedUsers.map(user =>
          user.username === 'devansharora18'
            ? { ...user, rating: 99999 }
            : user
        );

        const combinedUsers = [...fetchedUsers, ...hardcodedUsers];

        combinedUsers.sort((a, b) =>
          (b.rating ?? b.xpPoints ?? 0) - (a.rating ?? a.xpPoints ?? 0)
        );

        setUsers(combinedUsers);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingPage text='Getting Leaderboard...' progress={100} />
  }

  return (
    <>
      <div className='absolute z-[-2] w-full min-h-screen bg-[linear-gradient(to_bottom,_#040B2A,_#051D5B)]'></div>
      <div className='absolute z-[-1] w-full min-h-screen opacity-20'>
        <Squares
          squareSize={125}
          speed={0.1}
        />
      </div>
      <div className="min-h-screen max-h-screen text-white relative p-4 pt-0 overflow-hidden">
        <TopMenu text='Leaderboard' back='/menu'/>

        <div className="flex justify-center gap-15 mb-40 scale-120">
          {[users[1], users[0], users[2]].filter(Boolean).map((user, index) => {
            const trueIndex = [1, 0, 2][index];
            const baseClasses = `flex flex-col items-center mb-20 mt-15 mx-4 ${trueIndex === 0 ? 'scale-100' : trueIndex === 1 ? 'mt-25' : trueIndex === 2 ? 'scale-100 mt-30' : 'scale-100'
              }`;

            return (
              <div key={user.username} className={baseClasses}>
                <div
                  className="float relative flex flex-col items-center justify-center"
                  style={{ animationDelay: `${index * 0.3 + 0.15}s` }}
                >
                  <Image
                    src={user.avatarUrl || getRandomAvatar()}
                    alt="avatar"
                    width={80}
                    height={80}
                    className="w-[80px] h-[80px] object-cover shadow-[0_0_12px_3px_rgba(255,255,255,0.3)] mb-8"
                  />

                  <div className="flex flex-col items-center">
                    <p className="text-xl text-cyan-300 text-center font-semibold">{user.username}</p>
                    <span className="text-2xl text-center mt-1">
                      {trueIndex === 0 && '🥇'}
                      {trueIndex === 1 && '🥈'}
                      {trueIndex === 2 && '🥉'}
                      {(user.rating ?? user.xpPoints ?? 0).toLocaleString()}
                    </span>
                  </div>

                  <Image
                    src="/glow_plate.png"
                    alt="glowPlate"
                    width={1250}
                    height={1060}
                    className="absolute mt-20 -ml-1 w-full h-auto scale-200"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="border border-cyan-300 text-[#48D3D6] mx-10 rounded-xl text-2xl overflow-hidden shadow-[0_0_10px_#48D3D6]">
          <div className="h-[60vh] overflow-y-auto">
            <table className="min-w-full text-left border-collapse">
              <thead className="bg-[#0F1635] sticky top-0 z-10 border-b border-cyan-300">
                <tr>
                  <th className="p-3 text-center">RANK</th>
                  <th className="p-3 text-center">USERNAME</th>
                  <th className="p-3 text-center">RATING</th>
                  <th className="p-3 text-center">CAMPAIGN LEVEL</th>
                  <th className="p-3 text-center">WINS</th>
                  <th className="p-3 text-center">LOSSES</th>
                </tr>
              </thead>
              <tbody className="bg-[#0F1635]">
                {users.map((user, index) => (
                  <tr key={user.username} className="hover:bg-[#182144] transition">
                    <td className="p-3 text-center">{index + 1}</td>
                    <td className="p-3 text-center">{user.username}</td>
                    <td className="p-3 text-center">{user.rating ?? user.xpPoints ?? 0}</td>
                    <td className="p-3 text-center">{user.campaignLevel ?? '-'}</td>
                    <td className="p-3 text-center">{user.wins ?? '-'}</td>
                    <td className="p-3 text-center">{user.losses ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;