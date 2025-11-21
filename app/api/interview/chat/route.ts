// app/api/interview/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { InferenceClient } from '@huggingface/inference';

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

const hfClient = new InferenceClient(HF_API_KEY);

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  resume: string;
  position: string;
  experience: string;
  interviewType: string;
  company: string;
  jobDescription: string;
  messages: Message[];
  askedQuestions?: string[];
  isFirstMessage?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    if (!HF_API_KEY) {
      return NextResponse.json(
        { error: "Hugging Face API key missing" },
        { status: 500 }
      );
    }

    const body: ChatRequest = await req.json();
    const {
      resume,
      position,
      experience,
      interviewType,
      company,
      jobDescription,
      messages,
      askedQuestions = [],
      isFirstMessage = false,
    } = body;

    // Source sites
    const interviewSources: Record<string, string[]> = {
      technical: [
        "LeetCode",
        "HackerRank",
        "GeeksforGeeks",
        "StackOverflow",
        "AlgoExpert",
      ],
      coding: ["LeetCode Top 75", "HackerRank Medium", "Blind 75"],
      "system-design": [
        "Grokking System Design",
        "ByteByteGo",
        "SystemDesignPrimer",
      ],
      behavioral: [
        "Indeed",
        "SHL",
        "Google Behavioral Rubric",
        "Amazon LP Framework",
      ],
      mixed: ["LeetCode", "Grokking", "Indeed", "GeeksforGeeks"],
    };

    const sourceSites =
      interviewSources[interviewType.toLowerCase()] ||
      interviewSources["mixed"];

    // ☀️ WARM-UP QUESTIONS (only asked once)
