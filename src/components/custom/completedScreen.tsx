'use client'

import React from 'react'
import { useEffect, useState } from 'react';
import Squares from '../Squares/Squares'
import Image from 'next/image';
import Link from 'next/link';

type CompletedScreenProps = {
    currentXp: number;
    nextTierXp: number;
    xpIncrease?: number;
}

const CompletedScreen = ({ currentXp, nextTierXp, xpIncrease }: CompletedScreenProps) => {

    const [xp, setXp] = useState(currentXp);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setXp(currentXp + (xpIncrease || 0));
        }, 200);

        return () => clearTimeout(timeout);
    }, [currentXp, xpIncrease]);

    const percentFilled = 100;

    return (
        <>
            <div className='absolute z-0 h-screen w-full bg-[#011037]'></div>
            <div className='absolute z-10 opacity-20'>
                <Squares
                    speed={0.1}
                    squareSize={125}
                />
            </div>
            <div className='absolute z-10 inset-0 flex justify-center items-center'>
                <div className='flex flex-col gap-6 items-center justify-center'>
                    <h1 className='text-7xl text-[#49D8E9] font-bold'>LEVEL COMPLETE</h1>
                    <div className='flex items-center justify-center gap-2 w-full'>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Image
                                key={i}
                                src="/star.png"
                                alt="Star"
                                width={70}
                                height={70}
                                draggable={false}
                            />
                        ))}
                    </div>
                    <p className='text-6xl text-[#49D8E9] mt-2'>+{xpIncrease} Ratings</p>
                    <div className='relative flex items-center justify-between bg-[#000928] px-6 py-4 rounded-4xl w-[30vw] shadow-[0_0_20px_#49D8E9] border border-cyan-400'>
                        <div className="relative flex-1 h-15 rounded-4xl overflow-hidden">
                            <div
                                className="h-full bg-[#49D8E9] transition-all duration-[2000ms]"
                                style={{ width: `${percentFilled}%` }}
                            />
                            <p className='absolute inset-0 flex items-center justify-center text-4xl text-[#ffffff] font-bold z-10'>
                                {xp} / {nextTierXp} XP
                            </p>
                        </div>
                    </div>
                    <Link href="/menu">
                    <button className="px-6 py-4 border-4 font-bold bg-[#000928] border-yellow-400 text-yellow-300 rounded hover:bg-yellow-400 hover:text-black text-7xl transition">
                        CONTINUE
                    </button>
                    </Link>


                </div>
            </div>
        </>
    )
}

export default CompletedScreen