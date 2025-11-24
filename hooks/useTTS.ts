"use client";

import { useState } from "react";

/**
 * 🗣️ useTTS Hook (Text-to-Speech)
 *  - Calls /api/interview/tts
 *  - Falls back to browser SpeechSynthesis if Hugging Face fails
 */
export default function useTTS() {
  const [speaking, setSpeaking] = useState(false);

  const speakText = async (text: string) => {
    if (!text.trim()) return;
    setSpeaking(true);

    try {
      const res = await fetch("/api/interview/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      // If backend fails — log error and fall back
      if (!res.ok) {
        const errText = await res.text();
        console.error("TTS request failed:", errText);
        throw new Error("TTS backend failed");
      }

      const arrayBuffer = await res.arrayBuffer();
      const audioBlob = new Blob([arrayBuffer], { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audio.play().catch((err) => console.error("Audio playback error:", err));
      audio.onended = () => {
        setSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
    } catch (err) {
      console.error("TTS error, using browser fallback:", err);
      // ✅ Fallback to browser voice if TTS API fails
      const utter = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utter);
      setSpeaking(false);
    }
  };

  return { speakText, speaking };
}
