import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY as string;

// ❗Use Node runtime (Edge can't stream binary audio)
export const runtime = "nodejs";

// Helper function to run Python script
function runPythonTTS(text: string, apiKey: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // Create a temporary directory for audio files
    const tmpDir = path.join(os.tmpdir(), "tts-" + Date.now());
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const audioPath = path.join(tmpDir, "output.wav");
    const scriptPath = path.join(tmpDir, "tts_script.py");

    // Python script to generate TTS using the working method
    const pythonScript = `import sys
sys.path.insert(0, '${path.join(process.cwd()).replace(/\\/g, "\\\\")}')

try:
    from huggingface_hub import InferenceClient
    
    client = InferenceClient(provider="replicate", api_key="${apiKey}")
    audio = client.text_to_speech("""${text.replace(
      /"""/g,
      '\\"\\"\\"'
    )}""", model="hexgrad/Kokoro-82M")
    
    with open(r"${audioPath}", "wb") as f:
        f.write(audio)
    
    print("SUCCESS")
except Exception as e:
    print(f"ERROR: {str(e)}", file=sys.stderr)
    sys.exit(1)
`;

    // Write script to temp file to avoid command-line escaping issues
    try {
      fs.writeFileSync(scriptPath, pythonScript, "utf-8");
    } catch (err) {
      return reject(new Error(`Failed to write Python script: ${err}`));
    }

    const pythonProcess = spawn("python", [scriptPath]);
    let stderr = "";

    pythonProcess.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    pythonProcess.on("close", (code) => {
      // Clean up script file
      try {
        fs.unlinkSync(scriptPath);
      } catch {}

      if (code === 0 && fs.existsSync(audioPath)) {
        try {
          const audioBuffer = fs.readFileSync(audioPath);
          // Clean up temp file
          fs.unlinkSync(audioPath);
          fs.rmSync(tmpDir, { recursive: true, force: true });
          resolve(audioBuffer);
        } catch (e) {
          reject(e);
        }
      } else {
        // Clean up on error
        try {
          fs.unlinkSync(audioPath);
          fs.rmSync(tmpDir, { recursive: true, force: true });
        } catch {}
        reject(new Error(stderr || "Python TTS failed"));
      }
    });

    pythonProcess.on("error", (err) => {
      reject(err);
    });
  });
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    console.log("Attempting TTS with text:", text.substring(0, 50));
    console.log("API Key present:", !!HF_API_KEY);
    console.log("Using model: hexgrad/Kokoro-82M via Python InferenceClient");

    try {
      const audioBuffer = await runPythonTTS(text, HF_API_KEY);
      console.log(
        "Successfully generated audio, size:",
        audioBuffer.byteLength
      );

      return new NextResponse(new Uint8Array(audioBuffer), {
        status: 200,
        headers: {
          "Content-Type": "audio/wav",
          "Cache-Control": "no-cache",
        },
      });
    } catch (pythonErr: any) {
      console.error("Python TTS failed:", pythonErr.message);
      console.log("Falling back to Web Speech API");

      return NextResponse.json(
        { error: "Python TTS unavailable", fallback: true },
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
