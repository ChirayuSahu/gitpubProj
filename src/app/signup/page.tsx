'use client'

import React, { useState, useEffect } from 'react'
import Button from '@/components/custom/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AnimatedCards from '@/components/animatedCards'
import Image from 'next/image'
import LoadingPage from '@/components/custom/loadingPage'
import { toast } from 'sonner'

const SignUpPage = () => {

    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [scale, setScale] = useState(1);

    const [form, setForm] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setProgress(30);

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setProgress(100);
                setLoading(false);
                toast.error(data.message);
                return;
            }

            setProgress(50);
            router.push('/login');

        } catch (error: any) {
            toast.error('Unexpected error:', error.message);
        } finally {
            setLoading(false);
            setProgress(100);
        }
    };

    useEffect(() => {
            function updateScale() {
                const baseHeight = 1100;
                const currentHeight = window.innerHeight;
    
                const newScale = Math.min(Math.max(currentHeight / baseHeight, 0.7), 1.2);
                setScale(newScale);
            }
    
            updateScale();
            window.addEventListener('resize', updateScale);
            return () => window.removeEventListener('resize', updateScale);
        }, []);


    if (loading) {
        return <LoadingPage text="Signing up..." progress={progress} />
    }

    useEffect(() => {
        const lowerCaseUsername = form.username.toLowerCase();

        if (form.username !== lowerCaseUsername) {
            setForm((prev) => ({ ...prev, username: lowerCaseUsername }));
        }

    },[form.username])


    return (
        <>
            <AnimatedCards />
            <div className='min-h-screen bg-[url("/herobg.png")] bg-center bg-cover'>
                <div className='absolute flex items-center justify-center w-full h-full backdrop-blur-xs' style={{ transform: `scale(${scale})` }}>
                    <form
                        onSubmit={handleSubmit}
                        className='bg-[#0B0E37] p-10 rounded-2xl shadow-[#6370A5] shadow-sm border-2 border-[#6370A5] w-100 min-h-[50vh] flex flex-col gap-3 justify-center'
                    >
                        <div className='flex items-center justify-center gap-5 mb-6'>
                            <Image
                                src='/robot.png'
                                alt='robot'
                                width={100}
                                height={100}
                                draggable={false}
                            />
                            <h1 className='text-6xl text-white text-center font-bold'>Welcome!</h1>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label htmlFor='name' className='text-white font-medium'>
                                Name
                            </label>
                            <input
                                type='text'
                                id='name'
                                name='name'
                                value={form.name}
                                onChange={handleChange}
                                className='p-2 rounded-lg bg-[#050A27] text-white border-2 border-[#6370A5] outline-none'
                                required
                            />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label htmlFor='username' className='text-white font-medium'>
                                Username
                            </label>
                            <input
                                type='text'
                                id='username'
                                name='username'
                                value={form.username}
                                onChange={handleChange}
                                className='p-2 rounded-lg bg-[#050A27] text-white border-2 border-[#6370A5] outline-none'
                                required
                            />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label htmlFor='email' className='text-white font-medium'>
                                Email
                            </label>
                            <input
                                type='text'
                                id='email'
                                name='email'
                                value={form.email}
                                onChange={handleChange}
                                className='p-2 rounded-lg bg-[#050A27] text-white border-2 border-[#6370A5] outline-none'
                                required
                            />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label htmlFor='password' className='text-white font-medium'>
                                Password
                            </label>
                            <input
                                type='password'
                                id='password'
                                name='password'
                                value={form.password}
                                onChange={handleChange}
                                className='p-2 rounded-lg bg-[#050A27] text-white border-2 border-[#6370A5] outline-none'
                                required
                            />
                        </div>

                        <Button
                            type='submit'
                            className='py-2 text-3xl border-lg mt-4'
                        >
                            Sign Up
                        </Button>
                        <h1 className='text-center mt-4 text-white'>Already have an account? <Link className='underline' href={'/login'}>Login</Link></h1>
                    </form>
                </div>
            </div>
        </>
    )
}

export default SignUpPage
