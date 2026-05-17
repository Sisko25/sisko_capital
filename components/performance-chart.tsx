"use client"

import React from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function PerformanceChart() {

  const data = {
    labels: ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025", "Q1 2026", "Q2 2026"],
    datasets: [
      {
        label: "Sisko AI Fund",
        data: [100, 114, 128, 142, 161, 182],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 3,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#ffffff",
        pointHoverRadius: 7,
        fill: true,
        tension: 0.35,
      },
      {
        label: "S&P 500 Index",
        data: [100, 105, 109, 115, 118, 122],
        borderColor: "#a855f7",
        backgroundColor: "transparent",
        borderWidth: 2,
        pointBackgroundColor: "#a855f7",
        borderDash: [5, 5],
        pointHoverRadius: 5,
        tension: 0.3,
      },
      {
        label: "MSCI World",
        data: [100, 102, 106, 110, 112, 115],
        borderColor: "#14b8a6",
        backgroundColor: "transparent",
        borderWidth: 2,
        pointBackgroundColor: "#14b8a6",
        borderDash: [3, 3],
        pointHoverRadius: 5,
        tension: 0.3,
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#94a3b8",
          font: {
            family: "Inter",
            size: 11,
            weight: "600" as any,
          },
          boxWidth: 12,
          padding: 15,
        }
      },
      tooltip: {
        backgroundColor: "#0b0f19",
        titleColor: "#f8fafc",
        bodyColor: "#94a3b8",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.raw}%`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "#94a3b8",
          font: {
            family: "Inter",
            size: 10,
          }
        }
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "#94a3b8",
          font: {
            family: "Inter",
            size: 10,
          },
          callback: function(value: any) {
            return value + "%"
          }
        }
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="h-64 w-full relative">
        <Line data={data} options={options} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {[
          { label: "Annualized Return", value: "34.2%", desc: "vs 14.8% S&P" },
          { label: "Sharpe Ratio", value: "2.14", desc: "Risk-adjusted return" },
          { label: "Max Drawdown", value: "-9.7%", desc: "Capital protection" },
          { label: "Beta to S&P 500", value: "0.12", desc: "True market neutrality" }
        ].map((metric) => (
          <div key={metric.label} className="glass-card rounded-2xl p-4 text-center hover:scale-[1.02] transition-transform duration-300">
            <div className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {metric.value}
            </div>
            <div className="text-xs font-semibold text-foreground mt-1">{metric.label}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{metric.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
