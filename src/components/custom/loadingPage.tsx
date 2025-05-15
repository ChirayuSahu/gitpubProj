import React from 'react'
import Squares from '../Squares/Squares'

interface LoadingPageProps {
  text: string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ text }) => {
    return (
        <>
                <Squares
                    speed={0.2}
                    squareSize={70}
                    direction='diagonal'
                    borderColor='#fff'
                    hoverFillColor='#222'
                    className='opacity-20 z-0 bg-[#1259d4]'
                />
            <div className='absolute z-10 h-screen w-screen text-7xl flex items-center justify-center'>
                {text}
            </div>
        </>
    )
}

export default LoadingPage