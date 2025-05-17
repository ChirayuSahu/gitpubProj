import React from 'react'
import Squares from '../Squares/Squares'

interface LoadingPageProps {
    text: string;
    progress: number;
}

const loadingTexts = ["Touch some grass. I'll be waiting.", "Pinky promise I’ll be done soon.", "I could be done if you stopped checking.", "Stop staring at me. I load slower under pressure.", "I’d be faster if you gave me white monster.", "I’m loading slower because I don’t like you btw.", "Maybe your wifi sucks, not me.", "Have you charged your laptop today?", "Keep tapping the screen. It's really helping.", "Waiting builds character."]

const LoadingPage: React.FC<LoadingPageProps> = ({ text, progress }) => {
    return (
        <>
            <Squares
                speed={0.2}
                squareSize={100}
                direction='diagonal'
                borderColor='#999'
                hoverFillColor=''
                className='absolute opacity-20 z-[1] bg-center'
            />
            <div className='absolute inset-0 z-0 h-screen w-screen bg-[url("/herobg.png")]'>

            </div>
            <div className='absolute inset-0 z-10 flex items-center justify-center h-screen w-screen'>
                <div className="flex flex-col items-start gap-4 w-1/2 max-w-lg">
                    <div className="text-4xl text-white">{text}</div>
                    <progress
                        className="w-full h-10 rounded-full [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-[#040482]"
                        value={progress}
                        max={100}
                    />
                    <p suppressHydrationWarning className="text-2xl text-white mt-8 text-center w-full">
                        {progress > 85 ? ("Almost there..." ) : (
                            loadingTexts[Math.floor(Math.random() * loadingTexts.length)]
                        )}
                    </p>
                </div>
            </div>



        </>
    )
}

export default LoadingPage