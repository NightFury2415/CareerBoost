"use client";

import { useState, useRef } from "react";

/**
 * 🎙️ useRecorder Hook — Fixed version
 * - Ensures onstop always fires AFTER data is ready
 * - Prevents double-stop issues
 * - Returns a clean audio blob for Whisper transcription
 */
export default function useRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      // Request mic access (must be HTTPS)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      chunksRef.current = [];
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);

        // stop tracks to free mic
        stream.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
      };

      recorder.start(100); // gather chunks every 100ms
      setIsRecording(true);

      // auto-stop after 5 seconds (adjust as needed)
      stopTimeoutRef.current = setTimeout(() => {
        if (recorder.state === "recording") recorder.stop();
      }, 300000);
    } catch (err) {
      console.error("🎙️ Microphone access failed:", err);
      alert(
        "Unable to access your microphone. Please allow mic permissions and use HTTPS."
      );
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === "recording") {
      recorder.stop();
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    }
  };

  const clearAudio = () => setAudioBlob(null);

  return {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    clearAudio,
  };
}
