'use client';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import React from 'react';

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
        <svg className="absolute top-0 left-200 -translate-x-1/2 w-[400px] h-full pointer-events-none z-0">
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

        <svg className="absolute top-0 left-150 -translate-x-1/2 w-[400px] h-full pointer-events-none z-0">
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
        {points.map((point, index) => (
          <button
            key={index}
            onClick={() => router.push(point.page)}
            className={`absolute ${index === 3 ? 'bg-red-600 hover:bg-red-400 border-red-300' : 'bg-cyan-700 hover:bg-cyan-500 border-cyan-300'} text-white rounded-full w-14 h-14 flex items-center justify-center border-2 shadow-lg hover:scale-110 transition-all duration-300 z-10`}
            style={{ top: point.top, left: point.left, transform: 'translate(-50%, -50%)' }}
          >
            <Star className="w-6 h-6" />
          </button>
        ))}
      </div>
    </div>
  );
}