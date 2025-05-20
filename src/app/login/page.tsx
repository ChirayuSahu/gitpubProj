'use client'

import React, { useState } from 'react'
import Button from '@/components/custom/button'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AnimatedCards from '@/components/animatedCards'
import Image from 'next/image'
import LoadingPage from '@/components/custom/loadingPage'
import { toast } from 'sonner'

const LoginPage = () => {

    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)

    const [form, setForm] = useState({
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
            const result = await signIn('credentials', {
                email: form.email,
                password: form.password,
                redirect: false,
            });

            setProgress(50);

            if(!result?.ok){
                setProgress(100);
                setLoading(false);
                toast.error('Invalid credentials');
                return;
            }

            setProgress(80);

            
            setProgress(100);
            
            router.push('/dashboard');

        } catch (error: any) {
            toast.error('Unexpected error:', error.message);
            setProgress(100);
            setLoading(false);
        }
    };


    if (loading) {
        return <LoadingPage text="Logging in..." progress={progress}/>
    }


    return (
        <>
            <AnimatedCards />
            <div className='min-h-screen bg-[url("/herobg.png")] bg-center bg-cover'>
                <div className='absolute flex items-center justify-center w-full h-full backdrop-blur-xs'>
                    <form
                        onSubmit={handleSubmit}
                        className='bg-[#0B0E37] p-10 rounded-2xl shadow-[#6370A5] shadow-sm border-2 border-[#6370A5] w-100 h-[50vh] flex flex-col gap-3 justify-center'
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
                            Log In
                        </Button>
                        <h1 className='text-center mt-4 text-white'>Don&apos;t have an account? <Link className='underline' href={'/signup'}>Sign in</Link></h1>
                    </form>
                </div>
            </div>
        </>
    )
}

export default LoginPage
