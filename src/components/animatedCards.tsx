'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import Image from 'next/image'
import gsap from 'gsap'

const AnimatedCards = () => {
  const cardsContainerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1);

  useGSAP(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * -30
      const y = (e.clientY / window.innerHeight - 0.5) * -10

      if (cardsContainerRef.current) {
        gsap.to(cardsContainerRef.current, {
          x,
          y,
          duration: 0.5,
          ease: 'power2.out',
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className="absolute w-full h-screen overflow-hidden">
      <div
        ref={cardsContainerRef}
        className="z-0 relative w-full h-full"
      >
        <Image
          src="/card.png"
          alt="Card 1"
          width={500}
          height={500}
          className="absolute left-0 top-10 w-100 scale-25 xl:scale-40 2xl:scale-45 2xl:left-30 transition-all duration-500"
          style={{ transform: `scale(${scale})`}}
        />
        <Image
          src="/card.png"
          alt="Card 2"
          width={500}
          height={500}
          className="absolute right-20 bottom-10 scale-25 xl:scale-40 2xl:scale-45 2xl:right-40 transition-all duration-500"
          style={{ transform: `scale(${scale})`}}
        />
        <Image
          src="/card.png"
          alt="Card 2"
          width={500}
          height={500}
          className="absolute right-0 top-10 scale-30 xl:scale-45 2xl:scale-50 transition-all duration-500"
          style={{ transform: `scale(${scale})`}}
        />
        <Image
          src="/card.png"
          alt="Card 3"
          width={500}
          height={500}
          className="absolute left-10 bottom-10 scale-30 xl:scale-45 2xl:scale-50 transition-all duration-500"
          style={{ transform: `scale(${scale})`}}
        />
      </div>
    </div>
  )
}

export default AnimatedCards
