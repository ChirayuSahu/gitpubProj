"use client"
import React from 'react'
import Link from 'next/link'
import { House, Cog, ArrowLeft } from 'lucide-react'

type TopMenuProps = {
    back: string;
    text: string
}

const TopMenu = ({ back, text }: TopMenuProps) => {
    return (
        <>
            <div className="flex justify-between items-center mb-4 mt-8 m-10">
                <div className='flex items-center gap-8'>
                    <Link href={back} className="text-cyan-400 font-bold">
                        <ArrowLeft className='w-4 lg:w-4 xl:w-4 2xl:w-6' strokeWidth={3} />
                    </Link>
                    <h1 className="text-cyan-400 text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold">{text}</h1>
                </div>
                <div className="flex gap-4 text-cyan-400 xl:text-xl">
                    <Cog className='w-4 lg:w-4 xl:w-4 2xl:w-6' strokeWidth={3} />
                    <Link href="/">
                        <House className='w-4 lg:w-4 xl:w-4 2xl:w-6' strokeWidth={3} />
                    </Link>
                </div>
            </div>
        </>
    )
}

export default TopMenu