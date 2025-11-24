import { NextResponse } from "next/server";

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY as string;
const TTS_MODEL = "coqui/XTTS-v2";

// ❗Use Node runtime (Edge can't stream binary audio)
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${TTS_MODEL}`,
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: text }),
      }
    );

    console.log("HF Response status:", response.status);
    console.log("HF Content-Type:", response.headers.get("content-type"));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HF raw error:", errorText);
      throw new Error(`HF TTS request failed: ${errorText}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const msg = await response.text();
      console.error("HF JSON response (likely cold model):", msg);
      throw new Error("Hugging Face model still loading or invalid response");
    }

    const arrayBuffer = await response.arrayBuffer();
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: { "Content-Type": "audio/wav" },
    });
  } catch (err: any) {
    console.error("TTS error:", err);
    return NextResponse.json(
      { error: err.message || "TTS request failed" },
      { status: 500 }
    );
  }
}
