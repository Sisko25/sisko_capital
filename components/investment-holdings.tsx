"use client"

import { useState } from "react"
import { ChevronDown, PieChart, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function InvestmentHoldings() {
  const [sortBy, setSortBy] = useState("allocation")

  return (
    <Card className="bg-darkblue-800 border-darkblue-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Investment Holdings</CardTitle>
          <CardDescription className="text-gray-300">Companies your money is invested in</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search holdings..."
              className="w-[200px] pl-8 bg-darkblue-900 border-darkblue-700 text-white"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] bg-darkblue-900 border-darkblue-700 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-darkblue-800 border-darkblue-700 text-white">
              <SelectItem value="allocation">Allocation</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="list">
          <TabsList className="bg-darkblue-900 border border-darkblue-700">
            <TabsTrigger value="list" className="data-[state=active]:bg-darkblue-700">
              List
            </TabsTrigger>
            <TabsTrigger value="chart" className="data-[state=active]:bg-darkblue-700">
              Allocation Chart
            </TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-4">
            <div className="rounded-lg border border-darkblue-700 overflow-hidden">
              <table className="w-full">
                <thead className="bg-darkblue-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Company</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Allocation</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Value</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Return</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Sector</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-darkblue-700">
                  <tr className="bg-darkblue-800">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center mr-3 text-xs font-bold">
                          NVDA
                        </div>
                        <div>
                          <div className="font-medium">NVIDIA Corporation</div>
                          <div className="text-sm text-gray-400">NVDA</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">15.2%</td>
                    <td className="px-4 py-3 text-right">$49,780.00</td>
                    <td className="px-4 py-3 text-right text-green-400">+42.3%</td>
                    <td className="px-4 py-3 text-right">Technology</td>
                  </tr>
                  <tr className="bg-darkblue-800">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center mr-3 text-xs font-bold">
                          MSFT
                        </div>
                        <div>
                          <div className="font-medium">Microsoft Corporation</div>
                          <div className="text-sm text-gray-400">MSFT</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">12.8%</td>
                    <td className="px-4 py-3 text-right">$41,920.00</td>
                    <td className="px-4 py-3 text-right text-green-400">+28.7%</td>
                    <td className="px-4 py-3 text-right">Technology</td>
                  </tr>
                  <tr className="bg-darkblue-800">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center mr-3 text-xs font-bold">
                          AMZN
                        </div>
                        <div>
                          <div className="font-medium">Amazon.com, Inc.</div>
                          <div className="text-sm text-gray-400">AMZN</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">10.5%</td>
                    <td className="px-4 py-3 text-right">$34,387.50</td>
                    <td className="px-4 py-3 text-right text-green-400">+22.1%</td>
                    <td className="px-4 py-3 text-right">Consumer Cyclical</td>
                  </tr>
                  <tr className="bg-darkblue-800">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center mr-3 text-xs font-bold">
                          TSLA
                        </div>
                        <div>
                          <div className="font-medium">Tesla, Inc.</div>
                          <div className="text-sm text-gray-400">TSLA</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">8.7%</td>
                    <td className="px-4 py-3 text-right">$28,492.50</td>
                    <td className="px-4 py-3 text-right text-red-400">-5.2%</td>
                    <td className="px-4 py-3 text-right">Consumer Cyclical</td>
                  </tr>
                  <tr className="bg-darkblue-800">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center mr-3 text-xs font-bold">
                          AAPL
                        </div>
                        <div>
                          <div className="font-medium">Apple Inc.</div>
                          <div className="text-sm text-gray-400">AAPL</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">7.9%</td>
                    <td className="px-4 py-3 text-right">$25,872.50</td>
                    <td className="px-4 py-3 text-right text-green-400">+18.3%</td>
                    <td className="px-4 py-3 text-right">Technology</td>
                  </tr>
                  <tr className="bg-darkblue-800">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-yellow-600 flex items-center justify-center mr-3 text-xs font-bold">
                          GOOG
                        </div>
                        <div>
                          <div className="font-medium">Alphabet Inc.</div>
                          <div className="text-sm text-gray-400">GOOG</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">7.2%</td>
                    <td className="px-4 py-3 text-right">$23,580.00</td>
                    <td className="px-4 py-3 text-right text-green-400">+15.7%</td>
                    <td className="px-4 py-3 text-right">Communication Services</td>
                  </tr>
                  <tr className="bg-darkblue-800">
                    <td className="px-4 py-3 text-sm" colSpan={5}>
                      <div className="flex items-center justify-center text-gray-400 cursor-pointer hover:text-white">
                        <span>View all 24 holdings</span>
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
          <TabsContent value="chart" className="mt-4">
            <div className="h-[400px] rounded-lg bg-darkblue-900 flex items-center justify-center p-4">
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-64 h-64 relative">
                  <PieChart className="w-full h-full text-gray-700" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-sm text-gray-300">Total Value</div>
                      <div className="text-xl font-bold">$327,500</div>
                    </div>
                  </div>
                </div>
                <div className="ml-8">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
                      <div className="text-sm">Technology (35.9%)</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-600 mr-2"></div>
                      <div className="text-sm">Consumer Cyclical (19.2%)</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-600 mr-2"></div>
                      <div className="text-sm">Communication Services (12.5%)</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-600 mr-2"></div>
                      <div className="text-sm">Healthcare (10.8%)</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
                      <div className="text-sm">Financial Services (8.3%)</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-indigo-600 mr-2"></div>
                      <div className="text-sm">Others (13.3%)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
