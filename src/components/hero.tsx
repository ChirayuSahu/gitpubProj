"use client"

import React from 'react'
import Button from './custom/button'
import AnimatedCard from './animatedCards'
import RotatingText from '@/components/RotatingText/RotatingText'
import { useSession } from 'next-auth/react'
import Link from 'next/link'


const Hero = () => {

    const { data: session } = useSession()

    return (
        <>
            <AnimatedCard />
            <div className='min-h-screen bg-[url("/herobg.png")] bg-center'>
                <div className='absolute flex justify-center w-full h-full backdrop-blur-xs'>
                    <div className='flex flex-col gap-10 lg:gap-15 justify-center m-20'>
                        <h1 className={`text-[#24F2F4] text-5xl lg:text-6xl xl:text-7xl font-bold text-center text-shadow-lg/20`}>CodeClash <p>Arena</p></h1>
                        <div className='text-2xl sm:text-3xl flex gap-2 justify-center items-center'>
                            <h1 className='font-bold text-center text-white text-shadow-lg/20'>Let&apos;s</h1>
                            <RotatingText
                                texts={['Clash', 'Code', 'Conquer']}
                                mainClassName="leading-none py-0 text-[#24F2F4] overflow-hidden flex items-center"
                                staggerFrom={"last"}
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "-120%" }}
                                staggerDuration={0.025}
                                splitLevelClassName="overflow-hidden"
                                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                                rotationInterval={2000}
                            />
                        </div>
                        <div className='flex justify-center'>
                            <Link
                            href={session ? '/menu' : '/signup'}
                            >
                            <Button className='px-4 py-2 text-md lg:text-xl lg:px-6 lg:py-4 xl:text-2xl cursor-pointer'>Start Clashing</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Hero