import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`font-semibold bg-[#02061F] rounded-xl text-[#F2B72D] transition border-[#24F2F4] border-1 hover:bg-[#24F2F4] hover:text-[#02061F] ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
