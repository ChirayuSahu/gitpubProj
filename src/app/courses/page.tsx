'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Squares from "@/components/Squares/Squares";


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
        <div className="flex justify-between items-center px-6 pt-6 mb-12">
          <div className="flex items-center gap-4">
            <Link href="/campaign">
              <Image
                src="/back.png"
                alt="Back"
                width={40}
                height={34}
                className="cursor-pointer"
              />
            </Link>
          </div>
          <div className="flex gap-4">
            <Image
              src="/gear.png"
              alt="Settings"
              width={44}
              height={44}
              className="cursor-pointer"
            />
            <Link href="/">
              <Image
                src="/home.png"
                alt="Home"
                width={44}
                height={44}
                className="cursor-pointer"
              />
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center px-6 mt-40">
          <h1 className="text-4xl md:text-6xl font-bold text-[#00e5ff] mb-16 text-center">
            Choose The Course
          </h1>

          <div className="flex flex-wrap justify-center gap-12">
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
