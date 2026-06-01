import { forwardRef, ReactNode, HTMLAttributes } from 'react'
import clsx from 'clsx'

interface OuterContainerProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

const OuterContainer = forwardRef<HTMLDivElement, OuterContainerProps>(function OuterContainer(
  { className, children, ...props },
  ref
) {
  return (
    <div ref={ref} className={clsx('sm:px-8', className)} {...props}>
      <div className="mx-auto max-w-7xl lg:px-8">{children}</div>
    </div>
  )
})

interface InnerContainerProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

const InnerContainer = forwardRef<HTMLDivElement, InnerContainerProps>(function InnerContainer(
  { className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={clsx('relative px-4 sm:px-8 lg:px-12', className)}
      {...props}
    >
      <div className="mx-auto max-w-2xl lg:max-w-6xl xl:max-w-7xl">{children}</div>
    </div>
  )
})

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { children, ...props },
  ref
) {
  return (
    <OuterContainer ref={ref} {...props}>
      <InnerContainer>{children}</InnerContainer>
    </OuterContainer>
  )
}) as React.ForwardRefExoticComponent<ContainerProps & React.RefAttributes<HTMLDivElement>> & {
  Outer: typeof OuterContainer
  Inner: typeof InnerContainer
}

Container.Outer = OuterContainer
Container.Inner = InnerContainer
