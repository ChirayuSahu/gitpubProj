'use client';
import { useRouter } from 'next/navigation';
import React from "react";
import Image from 'next/image';

const Menu = () => {
    const router = useRouter();

    const handleClick = () => {
        router.push('/gamemodes');
    };

    return (
        <>
            <div className='flex flex-col'>
                <div className="flex justify-start w-full">
                    <button onClick={()=>(router.back())} >

                    <Image
                        src="/back.png"
                        alt="Back"
                        width={50}
                        height={50}
                        className="absolute top-4 left-4 cursor-pointer"
                        />
                        </button>
                </div>
                <div className="min-h-screen bg-[url('/herobg.png')] bg-cover flex flex-col items-center justify-center space-y-6">
                    <button
                        onClick={handleClick}
                        className="px-16 py-8 text-4xl font-bold text-cyan-300 bg-[#020B32] w-[30vw] xl:w-[20vw] border-2 border-cyan-400 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_#22d3ee] hover:shadow-[0_0_40px_#22d3ee]"
                    >
                        GAME MODES
                    </button>
                    <button className="px-16 py-8 text-4xl font-bold text-cyan-300 bg-[#020B32] w-[30vw] xl:w-[20vw] border-2 border-cyan-400 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_#22d3ee] hover:shadow-[0_0_40px_#22d3ee]">
                        LEADERBOARD
                    </button>
                    <button className="px-16 py-8 text-4xl font-bold text-cyan-300 bg-[#020B32] w-[30vw] xl:w-[20vw] border-2 border-cyan-400 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_#22d3ee] hover:shadow-[0_0_40px_#22d3ee]">
                        DASHBOARD
                    </button>
                    <button className="px-16 py-8 text-4xl font-bold text-cyan-300 bg-[#020B32] w-[30vw] xl:w-[20vw] border-2 border-cyan-400 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_#22d3ee] hover:shadow-[0_0_40px_#22d3ee]">
                        ABOUT US
                    </button>
                </div>
            </div>
        </>
    );
};

export default Menu;