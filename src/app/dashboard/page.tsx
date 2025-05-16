'use client';
import { useRouter } from 'next/navigation';
import React from "react";

const Dashboard = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/gamemodes');
  };

  return (
    <div className="min-h-screen bg-[url('/herobg.png')] bg-cover flex flex-col items-center justify-center space-y-6">
      <button
        onClick={handleClick}
        className="px-16 py-8 text-3xl font-bold text-cyan-300 bg-black border-2 border-cyan-400 rounded-xl shadow-md hover:scale-105 transition-all duration-300"
      >
        GAME MODES
      </button>
      <button className="px-16 py-8 text-3xl font-bold text-cyan-300 bg-black border-2 border-cyan-400 rounded-xl shadow-md hover:scale-105 transition-all duration-300">
        LEADERBOARD
      </button>
      <button className="px-16 py-8 text-3xl font-bold text-cyan-300 bg-black border-2 border-cyan-400 rounded-xl shadow-md hover:scale-105 transition-all duration-300">
        DASHBOARD
      </button>
      <button className="px-16 py-8 text-3xl font-bold text-cyan-300 bg-black border-2 border-cyan-400 rounded-xl shadow-md hover:scale-105 transition-all duration-300">
        ABOUT US
      </button>
    </div>
  );
};

export default Dashboard;