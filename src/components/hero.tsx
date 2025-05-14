import React from 'react'
import Button from './custom/button'
import AnimatedCard from './animatedCards'
import Image from 'next/image'

const Hero = () => {

    return (
        <>
            <AnimatedCard />
            <div className='min-h-screen bg-[url("/herobg.png")] bg-center'>
                <div className='absolute flex justify-center w-full h-full backdrop-blur-xs'>
                    <div className='flex flex-col gap-20 justify-center m-20'>
                        <h1 className={`text-[#24F2F4] text-8xl font-bold text-center text-shadow-lg/20`}>CodeClash <p>Arena</p></h1>
                        <div className='flex justify-center'>
                            <Button className='px-12 py-4 text-xl'>Start Clashing</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Hero