"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Loader, Download } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface InterviewConfig {
  position: string
  experience: string
  interviewType: string
  company: string
  jobDescription: string
  timeLimit: string
  practiceTypes: string[]
}

export default function MockInterviewChat({ 
  config, 
  onEndInterview 
}: { 
  config: InterviewConfig
  onEndInterview: () => void 
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [questionCount, setQuestionCount] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [interviewEnded, setInterviewEnded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout>()
  const initialQuestionRequestedRef = useRef(false)

  // Parse time limit
  const timeLimitMinutes = parseInt(config.timeLimit.split(" ")[0])
  const totalSeconds = timeLimitMinutes * 60

  // Timer effect
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => {
        if (prev >= totalSeconds) {
          if (timerRef.current) clearInterval(timerRef.current)
          handleTimeUp()
          return prev
        }
        return prev + 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [totalSeconds])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Initial setup - Generate first question (guarded to avoid double calls in StrictMode)
  useEffect(() => {
    if (initialQuestionRequestedRef.current) {
      console.log('Initial question already requested; skipping duplicate call')
      return
    }
    initialQuestionRequestedRef.current = true
    generateInitialQuestion()
  }, [])

  const generateInitialQuestion = async () => {
    setLoading(true)
    try {
      console.log('Generating initial question...')
      const res = await fetch("/api/interview/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          position: config.position,
          experience: config.experience,
          interviewType: config.interviewType,
          company: config.company,
          jobDescription: config.jobDescription,
          messages: [],
          isFirstMessage: true,
        }),
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      console.log('Initial question received:', data)
      
      if (data.success || data.question) {
        setMessages([{ 
          role: "assistant", 
          content: data.question,
          timestamp: new Date()
        }])
        setQuestionCount(1)
      } else {
        throw new Error("No question in response")
      }
    } catch (error) {
      console.error("Error generating initial question:", error)
      // Fallback question
      setMessages([
        { 
          role: "assistant", 
          content: `Hello! I'm conducting your ${config.interviewType} interview for the ${config.position} position at ${config.company}. Let's begin. Can you start by telling me about your background and what interests you about this role?`,
          timestamp: new Date()
        },
      ])
      setQuestionCount(1)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || loading || interviewEnded) return

    const userMessage = input.trim()
    setInput("")
    
    const newUserMessage: Message = {
      role: "user",
      content: userMessage,
      timestamp: new Date()
    }
    
    const updatedMessages = [...messages, newUserMessage]
    setMessages(updatedMessages)
    setLoading(true)

    try {
      // Convert messages to API format
      const apiMessages = updatedMessages.map(msg => ({
        role: msg.role === "assistant" ? "assistant" as const : "user" as const,
        content: msg.content
      }))

      console.log('Sending message to API...')
      const res = await fetch("/api/interview/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          position: config.position,
          experience: config.experience,
          interviewType: config.interviewType,
          company: config.company,
          jobDescription: config.jobDescription,
          messages: apiMessages,
          isFirstMessage: false,
        }),
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      console.log('Response received:', data)
      
      if (data.success || data.question) {
        setMessages((prev) => [...prev, { 
          role: "assistant", 
          content: data.question,
          timestamp: new Date()
        }])
        setQuestionCount((prev) => prev + 1)
      } else {
        throw new Error("No question in response")
      }
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: "There is some error fetching the API key, Thank you for that answer. Could you elaborate more on your experience with this?",
        timestamp: new Date()
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleTimeUp = () => {
    if (!interviewEnded) {
      setInterviewEnded(true)
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "The interview time is up. Thank you for participating! Your responses have been recorded. Please click 'Download Transcript' to save your interview.",
        timestamp: new Date()
      }])
    }
  }

  const downloadTranscript = () => {
    let transcript = `Interview Transcript\n`
    transcript += `====================\n\n`
    transcript += `Position: ${config.position}\n`
    transcript += `Company: ${config.company}\n`
    transcript += `Interview Type: ${config.interviewType}\n`
    transcript += `Experience: ${config.experience} years\n`
    transcript += `Date: ${new Date().toLocaleString()}\n\n`
    transcript += `====================\n\n`

    messages.forEach((msg) => {
      const role = msg.role === "assistant" ? "AI Interviewer" : "Candidate"
      transcript += `${role}: ${msg.content}\n\n`
    })

    const blob = new Blob([transcript], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `interview_transcript_${new Date().getTime()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const timePercentage = (elapsedTime / totalSeconds) * 100
  const timeRemaining = totalSeconds - elapsedTime

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col p-4">
      {/* Header */}
      <Card className="bg-slate-800/50 border-slate-700 p-4 mb-4 shadow-lg">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">{config.position}</h2>
            <p className="text-sm text-gray-400">
              {config.company} • {config.interviewType}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400">Time Remaining</p>
              <p className={`text-2xl font-bold ${timeRemaining < 300 ? "text-red-400 animate-pulse" : "text-cyan-400"}`}>
                {formatTime(timeRemaining)}
              </p>
            </div>
            <div className="w-32 bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${timePercentage > 80 ? "bg-red-500" : "bg-cyan-500"}`}
                style={{ width: `${Math.min(timePercentage, 100)}%` }}
              ></div>
            </div>
            <Button
              onClick={downloadTranscript}
              variant="outline"
              className="text-cyan-400 hover:text-cyan-300 bg-transparent border-cyan-400 gap-2"
              disabled={messages.length === 0}
            >
              <Download className="w-4 h-4" /> Transcript
            </Button>
            <Button
              onClick={onEndInterview}
              variant="outline"
              className="text-red-400 hover:text-red-300 bg-transparent border-red-400"
            >
              End Interview
            </Button>
          </div>
        </div>
      </Card>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-slate-900/30 rounded-lg p-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <Card
              className={`max-w-2xl ${
                msg.role === "user" 
                  ? "bg-cyan-600 text-white border-cyan-500" 
                  : "bg-slate-800/50 text-gray-100 border-slate-700"
              } p-4 shadow-md`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <p className="text-xs opacity-50 mt-2">
                {msg.timestamp.toLocaleTimeString()}
              </p>
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
      <Card className="bg-slate-800/50 border-slate-700 p-4 shadow-lg">
        <div className="flex gap-3 items-end">
          <Input
            placeholder={interviewEnded ? "Interview ended. Download transcript to save." : "Type your answer..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            disabled={loading || interviewEnded}
            className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={loading || !input.trim() || interviewEnded}
            className="bg-cyan-600 hover:bg-cyan-700 text-white gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> Send
          </Button>
        </div>
        <div className="mt-2 text-xs text-gray-400 flex justify-between">
          <span>Questions asked: {questionCount}</span>
          <span>Practice areas: {config.practiceTypes.join(", ")}</span>
        </div>
      </Card>
    </div>
  )
}