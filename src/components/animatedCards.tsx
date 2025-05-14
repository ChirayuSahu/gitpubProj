'use client'

import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import Image from 'next/image'
import gsap from 'gsap'

const AnimatedCards = () => {
  const cardsContainerRef = useRef<HTMLDivElement>(null)

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
          className="absolute left-70 top-20 scale-25"
        />
        <Image
          src="/card.png"
          alt="Card 2"
          width={500}
          height={500}
          className="absolute right-7 bottom-20 scale-35"
        />
        <Image
          src="/card.png"
          alt="Card 2"
          width={500}
          height={500}
          className="absolute right-100 top-20 scale-45"
        />
        <Image
          src="/card.png"
          alt="Card 3"
          width={500}
          height={500}
          className="absolute left-10 bottom-30 scale-70"
        />
      </div>
    </div>
  )
}

export default AnimatedCards
