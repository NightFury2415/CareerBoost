"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import InterviewSetup from "@/components/interview-setup"
import MockInterviewChat from "@/components/mock-interview-chat"

export default function MockInterview() {
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [interviewConfig, setInterviewConfig] = useState(null)

  const handleStartInterview = (config: any) => {
    setInterviewConfig(config)
    setInterviewStarted(true)
  }

  const handleEndInterview = () => {
    setInterviewStarted(false)
    setInterviewConfig(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-white">AI Mock Interview</h1>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {!interviewStarted ? (
          <InterviewSetup onStartInterview={handleStartInterview} />
        ) : (
          <MockInterviewChat config={interviewConfig} onEndInterview={handleEndInterview} />
        )}
      </div>
    </div>
  )
}
