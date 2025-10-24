"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function InvestmentChatbot() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your SM Capital AI assistant. How can I help you with your investments today?",
      timestamp: new Date(),
    },
  ])

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      let response = ""

      if (input.toLowerCase().includes("nvidia") || input.toLowerCase().includes("nvda")) {
        response =
          "NVIDIA (NVDA) is one of our top holdings at 15.2% allocation. The company has shown exceptional performance with a 42.3% return since our initial investment. Our AI models predict continued growth in the semiconductor sector, particularly for companies focused on AI infrastructure like NVIDIA."
      } else if (input.toLowerCase().includes("tesla") || input.toLowerCase().includes("tsla")) {
        response =
          "Tesla (TSLA) represents 8.7% of your portfolio. While it's currently down 5.2%, our analysis suggests this is a temporary setback. The company's leadership in electric vehicles and energy storage positions it well for long-term growth as the world transitions to sustainable energy."
      } else if (input.toLowerCase().includes("performance") || input.toLowerCase().includes("return")) {
        response =
          "Your portfolio has achieved a 31.0% return since inception, significantly outperforming the S&P 500. The year-to-date return is 18.2%, with technology stocks being the primary drivers of this performance."
      } else if (input.toLowerCase().includes("risk") || input.toLowerCase().includes("volatility")) {
        response =
          "Your portfolio has a volatility of 12% and a Sharpe ratio of 1.82, indicating a strong risk-adjusted return. We actively manage risk through diversification across sectors and asset classes, with a maximum drawdown of -8.4% over the past year."
      } else if (input.toLowerCase().includes("strategy") || input.toLowerCase().includes("approach")) {
        response =
          "SM Capital employs a quantitative investment approach powered by advanced AI algorithms. We analyze vast amounts of market data to identify inefficiencies and opportunities. Your portfolio is optimized for long-term growth with a focus on innovative companies in technology, healthcare, and sustainable energy."
      } else {
        response =
          "Thank you for your question. Our AI models are analyzing the relevant data to provide you with the most accurate information. Is there anything specific about your investments you'd like to know more about?"
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  return (
    <Card className="bg-darkblue-800 border-darkblue-700">
      <CardHeader>
        <CardTitle>AI Investment Assistant</CardTitle>
        <CardDescription className="text-gray-300">
          Ask questions about your investments and get AI-powered insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user" ? "bg-blue-600 text-white" : "bg-darkblue-700 text-white"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            placeholder="Ask about your investments..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-darkblue-900 border-darkblue-700 text-white"
          />
          <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
