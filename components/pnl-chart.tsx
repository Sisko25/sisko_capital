"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PnLChart() {
  const [timeRange, setTimeRange] = useState("1m")
  const [chartType, setChartType] = useState("cumulative")

  // Mock PnL data
  const pnlData = {
    "1w": {
      daily: [2150, -890, 3420, 1250, -1100, 2800, 1890],
      cumulative: [2150, 1260, 4680, 5930, 4830, 7630, 9520],
      dates: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    "1m": {
      daily: [
        2150, -890, 3420, 1250, -1100, 2800, 1890, -2100, 4200, 1800, -950, 3100, 2400, -1200, 1900, 3300, -800, 2700,
        1600, -1400, 2900, 1100, -600, 3800, 2200, -1800, 4100, 1500, -700, 2600,
      ],
      cumulative: [
        2150, 1260, 4680, 5930, 4830, 7630, 9520, 7420, 11620, 13420, 12470, 15570, 17970, 16770, 18670, 21970, 21170,
        23870, 25470, 24070, 26970, 28070, 27470, 31270, 33470, 31670, 35770, 37270, 36570, 39170,
      ],
      dates: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    },
    "3m": {
      daily: Array.from({ length: 90 }, () => Math.floor(Math.random() * 8000) - 2000),
      cumulative: [],
      dates: Array.from({ length: 90 }, (_, i) => `Day ${i + 1}`),
    },
    "1y": {
      daily: Array.from({ length: 365 }, () => Math.floor(Math.random() * 10000) - 3000),
      cumulative: [],
      dates: Array.from({ length: 365 }, (_, i) => `Day ${i + 1}`),
    },
  }

  // Calculate cumulative for 3m and 1y
  if (pnlData["3m"].cumulative.length === 0) {
    let cumulative = 0
    pnlData["3m"].cumulative = pnlData["3m"].daily.map((daily) => {
      cumulative += daily
      return cumulative
    })
  }

  if (pnlData["1y"].cumulative.length === 0) {
    let cumulative = 0
    pnlData["1y"].cumulative = pnlData["1y"].daily.map((daily) => {
      cumulative += daily
      return cumulative
    })
  }

  const currentData = pnlData[timeRange as keyof typeof pnlData]
  const totalPnL = currentData.cumulative[currentData.cumulative.length - 1]
  const avgDailyPnL = currentData.daily.reduce((sum, val) => sum + val, 0) / currentData.daily.length
  const maxDrawdown = Math.min(...currentData.cumulative)
  const maxProfit = Math.max(...currentData.cumulative)

  const positivedays = currentData.daily.filter((day) => day > 0).length
  const winRate = (positivedays / currentData.daily.length) * 100

  return (
    <Card className="bg-darkblue-800 border-darkblue-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Profit & Loss Analysis</CardTitle>
          <CardDescription className="text-gray-300">Track your investment performance over time</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px] bg-darkblue-900 border-darkblue-700 text-white">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent className="bg-darkblue-800 border-darkblue-700 text-white">
              <SelectItem value="1w">1 Week</SelectItem>
              <SelectItem value="1m">1 Month</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={chartType} onValueChange={setChartType}>
          <TabsList className="bg-darkblue-900 border border-darkblue-700 mb-4">
            <TabsTrigger value="cumulative" className="data-[state=active]:bg-darkblue-700">
              Cumulative P&L
            </TabsTrigger>
            <TabsTrigger value="daily" className="data-[state=active]:bg-darkblue-700">
              Daily P&L
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cumulative" className="mt-4">
            <div className="h-[400px] rounded-lg bg-darkblue-900 p-4">
              <div className="h-full w-full relative">
                <svg viewBox="0 0 100 20" className="w-full h-full">
                  <defs>
                    <linearGradient id="pnlGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  {/* Generate path for cumulative PnL */}
                  <path
                    fill="url(#pnlGradient)"
                    stroke="#3b82f6"
                    strokeWidth="0.3"
                    strokeLinecap="round"
                    d={`M0,${20 - (currentData.cumulative[0] / maxProfit) * 15} ${currentData.cumulative
                      .map(
                        (value, index) =>
                          `L${(index / (currentData.cumulative.length - 1)) * 100},${20 - (value / maxProfit) * 15}`,
                      )
                      .join(" ")} V20 H0 Z`}
                  />
                </svg>
                <div className="absolute top-4 left-4 text-sm text-gray-300">
                  <div className="font-bold text-white text-lg">
                    ${totalPnL > 0 ? "+" : ""}
                    {totalPnL.toLocaleString()}
                  </div>
                  <div className={`text-sm ${totalPnL >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {totalPnL >= 0 ? "+" : ""}
                    {((totalPnL / 327500) * 100).toFixed(2)}% Total Return
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="daily" className="mt-4">
            <div className="h-[400px] rounded-lg bg-darkblue-900 p-4">
              <div className="h-full w-full relative">
                <svg viewBox="0 0 100 20" className="w-full h-full">
                  {/* Generate bars for daily PnL */}
                  {currentData.daily.map((value, index) => {
                    const x = (index / currentData.daily.length) * 100
                    const height = Math.abs(value / Math.max(...currentData.daily.map(Math.abs))) * 8
                    const y = value >= 0 ? 10 - height : 10
                    return (
                      <rect
                        key={index}
                        x={x}
                        y={y}
                        width={100 / currentData.daily.length - 0.1}
                        height={height}
                        fill={value >= 0 ? "#10b981" : "#ef4444"}
                        opacity="0.8"
                      />
                    )
                  })}
                  {/* Zero line */}
                  <line x1="0" y1="10" x2="100" y2="10" stroke="#6b7280" strokeWidth="0.1" strokeDasharray="1,1" />
                </svg>
                <div className="absolute top-4 left-4 text-sm text-gray-300">
                  <div className="font-bold text-white text-lg">
                    ${avgDailyPnL > 0 ? "+" : ""}
                    {avgDailyPnL.toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-300">Average Daily P&L</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-darkblue-900 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Total P&L</span>
              {totalPnL >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
            </div>
            <div className={`text-xl font-bold ${totalPnL >= 0 ? "text-green-400" : "text-red-400"}`}>
              ${totalPnL > 0 ? "+" : ""}
              {totalPnL.toLocaleString()}
            </div>
          </div>
          <div className="bg-darkblue-900 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Win Rate</span>
              <Calendar className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold">{winRate.toFixed(1)}%</div>
          </div>
          <div className="bg-darkblue-900 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Max Profit</span>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-xl font-bold text-green-400">+${maxProfit.toLocaleString()}</div>
          </div>
          <div className="bg-darkblue-900 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Max Drawdown</span>
              <TrendingDown className="h-4 w-4 text-red-400" />
            </div>
            <div className="text-xl font-bold text-red-400">${maxDrawdown.toLocaleString()}</div>
          </div>
        </div>

        {/* Recent Performance */}
        <div className="mt-6">
          <h4 className="font-bold mb-3">Recent Daily Performance</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {currentData.daily.slice(-7).map((dailyPnL, index) => {
              const date = currentData.dates.slice(-7)[index]
              return (
                <div key={index} className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-300">{timeRange === "1w" ? date : `Day ${date}`}</span>
                  <span className={`text-sm font-medium ${dailyPnL >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {dailyPnL >= 0 ? "+" : ""}${dailyPnL.toLocaleString()}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
