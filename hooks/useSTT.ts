"use client";

import { useState } from "react";

/**
 * 🎧 useSTT Hook (Speech-to-Text)
 *  - Calls /api/interview/stt
 *  - Handles 500 errors gracefully
 */
export default function useSTT() {
  const [transcribing, setTranscribing] = useState(false);

  const transcribeAudio = async (audioBlob: Blob): Promise<string | null> => {
    if (!audioBlob) return null;
    setTranscribing(true);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const res = await fetch("/api/interview/stt", {
        method: "POST",
        body: formData,
      });

      // Log detailed info if fails
      if (!res.ok) {
        const errText = await res.text();
        console.error("STT backend failed:", errText);
        throw new Error("STT backend failed");
      }

      const data = await res.json();
      return data.text || null;
    } catch (err) {
      console.error("STT error:", err);
      return null; // gracefully fail
    } finally {
      setTranscribing(false);
    }
  };

  return { transcribeAudio, transcribing };
}
