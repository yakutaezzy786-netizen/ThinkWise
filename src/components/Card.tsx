export default function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-paper-raised rounded-card border border-border shadow-sm p-6 ${className}`}>
      {children}
    </div>
  )
}