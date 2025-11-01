export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient de base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#151922] to-[#0a0e1a]" />
      
      {/* Cercles animés */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0073EC] rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-float" />
      <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-[#00a8ff] rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#0056b3] rounded-full mix-blend-screen filter blur-[128px] opacity-10 animate-pulse-slow" />
      
      {/* Particules */}
      <div className="particles">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
