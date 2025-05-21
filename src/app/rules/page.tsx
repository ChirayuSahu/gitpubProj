"use client"

import React, { useState } from 'react'
import Squares from '@/components/Squares/Squares'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

const RulesPage = () => {

    const searchParams = useSearchParams()
    const redirect = searchParams.get('r')
    const[isChecked, setIsChecked] = useState(false)
    const router = useRouter()


    return (
        <>
            <div className='absolute z-0 min-h-screen w-full bg-[linear-gradient(to_bottom,_#040B2A,_#051D5B,_#040B2A)]'></div>
            <div className='absolute z-10 min-h-screen w-full opacity-20'>
                <Squares
                    squareSize={125}
                    speed={0.1}
                />
            </div>
            <div className='absolute z-20 w-full min-h-screen flex items-center justify-center'>
                <div className='max-h-150 2xl:min-h-180 min-w-[95vw] border-2 rounded-3xl border-[#0635DC] shadow-[0_0_10px_#4324CD] bg-[#000928]'>
                    <div className='flex flex-col max-h-150 2xl:min-h-180 justify-between gap-10 p-10 w-full h-full'>
                        <div>

                            <h1 className='text-5xl text-cyan-400 font-bold mb-10'>RULES:</h1>
                            <div className='flex flex-col text-white text-xl xl:text-xl 2xl:text-3xl leading-loose space-y-4 transition-all duration-300'>
                                <div>
                                    <p>1. Function names must remain <span className='text-cyan-300 font-semibold'>unchanged</span>.</p>
                                    <p>2. Do <span className='text-red-400 font-semibold'>not</span> add any <code className='text-yellow-300'>console.log</code>, <code className='text-yellow-300'>print</code>, or debug statements.</p>
                                    <p>3. Do <span className='text-red-400 font-semibold'>not</span> delete any existing lines of code.</p>
                                    <p>4. Keep the <span className='text-cyan-300'>import/export</span> structure exactly the same.</p>
                                    <p>5. Variable names <span className='text-green-400 font-semibold'>can</span> be changed—make them meaningful.</p>
                                    <p>6. Final code must be <span className='text-cyan-300'>syntactically valid</span> and functional.</p>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-10'>
                            { redirect && (
                            <label className="flex items-center text-cyan-300 text-2xl gap-3 cursor-pointer">
                                <input onClick={() => setIsChecked(prev => !prev)} type="checkbox" className="w-6 h-6 accent-yellow-400" />
                                I have read the rules
                            </label>
                            ) }
                            <button onClick={()=>{router.push( redirect ? `/campaign/${redirect}` : `/dashboard` )}} disabled={!isChecked} className={`px-6 py-4 border-4 font-bold bg-[#000928] border-yellow-400 text-yellow-300 rounded hover:bg-yellow-400 hover:text-black text-xl xl:text-2xl transition-all duration-300 ${!isChecked ? `cursor-not-allowed` : `cursor-pointer`}`}>
                                CONTINUE
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RulesPage