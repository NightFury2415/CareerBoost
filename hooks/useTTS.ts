"use client";

import { useState } from "react";

/**
 * 🗣️ useTTS Hook (Text-to-Speech)
 *  - Calls /api/interview/tts
 *  - Uses Hugging Face API for quality voice
 *  - Falls back to Web Speech API if needed
 */
export default function useTTS() {
  const [speaking, setSpeaking] = useState(false);

  const speakTextWithFallback = (text: string) => {
    // Use better voices from Web Speech API with female voice preferred
    const utter = new SpeechSynthesisUtterance(text);

    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    console.log(
      "Available voices:",
      voices.map((v) => `${v.name} (${v.lang})`)
    );

    // Try to find a high-quality English female voice
    let selectedVoice = voices.find(
      (v) =>
        v.lang.includes("en") &&
        (v.name.toLowerCase().includes("female") ||
          v.name.toLowerCase().includes("woman") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("victoria") ||
          v.name.toLowerCase().includes("karen"))
    );

    if (!selectedVoice) {
      selectedVoice = voices.find(
        (v) => v.lang.includes("en") && !v.name.toLowerCase().includes("male")
      );
    }

    if (!selectedVoice) {
      selectedVoice = voices.find((v) => v.lang.includes("en"));
    }

    if (selectedVoice) {
      console.log("Using voice:", selectedVoice.name);
      utter.voice = selectedVoice;
    }

    utter.rate = 0.95; // Slightly slower for clarity
    utter.pitch = 1.1; // Slightly higher for better quality
    utter.volume = 1;

    utter.onend = () => {
      console.log("Web Speech API playback ended");
      setSpeaking(false);
    };

    utter.onerror = (event) => {
      console.error("Web Speech API error:", event.error);
      setSpeaking(false);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const speakText = async (text: string) => {
    if (!text.trim()) return;
    setSpeaking(true);

    try {
      console.log(
        "Sending TTS request for text:",
        text.substring(0, 50) + "..."
      );

      const res = await fetch("/api/interview/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      console.log("TTS Response status:", res.status);
      console.log("Response Content-Type:", res.headers.get("content-type"));

      // If backend returns success, check content type
      if (res.status === 200) {
        const contentType = res.headers.get("content-type") || "";

        // If it's JSON, it's a fallback signal
        if (contentType.includes("application/json")) {
          const data = await res.json();
          if (data.fallback || data.error) {
            console.log("Backend signaled fallback, using Web Speech API");
            speakTextWithFallback(text);
            return;
          }
        }

        // Otherwise, treat as audio/wav binary data
        try {
          const arrayBuffer = await res.arrayBuffer();
          console.log("Received audio buffer, size:", arrayBuffer.byteLength);

          if (arrayBuffer.byteLength === 0) {
            console.error("Received empty audio buffer");
            speakTextWithFallback(text);
            return;
          }

          const audioBlob = new Blob([arrayBuffer], { type: "audio/wav" });
          const audioUrl = URL.createObjectURL(audioBlob);

          const audio = new Audio(audioUrl);
          console.log("Playing audio from:", audioUrl);

          audio.play().catch((err) => {
            console.error("Audio playback error:", err);
            speakTextWithFallback(text);
            setSpeaking(false);
          });

          audio.onended = () => {
            console.log("Audio playback ended");
            setSpeaking(false);
            URL.revokeObjectURL(audioUrl);
          };

          audio.onerror = (err) => {
            console.error("Audio error:", err);
            speakTextWithFallback(text);
          };
        } catch (e) {
          console.error("Error processing audio:", e);
          speakTextWithFallback(text);
        }
        return;
      }

      // If backend fails — use fallback
      if (!res.ok) {
        const errText = await res.text();
        console.error("TTS request failed:", errText);
        console.log("Falling back to Web Speech API");
        speakTextWithFallback(text);
        return;
      }
    } catch (err) {
      console.error("TTS error:", err);
      speakTextWithFallback(text);
    }
  };

  return { speakText, speaking };
}