const warmups = [
  "Hey! How are you doing today?",
  "Before we begin, how has your day been?",
  "What have you been up to recently?",
  "Tell me a little bit about yourself before we get started.",
  "Are you ready for today's interview session?",
  "How are you feeling about interviewing for this role?",
  "Anything exciting going on in your life lately?",
  "Hi! How’s your day going so far?",
  "Hope you're doing well today — how are you feeling?",
  "How has your week been?",
  "What’s been keeping you busy lately?",
  "How is everything on your end today?",
  "Did you have a good morning so far?",
  "Is this still a good time for you?",
  "How are things going for you today?",
  "Before we start, how have you been doing recently?",
  "Tell me a little about how you're feeling today.",
  "What's something positive that happened to you this week?",
  "Have you been working on anything interesting lately?",
  "How has life been treating you these days?",
  "Anything interesting or new happening recently?",
  "How’s your energy level today?",
  "I'd love to get to know you a bit — could you share a little about yourself?",
  "Let’s ease into things — tell me a bit about who you are.",
  "Before we dive in, what’s something you’d like me to know about you?",
  "How would you describe yourself in a few sentences?",
  "What brought you here today?",
  "How are you feeling about today's interview?",
  "Are you feeling ready to begin?",
  "Is there anything you'd like to share before we start?",
  "Do you feel prepared and comfortable to begin?",
  "Do you want a moment to settle in or are you ready to jump in?",
  "Just to warm up, what have you been working on recently?",
  "What’s one thing you enjoy doing when you’re not working?",
  "What’s something that motivates you these days?",
  "What’s something you're proud of recently?",
  "Has anything interesting happened this month?",
  "Tell me how things have been going for you lately.",
  "How’s everything in your world right now?",
  "What’s the vibe of your week been?",
  "What’s something that made you smile recently?",
  "How did your day start today?",
  "Anything fun or challenging happening for you lately?",
  "How are things outside of work?",
  "What’s one thing you're looking forward to this week?",
  "How do you usually prepare for interviews?",
  "Are you feeling relaxed or a little nervous?",
  "What’s a hobby or interest you're passionate about recently?",
  "Have you learned anything new this week?",
  "How’s your overall mood today?",
  "Is there anything you'd like to mention before we get started?",
  "What’s an achievement you feel good about lately?",
  "Is everything going smoothly on your side?",
  "What mindset are you bringing into today’s interview?",
  "What’s something you're excited about this month?",
  "What’s your current focus or goal professionally?",
  "Before we dive in, is there anything you'd like me to know?",
  "What’s something you've been enjoying recently?",
  "How has your routine been lately?",
  "Did anything interesting happen earlier today?",
  "What’s been the highlight of your week so far?",
  "What’s helping you stay motivated recently?",
  "What’s your energy like right now?",
  "Just checking in — how are you holding up?",
  "How’s everything going in general?",
  "Have you taken time to relax today?",
  "What’s been on your mind lately?",
  "Are you feeling comfortable before we begin?",
  "Do you want a quick warm-up chat before we start?",
];


    if (isFirstMessage) {
      // Random warm-up
      const warmup = warmups[Math.floor(Math.random() * warmups.length)];

      return NextResponse.json({
        question: warmup,
        success: true,
        warmup: true,
      });
    }

    // ✨ After warm-up, proceed to REAL questions
    let conversationMessages: Message[] = [
      {
        role: "system",
        content: `
You are an AI interviewer conducting a ${interviewType} interview.
Do NOT ask what type of interview it is again.

Resume included: ${resume ? "Yes" : "No"}
Company: ${company}
Position: ${position}
Experience: ${experience} years

QUESTION RULES:
- NEVER repeat a question already asked
- Use REAL questions from: ${sourceSites.join(", ")}
- Ask ONLY ONE question at a time
- Use resume + job description to tailor follow-up questions
- Maintain professional tone
- Increase difficulty gradually based on experience
        `,
      },
      ...messages,
    ];

    // ------------------------------------------------------------
    // 🧠 CALL HUGGINGFACE MODEL
    // ------------------------------------------------------------

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const chatRes = await hfClient.chatCompletion(
        {
          model: "meta-llama/Llama-3.1-8B-Instruct",
          messages: conversationMessages,
          temperature: 0.6,
          max_tokens: 300,
        },
        { signal: controller.signal }
      );

      clearTimeout(timeout);

      let aiResponse =
        chatRes?.choices?.[0]?.message?.content ||
        chatRes?.choices?.[0]?.message?.text ||
        "";

      if (!aiResponse || !aiResponse.trim()) {
        throw new Error("Empty model response");
      }

      // Remove repeated question
      if (askedQuestions.includes(aiResponse.trim())) {
        aiResponse += " (Follow-up: expand on your previous challenges)";
      }

      return NextResponse.json({
        question: aiResponse,
        success: true,
      });
    } catch (error) {
      console.error("MODEL ERROR → Using fallback", error);
    }

    // ------------------------------------------------------------
    // 🔥 FALLBACK QUESTIONS (Unique)
    // ------------------------------------------------------------

    const fallback: Record<string, string[]> = {
      technical: [
        "Walk me through a technical challenge you solved recently.",
        "Explain how you would optimize a slow backend service.",
        "How do you design scalable software systems?",
        "Explain concurrency vs parallelism with examples.",
        "Describe a time you improved performance significantly.",
      ],
      behavioral: [
        "Tell me about a time you resolved a conflict within a team.",
        "Describe a failure and what you learned.",
        "Tell me about a time you had to make a quick decision.",
        "Explain a leadership moment you're proud of.",
        "Describe a high-pressure situation you handled well.",
      ],
      "system-design": [
        "Design a scalable notification system.",
        "How would you design a global rate limiter?",
        "Design a distributed caching system.",
        "How would you architect Instagram?",
        "Explain how to design a URL shortener.",
      ],
      coding: [
        "Explain how you'd reverse a linked list.",
        "Detect a cycle in a graph — which algorithm would you use?",
        "Walk me through designing an LRU cache.",
        "Explain recursion vs iteration in detail.",
        "Solve the Two Sum problem efficiently.",
      ],
      mixed: [
        "Tell me about your background.",
        "Walk me through a hard problem from your resume.",
        "Design a messaging service.",
        "How do you debug complex issues?",
        "Explain your experience with CI/CD pipelines.",
      ],
    };

    const category =
      fallback[interviewType.toLowerCase()] || fallback["mixed"];

    // Filter out already used questions
    const unique = category.filter((q) => !askedQuestions.includes(q));

    const next =
      unique.length > 0
        ? unique[Math.floor(Math.random() * unique.length)]
        : category[Math.floor(Math.random() * category.length)];

    return NextResponse.json({
      question: next,
      success: true,
      usingFallback: true,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Server error",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
