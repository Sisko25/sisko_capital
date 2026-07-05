import React from "react"

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-[#00ff41]">
      {/* CRT Scanline Overlay */}
      <div className="scanlines"></div>

      {/* Background Drone Animation Overlay */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20 pointer-events-none">
        
        {/* Radar Ring */}
        <div className="absolute h-[600px] w-[600px] rounded-full border border-[#2e3b2e] opacity-50"></div>
        <div className="absolute h-[400px] w-[400px] rounded-full border border-[#2e3b2e] opacity-50"></div>
        <div className="absolute h-[200px] w-[200px] rounded-full border border-[#2e3b2e] opacity-50"></div>
        
        {/* Radar Sweep */}
        <div className="absolute h-[600px] w-[600px] rounded-full animate-radar origin-center">
          <div className="h-[300px] w-[300px] bg-gradient-to-tr from-transparent via-transparent to-[#00ff41]/20 rounded-tr-full border-r border-t border-[#00ff41]/40"></div>
        </div>

        {/* Crosshairs */}
        <div className="absolute h-[800px] w-[1px] bg-[#2e3b2e]"></div>
        <div className="absolute h-[1px] w-[800px] bg-[#2e3b2e]"></div>

        {/* The "Drone" SVG graphic floating */}
        <div className="absolute animate-drone text-[#00ff41]">
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polygon points="50,10 90,40 50,90 10,40" strokeDasharray="4 2" />
            <circle cx="50" cy="45" r="15" strokeDasharray="2 4" />
            <circle cx="50" cy="45" r="2" fill="currentColor" className="animate-pulse" />
            <line x1="50" y1="10" x2="50" y2="90" />
            <line x1="10" y1="40" x2="90" y2="40" />
            {/* Thrusters / Details */}
            <rect x="25" y="50" width="10" height="20" transform="rotate(-30 30 60)" />
            <rect x="65" y="50" width="10" height="20" transform="rotate(30 70 60)" />
          </svg>
        </div>

        {/* HUD Data Corners */}
        <div className="absolute top-10 left-10 font-mono text-xs opacity-70">
          <p>SYS.OP.OK</p>
          <p>ALT: 42,000 FT</p>
          <p>SPD: MACH 2.4</p>
        </div>
        <div className="absolute top-10 right-10 font-mono text-xs opacity-70 text-right">
          <p>TRGT.LOCKED</p>
          <p>AZM: 142.4°</p>
          <p>UAV-X9 LINK: SECURE</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto space-y-8">
        
        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-widest text-[#00ff41] glitch-hover drop-shadow-[0_0_15px_rgba(0,255,65,0.4)]">
          Sisko on a whole new level,<br className="hidden md:block"/> coming soon
        </h1>

        {/* Separator Line */}
        <div className="w-24 h-1 bg-[#00ff41] shadow-[0_0_10px_#00ff41] my-4"></div>

        {/* Sub Heading */}
        <p className="text-xl md:text-2xl font-mono tracking-[0.2em] text-[#00ff41]/80">
          SISKO AEROSPACE LLP
        </p>

        {/* Terminal/Command prompt decoration */}
        <div className="mt-16 font-mono text-xs text-[#00ff41]/60 animate-pulse">
          &gt; INITIATING STEALTH PROTOCOL...
        </div>

      </div>
    </main>
  )
}
