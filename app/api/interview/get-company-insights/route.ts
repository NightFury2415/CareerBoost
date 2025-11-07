import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { company, position, interviewType } = await request.json()

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: `You are an expert recruiter familiar with technical interview patterns at major tech companies. 
      Provide a brief, practical insight about the types of questions typically asked at ${company} for ${position} interviews, especially for ${interviewType} rounds.
      Keep it concise and actionable - just key points about what ${company} focuses on.`,
      prompt: `What are the key characteristics and common question types for ${interviewType} interviews at ${company} for ${position} roles?`,
    })

    return Response.json({ insight: text })
  } catch (error) {
    console.error("[v0] Error getting company insights:", error)
    return Response.json({ error: "Failed to get insights" }, { status: 500 })
  }
}
