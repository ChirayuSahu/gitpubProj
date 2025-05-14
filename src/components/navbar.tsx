import React from 'react'
import Button from './custom/button'
import Link from 'next/link'

const Navbar = () => {

    const navItems = [
        { name: 'Learn', href: '/learn' },
        { name: 'Battle', href: '/' },
        { name: 'Rankings', href: '/' },
        { name: 'Community', href: '/' },
    ]

    return (
        <>
            <div className='fixed z-100 w-full py-4 flex justify-between items-center px-15 text-[#24F2F4] backdrop-blur-md border-b border-[#24F2F4]'>
                <div>
                    <h1 className='text-2xl'>{`</CodeClash`}</h1>
                </div>
                <div className='flex gap-15 text-lg'>
                    {
                        navItems.map((item, index)=>(
                            <Link key={index} href={item.href}>{item.name}</Link>
                        ))
                    }
                </div>
                <div className=''>
                    <Button className='text-lg py-2 px-6'>Sign Up</Button>
                </div>
            </div>
        </>
    )
}

export default Navbar