'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Squares from "@/components/Squares/Squares";
import TopMenu from "@/components/custom/topMenu";


type Course = {
  title: string;
  icon: string;
};

const courses: Course[] = [
  { title: "Java", icon: "/icons/java.png" },
  { title: "Python", icon: "/icons/python.webp" },
  { title: "CPP", icon: "/icons/cpp.png" },
];

export default function ChooseCourse() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    document.title = "Choose Course | Campaign Heroes";
  }, []);

  return (
    <>
      <div className='absolute z-[-2] w-full min-h-screen bg-[linear-gradient(to_bottom,_#040B2A,_#051D5B,_#040B2A)]'></div>
      <div className='absolute z-[-1] w-full min-h-screen opacity-10'>
        <Squares
          squareSize={125}
          speed={0.1}
        />
      </div>
      <div className="min-h-screen text-white relative overflow-hidden flex flex-col">
        <TopMenu text="" back="/gamemodes"/>
        <div className="flex flex-col items-center justify-center px-6 mt-15 xl:mt-20 2xl:mt-40">
          <h1 className="text-4xl xl:text-5xl font-bold text-[#00e5ff] 2xl:mb-20 text-center">
            Choose The Course
          </h1>

          <div className="flex flex-wrap justify-center gap-12 scale-50 xl:scale-70 2xl:scale-100 transition-all duration-300">
            {courses.map((course, index) => {
              const isHovered = hoveredIndex === index;
              const isDimmed = hoveredIndex !== null && hoveredIndex !== index;

              return (
                <Link
                  key={index}
                  href="/campaign"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`flex flex-col items-center transition-all duration-300 cursor-pointer ${isDimmed ? "opacity-60 scale-90" : ""
                    } ${isHovered ? "scale-110" : ""}`}
                >
                  <div
                    className={`rounded-xl p-4 transition-all bg-[#040B2A] shadow-[0_0_10px_#00e5ff] ${isHovered
                      ? "border-4 border-cyan-400 shadow-[0_0_20px_#00e5ff]"
                      : "border-2 border-cyan-700"
                      }`}
                  >
                    <Image
                      src={course.icon}
                      alt={course.title}
                      width={isHovered ? 220 : 200}
                      height={isHovered ? 220 : 200}
                      className="transition-all duration-300 m-10"
                    />
                  </div>
                  <p className="mt-4 font-bold text-[#00e5ff] text-2xl md:text-3xl text-center">
                    {course.title}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
