export default function PageTransition({ children, isVisible }) {
  return (
    <div className={`transition-all duration-500 ${isVisible ? 'animate-in opacity-100' : 'animate-out opacity-0'}`}>
      {children}
    </div>
  )
}