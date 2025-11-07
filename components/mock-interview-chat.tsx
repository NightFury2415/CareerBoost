"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Loader } from "lucide-react"

export default function MockInterviewChat({ config, onEndInterview }: any) {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [questionCount, setQuestionCount] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [companyInsight, setCompanyInsight] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout>()

  // Parse time limit
  const timeLimitMinutes = Number.parseInt(config.timeLimit.split(" ")[0])
  const totalSeconds = timeLimitMinutes * 60

  // Timer effect
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => {
        if (prev >= totalSeconds) {
          clearInterval(timerRef.current)
          // Time's up
          return prev
        }
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [totalSeconds])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Initial setup
  useEffect(() => {
    const init = async () => {
      await getCompanyInsights()
      await generateInitialQuestion()
    }
    init()
  }, [])

  const getCompanyInsights = async () => {
    try {
      const res = await fetch("/api/interview/get-company-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: config.company,
          position: config.position,
          interviewType: config.interviewType,
        }),
      })
      const data = await res.json()
      setCompanyInsight(data.insight)
    } catch (error) {
      console.error("[v0] Error fetching insights:", error)
    }
  }

  const generateInitialQuestion = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/interview/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          position: config.position,
          experience: config.experience,
          interviewType: config.interviewType,
          practiceTypes: config.practiceTypes,
          jobDescription: config.jobDescription,
          company: config.company,
          messages: [],
          questionNumber: 1,
        }),
      })
      const data = await res.json()
      setMessages([{ role: "assistant", content: data.question }])
      setQuestionCount(1)
    } catch (error) {
      console.error("[v0] Error generating question:", error)
      setMessages([
        { role: "assistant", content: "Welcome to your interview! Please share your background and experience." },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input
    setInput("")
    const newMessages = [...messages, { role: "user" as const, content: userMessage }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch("/api/interview/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          position: config.position,
          experience: config.experience,
          interviewType: config.interviewType,
          practiceTypes: config.practiceTypes,
          jobDescription: config.jobDescription,
          company: config.company,
          messages: newMessages,
          questionNumber: questionCount + 1,
        }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.question }])
      setQuestionCount((prev) => prev + 1)
    } catch (error) {
      console.error("[v0] Error:", error)
      setMessages((prev) => [...prev, { role: "assistant", content: "Please continue with your answer." }])
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const timePercentage = (elapsedTime / totalSeconds) * 100
  const timeRemaining = totalSeconds - elapsedTime

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col">
      {/* Header */}
      <Card className="bg-slate-800/50 border-slate-700 p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">{config.position}</h2>
            <p className="text-sm text-gray-400">
              {config.company} • {config.interviewType}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-gray-400">Time Remaining</p>
              <p className="text-2xl font-bold text-cyan-400">{formatTime(timeRemaining)}</p>
            </div>
            <div className="w-32 bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${timePercentage > 80 ? "bg-red-500" : "bg-cyan-500"}`}
                style={{ width: `${timePercentage}%` }}
              ></div>
            </div>
            <Button
              onClick={onEndInterview}
              variant="outline"
              className="text-red-400 hover:text-red-300 bg-transparent"
            >
              End Interview
            </Button>
          </div>
        </div>
      </Card>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-slate-900/30 rounded-lg p-4">
        {messages.length === 1 && companyInsight && (
          <div className="flex justify-start mb-4">
            <Card className="bg-blue-900/30 border-blue-700 p-3 max-w-xl">
              <p className="text-xs font-semibold text-blue-300 mb-1">Company Insights</p>
              <p className="text-xs text-blue-100 leading-relaxed">{companyInsight}</p>
            </Card>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <Card
              className={`max-w-xl ${
                msg.role === "user" ? "bg-cyan-600 text-white" : "bg-slate-800/50 text-gray-100 border-slate-700"
              } p-4`}
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </Card>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <Card className="bg-slate-800/50 border-slate-700 p-4">
              <Loader className="w-5 h-5 animate-spin text-cyan-400" />
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <Card className="bg-slate-800/50 border-slate-700 p-4">
        <div className="flex gap-3 items-end">
          <Input
            placeholder="Type your answer..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className="bg-cyan-600 hover:bg-cyan-700 text-white gap-2"
          >
            <Send className="w-4 h-4" /> Send
          </Button>
        </div>
        <div className="mt-2 text-xs text-gray-400 flex justify-between">
          <span>Questions asked: {questionCount}</span>
          <span>Practice area: {config.practiceTypes.join(", ")}</span>
        </div>
      </Card>
    </div>
  )
}
