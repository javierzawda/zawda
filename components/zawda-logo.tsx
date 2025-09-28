export function ZawdaLogo({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
        {/* Geometric logo inspired by the screenshot */}
        <path d="M20 20 L40 20 L50 30 L40 40 L20 40 Z" />
        <path d="M45 25 L65 25 L75 35 L65 45 L45 45 Z" />
        <path d="M30 50 L50 50 L60 60 L50 70 L30 70 Z" />
        <path d="M55 55 L75 55 L85 65 L75 75 L55 75 Z" />
      </svg>
    </div>
  )
}
