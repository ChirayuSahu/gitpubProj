'use client';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import React from 'react';

const points = [
  { top: '5%', left: '10%', page: '/lesson1' },
  { top: '15%', left: '30%', page: '/lesson2' },
  { top: '25%', left: '20%', page: '/lesson3' },
  { top: '35%', left: '40%', page: '/lesson4' },
  { top: '45%', left: '50%', page: '/lesson5' },
  { top: '55%', left: '60%', page: '/lesson6' },
  { top: '65%', left: '50%', page: '/lesson7' },
  { top: '75%', left: '30%', page: '/lesson8' },
  { top: '85%', left: '40%', page: '/lesson9' },
];

export default function CurvedPathPage() {
  const router = useRouter();

  return (
    <>
      <div className="bg-[url('/herobg.png')] bg-center bg-cover">
        <div className="relative min-h-screen bg-black overflow-hidden">

          {/* SVG glowing sine wave path */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
            <path
              d="M 600 0 C 300 100, 100 200, 300 300
                S 100 500, 300 600
                S 100 800, 300 900"
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
              className="absolute bg-cyan-700 hover:bg-cyan-500 text-white rounded-full w-14 h-14 flex items-center justify-center border-2 border-cyan-300 shadow-lg hover:scale-110 transition-all duration-300 z-10"
              style={{ top: point.top, left: point.left, transform: 'translate(-50%, -50%)' }}
            >
              <Star className="w-6 h-6" />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}