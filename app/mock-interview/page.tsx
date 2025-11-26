"use client";

import { useState } from "react";
import InterviewSetup from "@/components/interview-setup";
import MockInterviewChat from "@/components/mock-interview-chat";

export default function InterviewPage() {
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [interviewConfig, setInterviewConfig] = useState<any>(null);

  const handleStartInterview = (config: any) => {
    setInterviewConfig(config);
    setIsInterviewStarted(true);
  };

  const handleEndInterview = () => {
    if (
      confirm(
        "Are you sure you want to end the interview? Your progress will be saved in the transcript."
      )
    ) {
      setIsInterviewStarted(false);
      setInterviewConfig(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            AI Mock Interview Platform
          </h1>
          <p className="text-gray-400">
            Practice interviews with AI-powered adaptive questioning
          </p>
        </div>

        {!isInterviewStarted ? (
          <InterviewSetup onStartInterview={handleStartInterview} />
        ) : (
          <MockInterviewChat
            config={interviewConfig}
            onEndInterview={handleEndInterview}
          />
        )}
      </div>
    </div>
  );
}
