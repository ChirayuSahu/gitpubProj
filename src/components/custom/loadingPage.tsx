import React from 'react'
import Squares from '../Squares/Squares'

interface LoadingPageProps {
    text: string;
    progress: number;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ text, progress }) => {
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
            <div className="absolute inset-0 z-10 flex items-center justify-center h-screen w-screen">
                <div className="flex flex-col items-start gap-4 w-1/2">
                    <div className="text-4xl">{text}</div>
                    <progress
                        className="w-full h-4 [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-[#040482] rounded-full"
                        value={progress}
                        max={100}
                    />
                </div>
            </div>



        </>
    )
}

export default LoadingPage