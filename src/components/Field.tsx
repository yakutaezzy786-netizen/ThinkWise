import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

const fieldClass = 'w-full px-4 py-2.5 rounded-xl border border-border bg-paper text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-spark focus:border-spark transition-shadow'

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={fieldClass} {...props} />
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={fieldClass} {...props} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={fieldClass} {...props} />
}