'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setProgress(30);
      setLoading(true);
      try {
        const res = await fetch('/api/leaderboard?limit=50');
        const data = await res.json();
        const fetchedUsers: UserData[] = data.leaderboard || [];
        setUsers(fetchedUsers);
        setProgress(50);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
        setProgress(100);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <LoadingPage text='Getting Leaderboard...' progress={progress} />
  }

  return (
    <>
      <div className='absolute z-[-2] w-full min-h-screen bg-[linear-gradient(to_bottom,_#040B2A,_#051D5B)]'></div>
      <div className='absolute z-[-1] w-full min-h-screen opacity-20'>
        <Squares squareSize={125} speed={0.1} />
      </div>
      <div className="min-h-screen max-h-screen text-white relative p-2 sm:p-4 pt-0 overflow-hidden">
        <TopMenu text='Leaderboard' back='/menu' />

        <div className="flex flex-wrap justify-center gap-4 sm:gap-10 lg:gap-15 mb-4 sm:mb-20 lg:mb-20 xl:mb-40 scale-80 xl:scale-100">
          {[users[1], users[0], users[2]].filter(Boolean).map((user, index) => {
            let podiumMargin = '';
            if (index === 0) podiumMargin = 'mt-8 sm:mt-12';      
            if (index === 1) podiumMargin = 'mt-0';
            if (index === 2) podiumMargin = 'mt-12 sm:mt-20';

            return (
              <div key={user.username} className={`flex flex-col items-center ${podiumMargin} mx-2 sm:mx-4`}>
                <div
                  className="float relative flex flex-col items-center justify-center"
                  style={{ animationDelay: `${index * 0.3 + 0.15}s` }}
                >
                  <Image
                    src={user.avatarUrl || getRandomAvatar()}
                    alt="avatar"
                    width={80}
                    height={80}
                    className="w-14 h-14 sm:w-[80px] sm:h-[80px] object-cover shadow-[0_0_12px_3px_rgba(255,255,255,0.3)] mb-4 sm:mb-8"
                    draggable="false"
                  />
                  <div className="flex flex-col items-center">
                    <p className="text-sm sm:text-xl text-cyan-300 text-center font-semibold truncate max-w-[120px]">{user.username}</p>
                    <span className="text-base sm:text-2xl text-center mt-1">
                      {index === 1 && '🥇'}
                      {index === 0 && '🥈'}
                      {index === 2 && '🥉'}
                      {(user.rating ?? user.xpPoints ?? 0).toLocaleString()}
                    </span>
                  </div>
                  <Image
                    src="/glow_plate.png"
                    alt="glowPlate"
                    width={1250}
                    height={1060}
                    className="absolute mt-8 sm:mt-20 -ml-1 w-full h-auto scale-150 sm:scale-200"
                    draggable="false"
                  />
                </div>
              </div>
            );
          })}
        </div>


        {/* Table */}
        <div className="border border-cyan-300 text-[#48D3D6] mx-2 sm:mx-6 lg:mx-10 rounded-xl text-base sm:text-xl lg:text-2xl overflow-hidden shadow-[0_0_10px_#48D3D6]">
          <div className="max-h-[60vh] overflow-y-auto">
            <table className="w-full max-w-full text-left border-collapse">
              <thead className="bg-[#0F1635] sticky top-0 z-10 border-b border-cyan-300">
                <tr>
                  <th className="p-2 sm:p-3 text-center text-xs sm:text-base">RANK</th>
                  <th className="p-2 sm:p-3 text-center text-xs sm:text-base">USERNAME</th>
                  <th className="p-2 sm:p-3 text-center text-xs sm:text-base">RATING</th>
                  <th className="p-2 sm:p-3 text-center text-xs sm:text-base">CAMPAIGN LEVEL</th>
                  <th className="p-2 sm:p-3 text-center text-xs sm:text-base">WINS</th>
                  <th className="p-2 sm:p-3 text-center text-xs sm:text-base">LOSSES</th>
                </tr>
              </thead>
              <tbody className="bg-[#0F1635]">
                {users.map((user, index) => (
                  <tr key={user.username} className="hover:bg-[#182144] transition">
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-base">{index + 1}</td>
                    <td className="p-2 sm:p-3 text-center truncate max-w-[120px] text-xs sm:text-base">{user.username}</td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-base">{user.rating ?? user.xpPoints ?? 0}</td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-base">{user.campaignLevel ?? '-'}</td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-base">{user.wins ?? '-'}</td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-base">{user.losses ?? '-'}</td>
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
