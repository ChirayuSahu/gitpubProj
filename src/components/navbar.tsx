"use client"

import React from 'react'
import Button from './custom/button'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'


const Navbar = () => {

    const { data: session } = useSession()
    const user = session?.user;

    const router = useRouter()

    const navItems = [
        { name: 'Learn', href: '/campaign' },
        { name: 'Battle', href: '/' },
        { name: 'Rankings', href: '/leaderboard' },
        { name: 'Menu', href: '/menu' },
    ]

    const handleLogout = () => {
        signOut();
        router.push('/login');
    }

    return (


        <>
            <div suppressHydrationWarning className='fixed z-100 w-full py-4 flex justify-between text-[#24F2F4] items-center px-8 lg:px-10 backdrop-blur-md border-b border-[#24F2F4]'>
                <div>
                    <Link href={'/'}>
                        <h1 className='text-2xl lg:text-2xl xl:text-3xl '>{`</CodeClash`}</h1>
                    </Link>
                </div>
                <div className='flex text-lg gap-6 lg:gap-10 lg:text-xl xl:text-2xl xl:gap-13'>
                    {
                        navItems.map((item) => (
                            <Link key={item.name} href={item.href}>{item.name}</Link>
                        ))
                    }
                </div>
                {user ? (
                    <>
                        <div className='flex gap-2'>
                            <div>
                                <Button className='text-xs lg:text-sm xl:text-lg py-2 px-4 cursor-pointer' onClick={()=>(router.push('/dashboard'))} >Dashboard</Button>
                            </div>
                            <div>
                                <Button className='text-xs lg:text-sm xl:text-lg py-2 px-4 cursor-pointer' onClick={handleLogout}>Logout</Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div>
                        <Button className='text-xs lg:text-sm xl:text-lg py-2 px-6 cursor-pointer' onClick={()=>(router.push('/login'))}>Login</Button>
                    </div>
                )}

            </div>
        </>
    )
}

export default Navbar