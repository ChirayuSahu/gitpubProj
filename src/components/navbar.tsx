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
        { name: 'Learn', href: '/learn' },
        { name: 'Battle', href: '/' },
        { name: 'Rankings', href: '/' },
        { name: 'Community', href: '/' },
    ]

    const handleLogout = () => {
        signOut();
        router.push('/login');
    }

    return (


        <>
            <div className='fixed z-100 w-full py-4 flex justify-between items-center px-15 text-[#24F2F4] backdrop-blur-md border-b border-[#24F2F4]'>
                <div>
                    <Link href={'/'}>
                        <h1 className='text-2xl'>{`</CodeClash`}</h1>
                    </Link>
                </div>
                <div className='flex gap-15 text-xl'>
                    {
                        navItems.map((item) => (
                            <Link key={item.name} href={item.href}>{item.name}</Link>
                        ))
                    }
                </div>
                {user ? (
                    <>
                        <div className='flex gap-2'>
                            <div className=''>
                                <Button className='text-lg py-2 px-6' onClick={()=>(router.push('/dashboard'))} >Dashboard</Button>
                            </div>
                            <div className=''>
                                <Button className='text-lg py-2 px-6' onClick={handleLogout}>Logout</Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className=''>
                        <Button className='text-lg py-2 px-6'>Sign Up</Button>
                    </div>
                )}

            </div>
        </>
    )
}

export default Navbar