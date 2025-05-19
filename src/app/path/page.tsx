'use client';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import React from 'react';

// Indices of completed levels
const completedLevels = [0, 1, 2];

const points = [
  { top: '4%', left: '42.5%', page: '/lesson1' },
  { top: '11.5%', left: '55%', page: '/lesson' },
  { top: '19.5%', left: '42.5%', page: '/lesson' },
  { top: '40.5%', left: '55%', page: '/lesson' },
  { top: '34.5%', left: '42.5%', page: '/lesson' },
  { top: '25.5%', left: '55%', page: '/lesson' },
  { top: '48.5%', left: '42.5%', page: '/lesson' },
  { top: '71.5%', left: '55%', page: '/lesson' },
  { top: '63%', left: '42.5%', page: '/lesson' },
  { top: '56.5%', left: '55%', page: '/lesson' },
  { top: '79%', left: '42.5%', page: '/lesson' },
  { top: '86.5%', left: '55%', page: '/lesson' },
];

export default function CurvedPathPage() {
  const router = useRouter();

  return (
    <div className="bg-[url('/herobg.png')] bg-center bg-cover overflow-auto">
      <div className="relative h-[2000px] overflow-visible">

        {/* SVG Glowing Curved Path */}
        <svg className="absolute top-0 left-200 -translate-x-1/2 w-[400px] h-full pointer-events-none z-0"
        viewBox="0 0 400 2000"
        preserveAspectRatio="xMidYMid meet">
          <path
            d="M 200 0 
              C 0 150, 400 150, 200 300
              C 0 450, 400 450, 200 600
              C 0 750, 400 750, 200 900
              C 0 1050, 400 1050, 200 1200
              C 0 1350, 400 1350, 200 1500
              C 0 1650, 400 1650, 200 1800"
            stroke="#00FFFF"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            className="animate-pulse"
          />
        </svg>

        <svg className="absolute top-0 left-150 -translate-x-1/2 w-[400px] h-full pointer-events-none z-0"
        viewBox="0 0 400 2000"
        preserveAspectRatio="xMidYMid meet">
          <path
            d="M 200 0 
              C 0 150, 400 150, 200 300
              C 0 450, 400 450, 200 600
              C 0 750, 400 750, 200 900
              C 0 1050, 400 1050, 200 1200
              C 0 1350, 400 1350, 200 1500
              C 0 1650, 400 1650, 200 1800"
            stroke="#00FFFF"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            className="animate-pulse"
          />
        </svg>

        {/* Star Buttons */}
        {points.map((point, index) => {
          const isCompleted = completedLevels.includes(index);
          const isSpecial = index === 3; // Fourth one red

          return (
            <button
              key={index}
              onClick={() => router.push(point.page)}
              className={`absolute w-14 h-14 flex items-center justify-center rounded-full border-2 shadow-lg transition-all duration-300 z-10
                ${isCompleted ? 'bg-cyan-500 hover:scale-110 border-cyan-300' :
                  isSpecial ? 'bg-red-600 hover:bg-red-400 hover:scale-110 border-red-300' :
                  'bg-transparent border-cyan-300 hover:bg-cyan-700'}
                ${!isCompleted && !isSpecial ? 'text-cyan-300 hover:text-white hover:scale-110' : 'text-white'}
              `}
              style={{
                top: point.top,
                left: point.left,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Star className="w-6 h-6" />
            </button>
          );
        })}
      </div>
    </div>
  );
}