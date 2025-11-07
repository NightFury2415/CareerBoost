import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { position, experience, interviewType, practiceTypes, jobDescription, company, messages, questionNumber } =
      await request.json()

    let systemPrompt = ""

    if (questionNumber === 1) {
      // First question - based on config
      systemPrompt = `You are an expert technical interviewer conducting a ${interviewType} interview for a ${position} role at ${company} with ${experience} years of experience.

Job Description:
${jobDescription}

Interview Focus: ${practiceTypes.join(", ")}

Generate ONLY ONE clear, specific, and engaging opening interview question tailored to this role, company, and candidate level. The question should be:
- Relevant to the job description
- Appropriate for ${experience} experience level
- Focused on: ${practiceTypes[0] || "technical skills"}
- Specific and actionable (not vague)
- Designed to assess real competence in the role

Respond with only the question, no explanation.`
    } else {
      // Follow-up questions based on conversation
      systemPrompt = `You are an expert technical interviewer conducting a ${interviewType} interview for a ${position} role at ${company}.

Job Description:
${jobDescription}

Interview Focus: ${practiceTypes.join(", ")}

Based on the conversation so far, generate ONE clear follow-up question that:
- Builds on the candidate's previous answer
- Goes deeper into their understanding or experience
- Is specific and avoids being generic
- Remains focused on: ${practiceTypes[0] || "technical assessment"}
- Assesses their ability to contribute to the role

Respond with only the question, no explanation.`
    }

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      prompt:
        messages.length > 0
          ? `Recent conversation:\n${messages.map((m: any) => `${m.role}: ${m.content}`).join("\n")}\n\nGenerate the next question:`
          : "Generate the opening question:",
    })

    return Response.json({ question: text })
  } catch (error) {
    console.error("[v0] Error generating question:", error)
    return Response.json({ error: "Failed to generate question" }, { status: 500 })
  }
}
