'use client'

import React, { useState } from 'react'
import Button from '@/components/custom/button'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const LoginPage = () => {

    const router = useRouter();
    const [form, setForm] = useState({
        email: '',
        password: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const result = await signIn('credentials', {
                email: form.email,
                password: form.password,
                redirect: false,
            })

            if (result?.error) {
                console.log('Login failed:', result.error)

            } else {
                router.push('/dashboard')
            }
        } catch (error: any) {
            console.error('Unexpected error:', error.message)
        }
    }


    return (
        <div className='min-h-screen bg-[url("/herobg.png")] bg-center bg-cover flex items-center justify-center'>
            <form
                onSubmit={handleSubmit}
                className='bg-[#0B0E37] p-8 rounded-lg shadow-lg w-96 flex flex-col gap-6'
            >
                <h1 className='text-3xl text-white text-center font-bold'>Welcome Again!</h1>

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
                        className='p-2 rounded-md bg-[#050A27] text-white outline-none'
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
                        className='p-2 rounded-md bg-[#050A27] text-white outline-none'
                        required
                    />
                </div>

                <Button
                    type='submit'
                    className='py-2'
                >
                    Log In
                </Button>
                <h1 className='text-center'>Need an account? <Link className='underline' href={'/'}>Sign in</Link></h1>
            </form>
        </div>
    )
}

export default LoginPage
