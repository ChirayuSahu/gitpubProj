'use client';
import { useRouter } from 'next/navigation';
import React from "react";
import TopMenu from '@/components/custom/topMenu';

const Dashboard = () => {
  const router = useRouter();

  const handleGameClick = () => {
    router.push('/gamemodes');
  };

  const handleLeadClick = () => {
    router.push('/leaderboard');
  };

  const handleDashClick = () => {
    router.push('/dashboard');
  };

  const handleAboutClick = () => {
    router.push('/about');
  };

  return (
    <>
      <div className='absolute w-[100vw]' ><TopMenu text='Menu' back='/'/></div>
    <div className="min-h-screen bg-[url('/herobg.png')] bg-cover flex flex-col items-center justify-center space-y-6">
      <button
        onClick={handleGameClick}
        className="px-16 py-8 min-w-100 text-5xl drop-shadow-[0_0_7px_#49D8E9] cursor-pointer font-bold text-cyan-300 bg-[#020B32] border-2 border-cyan-400 rounded-xl shadow-md hover:scale-105 transition-all duration-300"
      >
        GAME MODES
      </button>
      <button
        onClick={handleLeadClick}
        className="px-16 py-8 min-w-100 text-5xl drop-shadow-[0_0_7px_#49D8E9] cursor-pointer font-bold text-cyan-300 bg-[#020B32] border-2 border-cyan-400 rounded-xl shadow-md hover:scale-105 transition-all duration-300">
        LEADERBOARD
      </button>
      <button
        onClick={handleDashClick}
        className="px-16 py-8 min-w-100 text-5xl drop-shadow-[0_0_7px_#49D8E9] cursor-pointer font-bold text-cyan-300 bg-[#020B32] border-2 border-cyan-400 rounded-xl shadow-md hover:scale-105 transition-all duration-300">
        DASHBOARD
      </button>
      <button
        onClick={handleAboutClick}
        className="px-16 py-8 min-w-100 text-5xl drop-shadow-[0_0_7px_#49D8E9] cursor-pointer font-bold text-cyan-300 bg-[#020B32] border-2 border-cyan-400 rounded-xl shadow-md hover:scale-105 transition-all duration-300">
        ABOUT US
      </button>
    </div>
    </>
  );
};

export default Dashboard;