import { NextResponse } from "next/server";

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY as string;
const HF_BASE = "https://router.huggingface.co";
const STT_MODEL = "openai/whisper-large-v3-turbo";

// ✅ Use Node runtime (Edge cannot handle binary form data)
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as Blob | null;

    if (!audioFile) {
      return NextResponse.json({ error: "Missing audio file" }, { status: 400 });
    }

    // 🔹 Send the request to the new Hugging Face router endpoint
    const response = await fetch(
      `${HF_BASE}/hf-inference/models/${STT_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": audioFile.type || "audio/webm",
        },
        body: audioFile,
      }
    );

    console.log("HF STT status:", response.status);
    console.log("HF STT Content-Type:", response.headers.get("content-type"));

    const textBody = await response.text();
    if (!response.ok) {
      console.error("HF STT raw error:", textBody);
      throw new Error(`HF STT request failed: ${textBody.slice(0, 300)}`);
    }

    let result;
    try {
      result = JSON.parse(textBody);
    } catch {
      console.error("HF STT non-JSON response:", textBody.slice(0, 300));
      throw new Error("Invalid response format from HF STT");
    }

    const text =
      result.text ||
      (Array.isArray(result) && result[0]?.text) ||
      "Unable to transcribe.";

    return NextResponse.json({ text });
  } catch (err: any) {
    console.error("STT error:", err);
    return NextResponse.json(
      { error: err.message || "STT request failed" },
      { status: 500 }
    );
  }
}
