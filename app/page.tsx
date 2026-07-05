import React from "react"

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-[#00ff41]">
      {/* CRT Scanline Overlay */}
      <div className="scanlines"></div>

      {/* Background 3D Globe and Satellite Orbit */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none perspective-[1000px]">
        
        {/* 3D Wireframe Globe */}
        <div className="relative w-[400px] h-[400px] animate-globe">
          {/* Latitude Lines */}
          <div className="absolute inset-0 border border-[#2e3b2e] rounded-full transform rotateX(0deg)"></div>
          <div className="absolute inset-0 border border-[#2e3b2e] rounded-full transform rotateX(30deg)"></div>
          <div className="absolute inset-0 border border-[#2e3b2e] rounded-full transform rotateX(60deg)"></div>
          <div className="absolute inset-0 border border-[#2e3b2e] rounded-full transform rotateX(90deg)"></div>
          <div className="absolute inset-0 border border-[#2e3b2e] rounded-full transform rotateX(120deg)"></div>
          <div className="absolute inset-0 border border-[#2e3b2e] rounded-full transform rotateX(150deg)"></div>
          
          {/* Longitude Lines */}
          <div className="absolute inset-0 border border-[#2e3b2e] rounded-full transform rotateY(0deg)"></div>
          <div className="absolute inset-0 border border-[#2e3b2e] rounded-full transform rotateY(30deg)"></div>
          <div className="absolute inset-0 border border-[#2e3b2e] rounded-full transform rotateY(60deg)"></div>
          <div className="absolute inset-0 border border-[#2e3b2e] rounded-full transform rotateY(90deg)"></div>
          <div className="absolute inset-0 border border-[#2e3b2e] rounded-full transform rotateY(120deg)"></div>
          <div className="absolute inset-0 border border-[#2e3b2e] rounded-full transform rotateY(150deg)"></div>
        </div>

        {/* Satellite Orbit Path */}
        <div className="absolute w-[800px] h-[800px] rounded-full border border-dashed border-[#00ff41]/40 animate-orbit">
          {/* Satellite Object */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#00ff41] rounded-full shadow-[0_0_15px_#00ff41]">
            {/* Satellite Solar Panels */}
            <div className="absolute top-1/2 -left-4 w-3 h-2 bg-[#00ff41] -translate-y-1/2"></div>
            <div className="absolute top-1/2 -right-4 w-3 h-2 bg-[#00ff41] -translate-y-1/2"></div>
          </div>
        </div>

        {/* The "Drone" SVG flying across screen */}
        <div className="absolute animate-drone-flight text-[#00ff41]">
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
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
          <p>ORBIT: LEO</p>
          <p>ALT: 400 KM</p>
        </div>
        <div className="absolute top-10 right-10 font-mono text-xs opacity-70 text-right">
          <p>SAT.LOCKED</p>
          <p>TRAJ: STABLE</p>
          <p>GEO-UPLINK: SECURE</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto space-y-8 mt-12">
        
        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-widest text-[#00ff41] glitch-hover drop-shadow-[0_0_15px_rgba(0,255,65,0.4)]">
          Sisko on a whole new level,<br className="hidden md:block"/> coming soon
        </h1>

        {/* Separator Line */}
        <div className="w-24 h-1 bg-[#00ff41] shadow-[0_0_10px_#00ff41] my-4"></div>

        {/* Sub Heading */}
        <p className="text-xl md:text-2xl font-mono tracking-[0.2em] text-[#00ff41]/80 bg-black/50 px-4 py-2 backdrop-blur-sm rounded">
          SISKO AEROSPACE LLP
        </p>

      </div>
    </main>
  )
}
