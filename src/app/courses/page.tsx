'use client'

import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useState } from "react";

type Course = {
  title: string;
  icon: string;
};

const courses: Course[] = [
  { title: "Java", icon: "/icons/java.png" },
  { title: "Python", icon: "/icons/python.png" },
  { title: "CPP", icon: "/icons/cpp.jpg" },
];

export default function ChooseCourse() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>
      <Head>
        <title>Choose The Course</title>
      </Head>

      <div className="min-h-screen bg-[#031938] text-white relative overflow-hidden flex flex-col items-center justify-center">
        {/* Top-right nav */}
        <div className="absolute top-4 right-4 flex gap-4">
          <Link href="/">
            <Image src="/home.png" alt="Home" width={28} height={28} className="cursor-pointer" />
          </Link>
          <Image src="/gear.png" alt="Settings" width={28} height={28} className="cursor-pointer" />
        </div>

        {/* Back button */}
        <div className="absolute top-4 left-4">
          <Link href='/gamemodes'>
          <Image src="/back.png" alt="Back" width={28} height={28} className="cursor-pointer" /></Link>
        </div>

        {/* Title */}
        <h1 className="text-7xl font-bold text-[#00e5ff] mt-4 mb-16 drop-shadow-[0_0_10px_#00e5ff]">
          Choose The Course
        </h1>

        {/* Icons centered in screen */}
        <div className="flex items-center justify-center gap-16">
          {courses.map((course, index) => (
            <Link
              key={index}
              href={`/campaign`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex flex-col items-center transition-all duration-300 cursor-pointer ${
                hoveredIndex !== null && hoveredIndex !== index ? "opacity-60 scale-90" : ""
              } ${hoveredIndex === index ? "scale-110" : ""}`}
            >
              <div
                className={`rounded-xl p-4 transition-all ${
                  hoveredIndex === index
                    ? "border-4 border-cyan-400 shadow-[0_0_20px_#00e5ff]"
                    : "border-2 border-cyan-700"
                }`}
              >
                <Image
                  src={course.icon}
                  alt={course.title}
                  width={hoveredIndex === index ? 220 : 200}
                  height={hoveredIndex === index ? 220 : 200}
                />
              </div>
              <p className="mt-3 font-bold text-[#00e5ff] text-3xl">{course.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}