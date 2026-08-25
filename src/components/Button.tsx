'use client'

import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'quiet'
}

export default function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const base = 'px-5 py-2.5 rounded-full font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-spark text-ink hover:bg-spark-dark',
    secondary: 'bg-transparent border-2 border-ink text-ink hover:bg-ink hover:text-paper',
    quiet: 'bg-transparent text-ink-soft hover:text-ink underline underline-offset-4',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}