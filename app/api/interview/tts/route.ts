import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY as string;

// ❗Use Node runtime (Edge can't stream binary audio)
export const runtime = "nodejs";

// Helper function to generate TTS using Hugging Face Inference with Replicate provider
async function generateTTS(text: string, apiKey: string): Promise<Buffer> {
  try {
    const client = new HfInference(apiKey);

    // Use the provider: replicate option to avoid fal-ai
    const audio = await client.textToSpeech({
      model: "hexgrad/Kokoro-82M",
      inputs: text,
      // @ts-ignore - provider option
      provider: "replicate",
    });

    const buffer = await audio.arrayBuffer();
    return Buffer.from(buffer);
  } catch (error) {
    throw new Error(`TTS generation failed: ${error}`);
  }
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    if (!HF_API_KEY) {
      console.error("Missing HUGGINGFACE_API_KEY environment variable");
      return NextResponse.json(
        { error: "TTS not configured", fallback: true },
        { status: 200 }
      );
    }

    console.log("Attempting TTS with text:", text.substring(0, 50));
    console.log("API Key present:", !!HF_API_KEY);
    console.log(
      "Using model: hexgrad/Kokoro-82M via Hugging Face Inference API"
    );

    try {
      const audioBuffer = await generateTTS(text, HF_API_KEY);
      console.log(
        "Successfully generated audio, size:",
        audioBuffer.byteLength
      );

      return new NextResponse(audioBuffer as any, {
        status: 200,
        headers: {
          "Content-Type": "audio/wav",
          "Cache-Control": "no-cache",
        },
      });
    } catch (hfErr: any) {
      console.error("Hugging Face TTS failed:", hfErr.message);
      console.log("Falling back to Web Speech API");

      return NextResponse.json(
        { error: "TTS unavailable", fallback: true },
        { status: 200 }
      );
    }
  } catch (err: any) {
    console.error("TTS error:", err);
    return NextResponse.json(
      { error: err.message || "TTS request failed", fallback: true },
      { status: 200 }
    );
  }
}
