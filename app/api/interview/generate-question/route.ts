import type { NextRequest } from "next/server"

// This route now calls OpenRouter directly using a server-side API key in
// process.env.OPENROUTER_API_KEY. Create a `.env.local` with that key when
// developing (do NOT commit the key).

const OPENROUTER_URL = "https://api.openrouter.ai/v1/chat/completions"

export async function POST(request: Request) {
  try {
    const { position, experience, interviewType, practiceTypes, jobDescription, company, messages, questionNumber } =
      await request.json()

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      console.error("[v0] OPENROUTER_API_KEY not set in environment")
      return Response.json({ error: "Server not configured with OpenRouter API key" }, { status: 500 })
    }

    let systemPrompt = ""

    if (questionNumber === 1) {
      // First question - based on config
      systemPrompt = `You are an expert technical interviewer conducting a ${interviewType} interview for a ${position} role at ${company} with ${experience} years of experience.\n\nJob Description:\n${jobDescription}\n\nInterview Focus: ${practiceTypes.join(", ")}\n\nGenerate ONLY ONE clear, specific, and engaging opening interview question tailored to this role, company, and candidate level. The question should be:\n- Relevant to the job description\n- Appropriate for ${experience} experience level\n- Focused on: ${practiceTypes[0] || "technical skills"}\n- Specific and actionable (not vague)\n- Designed to assess real competence in the role\n\nRespond with only the question, no explanation.`
    } else {
      // Follow-up questions based on conversation
      systemPrompt = `You are an expert technical interviewer conducting a ${interviewType} interview for a ${position} role at ${company}.\n\nJob Description:\n${jobDescription}\n\nInterview Focus: ${practiceTypes.join(", ")}\n\nBased on the conversation so far, generate ONE clear follow-up question that:\n- Builds on the candidate's previous answer\n- Goes deeper into their understanding or experience\n- Is specific and avoids being generic\n- Remains focused on: ${practiceTypes[0] || "technical assessment"}\n- Assesses their ability to contribute to the role\n\nRespond with only the question, no explanation.`
    }

    // Build messages for OpenRouter's chat endpoint: include the system prompt and
    // the conversation so far (if any). The client sends `messages` as an array
    // of {role, content}.
    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...(Array.isArray(messages) ? messages.map((m: any) => ({ role: m.role, content: m.content })) : []),
    ]

    const body = {
      model: "gpt-4o-mini",
      messages: chatMessages,
      max_tokens: 512,
      temperature: 0.2,
    }

    const resp = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })

    if (!resp.ok) {
      const txt = await resp.text()
      console.error("[v0] OpenRouter API error:", resp.status, txt)
      return Response.json({ error: "Failed to generate question" }, { status: 502 })
    }

    const data = await resp.json()

    // Support multiple possible response shapes from different providers
    let text = ""
    if (data.choices && data.choices[0]?.message?.content) {
      text = data.choices[0].message.content
    } else if (data.choices && data.choices[0]?.text) {
      text = data.choices[0].text
    } else if (data.output && data.output[0]?.content) {
      // some providers embed content differently
      const out = data.output[0].content
      if (typeof out === "string") text = out
      else if (Array.isArray(out)) text = out.map((c: any) => c.text || c).join("\n")
    } else {
      text = JSON.stringify(data)
    }

    return Response.json({ question: text })
  } catch (error) {
    console.error("[v0] Error generating question:", error)
    // If the failure was network/DNS related (e.g., no connectivity to OpenRouter),
    // return a safe fallback question so the UI remains usable during local dev.
    const msg = (error as any)?.message || ''
    const causeCode = (error as any)?.cause?.code || ''
    if (msg.includes('getaddrinfo') || msg.includes('fetch failed') || causeCode === 'ENOTFOUND') {
      return Response.json({ question: "(Offline) Tell me about a challenging project you worked on and how you handled it." })
    }

    return Response.json({ error: "Failed to generate question" }, { status: 500 })
  }
}
