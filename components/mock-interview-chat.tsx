"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Loader, Download } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface InterviewConfig {
  resume: string;
  position: string;
  experience: string;
  interviewType: string;
  company: string;
  jobDescription: string;
  timeLimit: string;
  practiceTypes: string[];
}

const END_KEYWORDS = [
  "end",
  "stop",
  "quit",
  "exit",
  "finish",
  "end interview",
  "terminate",
  "cancel",
  "stop interview",
];

export default function MockInterviewChat({
  config,
  onEndInterview,
}: {
  config: InterviewConfig;
  onEndInterview: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [warmupComplete, setWarmupComplete] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const initialQuestionRequestedRef = useRef(false);
  const askedQuestionsRef = useRef<string[]>([]);

  // Parse time limit
  const timeLimitMinutes = parseInt(config.timeLimit.split(" ")[0]);
  const totalSeconds = timeLimitMinutes * 60;

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => {
        if (prev >= totalSeconds) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeUp();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => timerRef.current && clearInterval(timerRef.current);
  }, [totalSeconds]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial warm-up question request
  useEffect(() => {
    if (initialQuestionRequestedRef.current) return;
    initialQuestionRequestedRef.current = true;
    requestWarmup();
  }, []);

  // -----------------------------------------
  // ⭐ REQUEST WARM-UP QUESTION
  // -----------------------------------------
  const requestWarmup = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/interview/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...config,
          messages: [],
          askedQuestions: [],
          isFirstMessage: true,
        }),
      });

      const data = await res.json();

      setMessages([
        {
          role: "assistant",
          content: data.question,
          timestamp: new Date(),
        },
      ]);

      setWarmupComplete(false);
      setQuestionCount(0);
    } catch {
      setMessages([
        {
          role: "assistant",
          content: "Hey! How are you doing today?",
          timestamp: new Date(),
        },
      ]);
    }

    setLoading(false);
  };

  // -----------------------------------------
  // ⭐ SEND USER MESSAGE
  // -----------------------------------------
  const handleSendMessage = async () => {
    if (!input.trim() || loading || interviewEnded) return;

    const userMessage = input.trim();
    setInput("");

    const newUserMessage: Message = {
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);

    // Auto-end logic
    if (END_KEYWORDS.some((kw) => userMessage.toLowerCase().includes(kw))) {
      setInterviewEnded(true);

      const finalMessage: Message = {
        role: "assistant",
        content: "Interview ended by your request. Downloading transcript...",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, finalMessage]);
      autoDownloadTranscript();
      setTimeout(() => onEndInterview(), 1500);
      return;
    }

    // If warmup not done, now do real first question
    if (!warmupComplete) {
      setWarmupComplete(true);
      requestRealQuestion([...messages, newUserMessage]);
      return;
    }

    // Normal conversation
    requestRealQuestion([...messages, newUserMessage]);
  };

  // -----------------------------------------
  // ⭐ REQUEST REAL INTERVIEW QUESTION
  // -----------------------------------------
  const requestRealQuestion = async (updatedMessages: Message[]) => {
    setLoading(true);

    try {
      const res = await fetch("/api/interview/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...config,
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          askedQuestions: askedQuestionsRef.current,
          isFirstMessage: false,
        }),
      });

      const data = await res.json();
      const question = data.question;

      askedQuestionsRef.current.push(question);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: question, timestamp: new Date() },
      ]);

      setQuestionCount((prev) => prev + 1);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Thank you for your answer. Could you explain that a bit more?",
          timestamp: new Date(),
        },
      ]);
    }

    setLoading(false);
  };

  // -----------------------------------------
  // ⭐ AUTO DOWNLOAD TRANSCRIPT
  // -----------------------------------------
  const autoDownloadTranscript = () => {
    let transcript = `Interview Transcript\n====================\n\n`;
    transcript += `Position: ${config.position}\n`;
    transcript += `Company: ${config.company}\n`;
    transcript += `Interview Type: ${config.interviewType}\n`;
    transcript += `Experience: ${config.experience} years\n`;
    transcript += `Date: ${new Date().toLocaleString()}\n\n`;
    transcript += `====================\n\n`;

    messages.forEach((msg) => {
      const speaker = msg.role === "assistant" ? "AI Interviewer" : "Candidate";

      transcript += `${speaker}: ${msg.content}\n\n`;
    });

    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `interview_transcript_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // -----------------------------------------
  // ⭐ TIME-UP LOGIC
  // -----------------------------------------
  const handleTimeUp = () => {
    if (!interviewEnded) {
      setInterviewEnded(true);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Time is up! Downloading your transcript.",
          timestamp: new Date(),
        },
      ]);

      autoDownloadTranscript();
    }
  };

  // -----------------------------------------
  // ⭐ HELPER — FORMAT TIMER
  // -----------------------------------------
  const timeRemaining = totalSeconds - elapsedTime;
  const timePercentage = (elapsedTime / totalSeconds) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // -----------------------------------------
  // ⭐ RENDER
  // -----------------------------------------
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
              <p
                className={`text-2xl font-bold ${
                  timeRemaining < 300
                    ? "text-red-400 animate-pulse"
                    : "text-cyan-400"
                }`}
              >
                {formatTime(timeRemaining)}
              </p>
            </div>

            <div className="w-32 bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  timePercentage > 80 ? "bg-red-500" : "bg-cyan-500"
                }`}
                style={{ width: `${Math.min(timePercentage, 100)}%` }}
              />
            </div>

            <Button
              onClick={autoDownloadTranscript}
              variant="outline"
              className="text-cyan-400 hover:text-cyan-300 bg-transparent border-cyan-400 gap-2"
              disabled={messages.length === 0}
            >
              <Download className="w-4 h-4" /> Transcript
            </Button>

            <Button
              onClick={() => {
                autoDownloadTranscript();
                onEndInterview();
              }}
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
          <div
            key={idx}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <Card
              className={`max-w-2xl ${
                msg.role === "user"
                  ? "bg-cyan-600 text-white border-cyan-500"
                  : "bg-slate-800/50 text-gray-100 border-slate-700"
              } p-4 shadow-md`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </p>
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
            placeholder={
              interviewEnded ? "Interview ended." : "Type your answer..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
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
  );
}
