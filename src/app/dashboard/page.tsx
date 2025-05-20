'use client'

import React, { useEffect, useState } from 'react'
import Squares from '@/components/Squares/Squares'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { getLeague } from './dashboard.helpers'
import { AnimatedProgressBar } from '@/components/custom/progressBar'
import { Clock5 } from 'lucide-react'
import LoadingPage from '@/components/custom/loadingPage'


const DashboardPage = () => {

    const [user, setUser] = useState<any>(null)
    const [league, setLeague] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true)
            try {

                const res = await fetch(`/api/me`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                const data = await res.json();

                if (!res.ok) {
                    toast.error(data.message)
                }

                setUser(data);
                setLeague(getLeague(data?.xpPoints));


            } catch (error: any) {
                toast.error(error.message)
            } finally {
                setLoading(false)
            }
        }


        fetchUser();
    }, [])

    if (loading) {
        return <LoadingPage text='Fetching...' progress={100} />
    }

    return (
        <>
            <div className='absolute z-0 w-full min-h-screen bg-[#040B2A]'></div>
            <div className='absolute z-10 w-full min-h-screen opacity-20'>
                <Squares
                    squareSize={125}
                    speed={0.1}
                />
            </div>
            <div className='absolute z-20 w-full min-h-screen flex-col items-center justify-center'>
                <div className="flex justify-between items-center mb-4 m-10">
                    <div className='flex items-center gap-4'>
                        <Link href="/campaign" className="text-cyan-400 text-xl font-bold">
                            <Image
                                src="/back.png"
                                alt="Back"
                                style={{ width: '40px', height: '34px' }}
                                className="cursor-pointer"
                                width={24}
                                height={24}
                            />
                        </Link>
                        <h1 className="text-cyan-400 text-5xl font-bold">DASHBOARD</h1>
                    </div>
                    <div className="flex gap-4 text-cyan-400 text-xl">
                        <Image
                            src="/gear.png"
                            alt="Settings"
                            style={{ width: '44px', height: '44px' }}
                            className="cursor-pointer"
                            width={24}
                            height={24}
                        />
                        <Link href="/">
                            <Image
                                src="/home.png"
                                alt="Home"
                                style={{ width: '44px', height: '44px' }}
                                className="cursor-pointer"
                                width={24}
                                height={24}
                            />
                        </Link>
                    </div>
                </div>
                <div className='grid grid-cols-11 grid-rows-2 gap-15 m-10'>
                    <div className='w-full col-span-2 row-span-2 bg-[#000928] rounded-4xl drop-shadow-[0_0_10px_#4324CD] flex items-center justify-center'>
                    </div>
                    <div
                        className="relative col-span-5 row-span-1 rounded-lg shadow-lg flex items-center justify-center"
                        style={{
                            backgroundColor: league?.bgColor,
                            boxShadow: `0 0 10px ${league?.cardShadowColor}, 0 0 20px ${league?.cardShadowColor}`,
                        }}
                    >
                        <div className="absolute top-1/2 left-1/3 transform -translate-x-1/3 -translate-y-1/2 flex flex-col gap-4 items-center justify-center z-10">
                            <Image
                                src={league?.icon || `https://placehold.co/600x600/${league?.bgColor}/FFFFFF.png`}
                                alt="League Icon"
                                width={1000}
                                height={1000}
                                className="w-50 h-50"
                            />
                            <AnimatedProgressBar
                                start={league?.start}
                                end={league?.end}
                                current={user?.xpPoints}
                                color={league?.barColor}
                                glowColor={league?.barGlowColor}
                                barBackgroundColor={league?.barBg}
                            />
                            <h1 className="text-3xl" style={{ color: league?.barColor }}>
                                {user?.xpPoints} / {league?.end}
                            </h1>
                        </div>
                        <Image
                            src={league?.human || "/byte/human.png"}
                            alt="League Human"
                            width={1000}
                            height={2000}
                            className="absolute -top-8 -right-20 w-[32vh]"
                        />
                    </div>

                    <div className='col-span-4 row-span-1 bg-[#000116] rounded-lg shadow-lg flex flex-col items-center justify-center drop-shadow-[0_0_10px_#4324CD]'>
                        <h1 className='text-cyan-400 text-3xl font-bold mb-10'>ACHIEVEMENTS</h1>
                        <div className='flex items-center justify-center gap-20'>
                            <Image
                            src={'/achievements/ac1.png'}
                            alt="Achievement 1"
                            width={1000}
                            height={1000}
                            className="w-40 h-40"
                            />
                            <Image
                            src={'/achievements/ac2.png'}
                            alt='Achievement 2'
                            width={1000}
                            height={1000}
                            className='w-40 h-40'
                            />
                        </div>
                    </div>
                    <div className='col-span-5 max-h-[37vh] custom-scrollbar-1 overflow-auto row-span-1 bg-[#000928] rounded-lg shadow-lg flex flex-col items-center justify-center p-8 drop-shadow-[0_0_10px_#4324CD]'>
                        <h1 className='text-cyan-400 text-3xl font-bold mb-10'>MATCH HISTORY</h1>
                        <div className='flex flex-col gap-6 w-full'>
                            <div className='px-6 bg-[#541916] text-[#FF8F00] drop-shadow-[0_0_7px_#9B3E00] flex items-center justify-between w-full rounded-lg shadow-lg p-4'>
                                <h1 className='text-xl'>VS PLAYER 1</h1>
                                <div className='flex items-center gap-10'>
                                    <div className='flex items-center gap-2'>
                                        <h1 className='text-xl'>1:20</h1>
                                        <Clock5 className='text-[#FF8F00]' />
                                    </div>
                                    <h1 className='text-xl'>-50</h1>
                                </div>
                            </div>
                            <div className='px-6 text-cyan-400 flex items-center justify-between w-full bg-[#000928] drop-shadow-[0_0_7px_#4324CD] rounded-lg shadow-lg p-4'>
                                <h1 className='text-xl'>VS PLAYER 3</h1>
                                <div className='flex items-center gap-10'>
                                    <div className='flex items-center gap-2'>
                                        <h1 className='text-xl'>0:22</h1>
                                        <Clock5 className='text-cyan-400' />
                                    </div>
                                    <h1 className='text-xl'>+50</h1>
                                </div>
                            </div>
                            <div className='px-6 text-cyan-400 flex items-center justify-between w-full bg-[#000928] drop-shadow-[0_0_7px_#4324CD] rounded-lg shadow-lg p-4'>
                                <h1 className='text-xl'>VS PLAYER 4</h1>
                                <div className='flex items-center gap-10'>
                                    <div className='flex items-center gap-2'>
                                        <h1 className='text-xl'>1:07</h1>
                                        <Clock5 className='text-cyan-400' />
                                    </div>
                                    <h1 className='text-xl'>+100</h1>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="relative col-span-4 row-span-1 bg-[#0A1B3D] rounded-lg shadow-lg flex drop-shadow-[0_0_7px_#4324CD] flex-col items-center justify-between p-10 overflow-hidden">
                        <div className="absolute inset-0 bg-cover scale-150 opacity-50 " style={{ backgroundImage: 'url("/dashimage.png")' }}></div>
                        <h1 className='text-cyan-400 text-3xl font-bold'>CAMPAIGN PROGRESS</h1>
                        <div className='flex flex-col gap-6'>
                            <div className='relative w-80'>
                                <AnimatedProgressBar
                                    start={0}
                                    end={6}
                                    current={2}
                                    color={"#49D8E9"}
                                    glowColor={"#49D8E9"}
                                    barBackgroundColor={"#000928"}
                                />
                                <h1 className='absolute right-4 top-1 text-cyan-400'>2/6</h1>
                            </div>
                            <h1 className='text-cyan-400 text-5xl font-bold text-center'>LEVEL 2</h1>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardPage