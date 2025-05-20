'use client';

import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import LoadingPage from '@/components/custom/loadingPage';

const points = [
  { top: 'top-[3rem]', left: 'left-[38vw]', page: '6829860450e43d23d5b1538a' },
  { top: 'top-[12rem]', left: 'left-[53vw]', page: '6829861350e43d23d5b1538f' },
  { top: 'top-[22rem]', left: 'left-[38vw]', page: '6829863750e43d23d5b15394' },
  { top: 'top-[31rem]', left: 'left-[53vw]', page: '6829865650e43d23d5b15399' },
  { top: 'top-[40.5rem]', left: 'left-[38vw]', page: '6829866a50e43d23d5b1539e' },
  { top: 'top-[49.5rem]', left: 'left-[53vw]', page: '682986a850e43d23d5b153a3' },
  { top: 'top-[59.5rem]', left: 'left-[38vw]', page: '6829cedfa94ace1cc63e7128' },
  { top: 'top-[68.5rem]', left: 'left-[53vw]', page: '6829cef7a94ace1cc63e712e' },
  { top: 'top-[78rem]', left: 'left-[38vw]', page: '6829cf45a94ace1cc63e713c' },
  { top: 'top-[87rem]', left: 'left-[53vw]', page: '6829cf5ca94ace1cc63e7142' },
  { top: 'top-[96.75rem]', left: 'left-[38vw]', page: '6829cf74a94ace1cc63e7148' },
  { top: 'top-[106rem]', left: 'left-[53vw]', page: '6829cf89a94ace1cc63e714d' },
];

export default function CurvedPathPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [completedLevels, setCompletedLevels] = useState<string[]>([]);

  useEffect(() => {

    const getCompletedLevels = async () => {
      try {

        const res = await fetch(`/api/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await res.json();

        console.log(data);
        setCompletedLevels(data.challenges);
      } catch (error: any) {
        toast.error(error)
      } finally {
        setLoading(false);
      }

    }
    getCompletedLevels();

  }, []);

  if(loading) {
    return <LoadingPage text='Fetching Levels...' progress={100}/>
  }

  return (
    <div className="bg-[url('/herobg.png')] bg-center bg-cover overflow-auto">
      <div className="relative h-[2000px] overflow-visible">

        <svg className="absolute transition-all duration-300 top-0 left-[55vw] -translate-x-1/2 w-[400px] h-full pointer-events-none z-0"
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

        <svg className="absolute transition-all duration-300 top-0 left-[40vw] -translate-x-1/2 w-[400px] h-full pointer-events-none z-0"
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

        {points.map((point, index) => {
          const isCompleted = completedLevels.includes(point.page);
          const isSpecial = index === 5 || index === 11;
          const isUnlocked = index === 0 || completedLevels.includes(points[index - 1].page);

          return (
            <button
              key={index}
              onClick={() => {
                if (isUnlocked) {
                  router.push(`/rules?r=${point.page}`);
                } else {
                  toast.warning('Complete the previous level first!');
                }
              }}
              disabled={!isUnlocked}
              className={`${point.top} ${point.left} cursor-pointer absolute w-14 h-14 flex items-center justify-center rounded-full border-2 shadow-lg transition-all duration-300 z-10
        ${isCompleted ? 'bg-cyan-500 hover:scale-110 border-cyan-300 text-white' :  !isUnlocked && isSpecial ? `'bg-gray-400 border-gray-300 text-gray-100 cursor-not-allowed opacity-60` :
                  isSpecial ? 'bg-red-600 hover:bg-red-400 hover:scale-110 border-red-300 text-white' :
                    isUnlocked ? 'bg-transparent border-cyan-300 hover:bg-cyan-700 text-cyan-300 hover:text-white hover:scale-110' :
                      'bg-gray-400 border-gray-300 text-gray-100 cursor-not-allowed opacity-60'}
      `}
            >
              {index + 1}
            </button>
          );
        })}

      </div>
    </div>
  );
}