"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PortfolioPerformance() {
  const [timeRange, setTimeRange] = useState("1y")

  return (
    <Card className="bg-darkblue-800 border-darkblue-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Portfolio Performance</CardTitle>
          <CardDescription className="text-gray-300">Track your investment growth over time</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[120px] bg-darkblue-900 border-darkblue-700 text-white">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent className="bg-darkblue-800 border-darkblue-700 text-white">
            <SelectItem value="1m">1 Month</SelectItem>
            <SelectItem value="3m">3 Months</SelectItem>
            <SelectItem value="6m">6 Months</SelectItem>
            <SelectItem value="1y">1 Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart">
          <TabsList className="bg-darkblue-900 border border-darkblue-700">
            <TabsTrigger value="chart" className="data-[state=active]:bg-darkblue-700">
              Chart
            </TabsTrigger>
            <TabsTrigger value="table" className="data-[state=active]:bg-darkblue-700">
              Table
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chart" className="mt-4">
            <div className="h-[400px] rounded-lg bg-darkblue-900 flex items-center justify-center">
              {/* This would be a chart component in a real app */}
              <div className="text-center">
                <div className="w-full h-full p-4">
                  <div className="h-full w-full rounded-lg bg-gradient-to-tr from-darkblue-900 to-darkblue-800 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-full h-[60%]">
                      <svg viewBox="0 0 100 20" className="w-full h-full">
                        <path
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="0.5"
                          strokeLinecap="round"
                          d="M0,10 Q30,5 50,10 T100,10 V20 H0 Z"
                        />
                        <path fill="rgba(59, 130, 246, 0.2)" d="M0,10 Q30,5 50,10 T100,10 V20 H0 Z" />
                      </svg>
                    </div>
                    <div className="absolute top-4 left-4 text-sm text-gray-300">
                      <div className="font-bold text-white">Portfolio Value</div>
                      <div className="text-2xl font-bold text-white mt-1">$327,500.00</div>
                      <div className="text-green-400 flex items-center mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4 mr-1"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                            clipRule="evenodd"
                          />
                        </svg>
                        +31.0% ($77,500.00)
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs text-gray-400">
                      <div>Jan</div>
                      <div>Mar</div>
                      <div>Jun</div>
                      <div>Sep</div>
                      <div>Dec</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-darkblue-900 p-4 rounded-lg">
                <div className="text-sm text-gray-300">Annualized Return</div>
                <div className="text-xl font-bold mt-1">27.3%</div>
              </div>
              <div className="bg-darkblue-900 p-4 rounded-lg">
                <div className="text-sm text-gray-300">Sharpe Ratio</div>
                <div className="text-xl font-bold mt-1">1.82</div>
              </div>
              <div className="bg-darkblue-900 p-4 rounded-lg">
                <div className="text-sm text-gray-300">Max Drawdown</div>
                <div className="text-xl font-bold mt-1">-8.4%</div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="table" className="mt-4">
            <div className="rounded-lg border border-darkblue-700 overflow-hidden">
              <table className="w-full">
                <thead className="bg-darkblue-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Period</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Starting Value</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Ending Value</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Return</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-darkblue-700">
                  <tr className="bg-darkblue-800">
                    <td className="px-4 py-3 text-sm">Dec 2024</td>
                    <td className="px-4 py-3 text-sm text-right">$320,150.00</td>
                    <td className="px-4 py-3 text-sm text-right">$327,500.00</td>
                    <td className="px-4 py-3 text-sm text-right text-green-400">+2.3%</td>
                  </tr>
                  <tr className="bg-darkblue-800">
                    <td className="px-4 py-3 text-sm">Nov 2024</td>
                    <td className="px-4 py-3 text-sm text-right">$312,500.00</td>
                    <td className="px-4 py-3 text-sm text-right">$320,150.00</td>
                    <td className="px-4 py-3 text-sm text-right text-green-400">+2.4%</td>
                  </tr>
                  <tr className="bg-darkblue-800">
                    <td className="px-4 py-3 text-sm">Oct 2024</td>
                    <td className="px-4 py-3 text-sm text-right">$305,200.00</td>
                    <td className="px-4 py-3 text-sm text-right">$312,500.00</td>
                    <td className="px-4 py-3 text-sm text-right text-green-400">+2.4%</td>
                  </tr>
                  <tr className="bg-darkblue-800">
                    <td className="px-4 py-3 text-sm">Sep 2024</td>
                    <td className="px-4 py-3 text-sm text-right">$310,500.00</td>
                    <td className="px-4 py-3 text-sm text-right">$305,200.00</td>
                    <td className="px-4 py-3 text-sm text-right text-red-400">-1.7%</td>
                  </tr>
                  <tr className="bg-darkblue-800">
                    <td className="px-4 py-3 text-sm">Aug 2024</td>
                    <td className="px-4 py-3 text-sm text-right">$298,700.00</td>
                    <td className="px-4 py-3 text-sm text-right">$310,500.00</td>
                    <td className="px-4 py-3 text-sm text-right text-green-400">+3.9%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
