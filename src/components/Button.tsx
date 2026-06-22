import Link, { LinkProps } from 'next/link'
import clsx from 'clsx'
import { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'

const variantStyles = {
  primary:
    'bg-accent font-semibold text-ink-bg hover:brightness-110 active:brightness-95 active:text-ink-bg/70',
  secondary:
    'border border-accent/40 bg-accent/10 font-medium text-accent hover:bg-accent/20 hover:border-accent/60 hover:brightness-110 active:brightness-95 active:text-accent/70',
}

type ButtonProps = {
  variant?: keyof typeof variantStyles
  className?: string
  children?: ReactNode
} & (
  | ({ href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
  | ({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps)
)

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  className = clsx(
    'inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none',
    variantStyles[variant],
    className
  )

  if (typeof props.href === 'string') {
    return <Link className={className} {...(props as any)} />
  }

  return <button className={className} {...(props as any)} />
}
