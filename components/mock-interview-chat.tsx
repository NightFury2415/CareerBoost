"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Loader, Download } from "lucide-react";

// 🔊 Hooks (provided later)
import useRecorder from "@/hooks/useRecorder";
import useTTS from "@/hooks/useTTS";
import useSTT from "@/hooks/useSTT";

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
  voiceMode: boolean;
}

const END_KEYWORDS = ["stop interview"];

export default function MockInterviewChat({
  config,
  onEndInterview,
}: {
  config: InterviewConfig;
  onEndInterview: () => void;
}) {
  // ---------- STATE ----------
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [warmupComplete, setWarmupComplete] = useState(false);

  // 🎙️ Voice
  const { isRecording, audioBlob, startRecording, stopRecording, clearAudio } =
    useRecorder();
  const { speakText } = useTTS();
  const { transcribeAudio } = useSTT();

  // ---------- REFS ----------
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const askedQuestionsRef = useRef<string[]>([]);
  const initialQuestionRef = useRef(false);

  // ---------- TIME ----------
  const timeLimitMinutes = parseInt(config.timeLimit.split(" ")[0]);
  const totalSeconds = timeLimitMinutes * 60;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime((p) => {
        if (p >= totalSeconds) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return p;
        }
        return p + 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [totalSeconds]);

  // ---------- INIT QUESTION ----------
  useEffect(() => {
    if (initialQuestionRef.current) return;
    initialQuestionRef.current = true;
    requestWarmup();
  }, []);

  // ---------- WARMUP ----------
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
      const question = data.question;
      const msg = {
        role: "assistant",
        content: question,
        timestamp: new Date(),
      };
      setMessages([msg]);
      if (config.voiceMode) await speakText(question);
    } catch {
      const fallback = "Hey! How are you doing today?";
      setMessages([
        { role: "assistant", content: fallback, timestamp: new Date() },
      ]);
      if (config.voiceMode) await speakText(fallback);
    }
    setWarmupComplete(false);
    setQuestionCount(0);
    setLoading(false);
  };

  // ---------- SEND MESSAGE ----------
  const handleSendMessage = async (forcedText?: string) => {
    if (loading || interviewEnded) return;
    const text = forcedText || input.trim();
    if (!text) return;

    setInput("");
    const userMsg: Message = {
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((p) => [...p, userMsg]);

    if (END_KEYWORDS.some((kw) => text.toLowerCase().includes(kw))) {
      setInterviewEnded(true);
      const final: Message = {
        role: "assistant",
        content: "Interview ended by your request. Downloading transcript...",
        timestamp: new Date(),
      };
      setMessages((p) => [...p, final]);
      autoDownloadTranscript();
      setTimeout(onEndInterview, 1200);
      return;
    }

    if (!warmupComplete) {
      setWarmupComplete(true);
      requestRealQuestion([...messages, userMsg]);
    } else requestRealQuestion([...messages, userMsg]);
  };

  // ---------- STT ----------
  // 🎙️ When new audio is ready, transcribe it — but don't auto-send
  useEffect(() => {
    if (!audioBlob) return;
    (async () => {
      try {
        const transcript = await transcribeAudio(audioBlob);
        if (transcript) {
          setInput(transcript); // 🧠 show transcript in input box
        }
      } catch (err) {
        console.error("Speech-to-text failed:", err);
        alert("Could not transcribe your speech. Try again.");
      } finally {
        clearAudio();
      }
    })();
  }, [audioBlob]);

  // ---------- REAL QUESTION ----------
  const requestRealQuestion = async (updated: Message[]) => {
    setLoading(true);
    try {
      const res = await fetch("/api/interview/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...config,
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
          askedQuestions: askedQuestionsRef.current,
          isFirstMessage: false,
        }),
      });
      const data = await res.json();
      const question = data.question;
      askedQuestionsRef.current.push(question);
      const aiMsg: Message = {
        role: "assistant",
        content: question,
        timestamp: new Date(),
      };
      setMessages((p) => [...p, aiMsg]);
      if (config.voiceMode) await speakText(question);
      setQuestionCount((p) => p + 1);
    } catch {
      const fallback =
        "Thank you for your answer. Could you explain that a bit more?";
      setMessages((p) => [
        ...p,
        { role: "assistant", content: fallback, timestamp: new Date() },
      ]);
      if (config.voiceMode) await speakText(fallback);
    }
    setLoading(false);
  };

  // ---------- TRANSCRIPT ----------
  const autoDownloadTranscript = () => {
    let text = `Interview Transcript\n====================\n\n`;
    text += `Position: ${config.position}\nCompany: ${config.company}\n`;
    text += `Type: ${config.interviewType}\nExperience: ${config.experience}\n`;
    text += `Date: ${new Date().toLocaleString()}\n\n`;
    messages.forEach((m) => {
      const who = m.role === "assistant" ? "AI Interviewer" : "Candidate";
      text += `${who}: ${m.content}\n\n`;
    });
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interview_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleTimeUp = () => {
    if (interviewEnded) return;
    setInterviewEnded(true);
    setMessages((p) => [
      ...p,
      {
        role: "assistant",
        content: "Time is up! Downloading your transcript.",
        timestamp: new Date(),
      },
    ]);
    autoDownloadTranscript();
  };

  // ---------- MIC BUTTON ----------
  const MicButton = () => (
    <div className="flex justify-center my-4">
      <button
        onClick={() => (isRecording ? stopRecording() : startRecording())}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl ${
          isRecording
            ? "bg-red-600 animate-pulse shadow-red-500/50"
            : "bg-cyan-600 hover:bg-cyan-700 shadow-cyan-500/40"
        }`}
      >
        <span className="text-white text-xl font-bold">
          {isRecording ? "●" : "🎤"}
        </span>
      </button>
    </div>
  );

  // ---------- TIMER ----------
  const timeRemaining = totalSeconds - elapsedTime;
  const percent = (elapsedTime / totalSeconds) * 100;
  const format = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  // ---------- RENDER ----------
  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col p-4">
      {/* HEADER */}
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
                {format(timeRemaining)}
              </p>
            </div>
            <div className="w-32 bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  percent > 80 ? "bg-red-500" : "bg-cyan-500"
                }`}
                style={{ width: `${Math.min(percent, 100)}%` }}
              />
            </div>
            <Button
              onClick={autoDownloadTranscript}
              variant="outline"
              className="text-cyan-400 border-cyan-400"
              disabled={!messages.length}
            >
              <Download className="w-4 h-4 mr-2" />
              Transcript
            </Button>
            <Button
              onClick={() => {
                autoDownloadTranscript();
                onEndInterview();
              }}
              variant="outline"
              className="text-red-400 border-red-400"
            >
              End
            </Button>
          </div>
        </div>
      </Card>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-slate-900/30 rounded-lg p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <Card
              className={`max-w-2xl p-4 ${
                m.role === "user"
                  ? "bg-cyan-600 text-white border-cyan-500"
                  : "bg-slate-800/50 text-gray-100 border-slate-700"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{m.content}</p>
              <p className="text-xs opacity-50 mt-2">
                {m.timestamp.toLocaleTimeString()}
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

      {/* MIC */}
      {config.voiceMode && <MicButton />}

      {/* INPUT */}
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
            className="bg-slate-700 border-slate-600 text-white flex-1"
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={loading || !input.trim() || interviewEnded}
            className="bg-cyan-600 hover:bg-cyan-700 text-white gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> Send
          </Button>
        </div>
        <div className="mt-2 text-xs text-gray-400 flex justify-between">
          <span>Questions: {questionCount}</span>
          <span>{config.practiceTypes.join(", ")}</span>
        </div>
      </Card>
    </div>
  );
}
