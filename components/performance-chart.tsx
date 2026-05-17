

"use client"

import React from "react"
import { TrendingUp, Shield, Activity, BarChart2 } from "lucide-react"

export default function PerformanceChart() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Performance Engine</h3>
          <p className="text-sm text-muted-foreground mt-1">Cumulative returns vs benchmarks</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-1.5 rounded-full">
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
            Sisko AI Fund
          </div>
          <div className="flex items-center gap-2 text-purple-400 bg-purple-400/10 px-3 py-1.5 rounded-full">
            <span className="h-2 w-2 rounded-full bg-purple-400"></span>
            S&P 500
          </div>
        </div>
      </div>

      <div className="relative h-64 w-full rounded-[2rem] border border-border bg-card/30 p-6 shadow-inner backdrop-blur-sm">
        {/* Y Axis Labels */}
        <div className="absolute left-6 top-6 bottom-10 flex flex-col justify-between text-xs font-medium text-muted-foreground">
          <span>200%</span>
          <span>175%</span>
          <span>150%</span>
          <span>125%</span>
          <span>100%</span>
        </div>

        {/* X Axis Grid Lines */}
        <div className="absolute inset-x-16 inset-y-6 flex flex-col justify-between border-l border-border/40">
          <div className="w-full border-t border-border/20"></div>
          <div className="w-full border-t border-border/20"></div>
          <div className="w-full border-t border-border/20"></div>
          <div className="w-full border-t border-border/20"></div>
          <div className="w-full border-t border-border/40"></div>
        </div>

        {/* SVG Chart */}
        <div className="absolute inset-x-16 inset-y-6">
          <svg className="h-full w-full overflow-visible" viewBox="0 0 400 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="siskoGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* S&P 500 Line */}
            <polyline
              points="0,200 80,190 160,182 240,170 320,164 400,156"
              fill="none"
              stroke="#a855f7"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              className="opacity-80 transition-all duration-1000"
            />

            {/* Sisko Area Fill */}
            <polygon
              points="0,200 80,172 160,144 240,116 320,78 400,36 400,200 0,200"
              fill="url(#siskoGrad)"
              className="transition-all duration-1000 delay-150"
            />
            {/* Sisko Line */}
            <polyline
              points="0,200 80,172 160,144 240,116 320,78 400,36"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="4"
              className="drop-shadow-[0_0_12px_rgba(59,130,246,0.8)] transition-all duration-1000"
            />

            {/* Interactive Data Points */}
            <circle cx="80" cy="172" r="5" fill="#3b82f6" stroke="#1e293b" strokeWidth="2.5" className="hover:r-7 transition-all duration-300 cursor-pointer" />
            <circle cx="160" cy="144" r="5" fill="#3b82f6" stroke="#1e293b" strokeWidth="2.5" className="hover:r-7 transition-all duration-300 cursor-pointer" />
            <circle cx="240" cy="116" r="5" fill="#3b82f6" stroke="#1e293b" strokeWidth="2.5" className="hover:r-7 transition-all duration-300 cursor-pointer" />
            <circle cx="320" cy="78" r="5" fill="#3b82f6" stroke="#1e293b" strokeWidth="2.5" className="hover:r-7 transition-all duration-300 cursor-pointer" />

            {/* Final Highlight Point */}
            <g className="animate-bounce">
              <circle cx="400" cy="36" r="8" fill="#3b82f6" opacity="0.3" className="animate-ping" />
              <circle cx="400" cy="36" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="3" className="drop-shadow-[0_0_15px_rgba(59,130,246,1)]" />
            </g>
          </svg>
        </div>

        {/* X Axis Labels */}
        <div className="absolute inset-x-16 bottom-2 flex justify-between text-xs font-medium text-muted-foreground">
          <span>Q1 '25</span>
          <span>Q2 '25</span>
          <span>Q3 '25</span>
          <span>Q4 '25</span>
          <span>Q1 '26</span>
          <span>Q2 '26</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Annual Return", value: "34.2%", icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-400/10" },
          { label: "Sharpe Ratio", value: "2.14", icon: Activity, color: "text-purple-400", bg: "bg-purple-400/10" },
          { label: "Max Drawdown", value: "-9.7%", icon: Shield, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Beta to S&P", value: "0.12", icon: BarChart2, color: "text-amber-400", bg: "bg-amber-400/10" }
        ].map((metric) => (
          <div key={metric.label} className="glass-card rounded-[1.5rem] p-5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl group border border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-xl ${metric.bg} transition-colors duration-300 group-hover:bg-opacity-20`}>
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{metric.label}</span>
            </div>
            <div className="text-3xl font-black text-foreground tracking-tight">
              {metric.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
