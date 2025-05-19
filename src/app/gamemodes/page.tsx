'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const GameModes = () => {
  return (
    <div className="min-h-screen bg-[url('/herobg.png')] bg-cover bg-center flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6">
        {/* CHAOS MODE */}
        <div className="bg-black/40 border-2 border-cyan-400 rounded-2xl w-[320px] h-[500px] flex flex-col justify-between items-center p-4 text-white shadow-xl hover:scale-105 transition-all duration-300">
          <div className="relative w-full h-full">
            <Link href="/courses">
            <Image
              src="/chaos_panel.png"
              alt="Chaos Mode"
              fill
              className="object-contain rounded-xl"
              priority
            /></Link>
          </div>
          <button className="w-full mt-4 bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xl py-3 rounded-xl transition-all duration-300">
            PLAY
          </button>
        </div>

        {/* CAMPAIGN MODE */}
        <div className="bg-black/40 border-2 border-cyan-400 rounded-2xl w-[320px] h-[500px] flex flex-col justify-between items-center p-4 text-white shadow-xl hover:scale-105 transition-all duration-300">
          <div className="relative w-full h-full">
            <Link href='/courses' className='cursor-pointer'>
            <Image
              src="/campaign_panel.png"
              alt="Campaign Mode"
              fill
              className="object-contain rounded-xl"
              priority
            /></Link>
          </div>
          <button  className="pointer-events-none w-full mt-4 bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xl py-3 rounded-xl transition-all duration-300">
            PLAY
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameModes;