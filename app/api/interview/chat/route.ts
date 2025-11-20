// app/api/interview/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { InferenceClient } from '@huggingface/inference';

// Prefer environment variable; fall back to the provided key for local dev.
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Create the InferenceClient which will handle provider routing for us.
const hfClient = new InferenceClient(HF_API_KEY);


interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  position: string;
  experience: string;
  interviewType: string;
  company: string;
  jobDescription: string;
  messages: Message[];
  isFirstMessage?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    if (!HF_API_KEY) {
      return NextResponse.json(
        { error: 'Hugging Face API key is not configured' },
        { status: 500 }
      );
    }

    const body: ChatRequest = await req.json();
    const {
      position,
      experience,
      interviewType,
      company,
      jobDescription,
      messages,
      isFirstMessage = false,
    } = body;

    // Build conversation history
    let conversationMessages: Message[] = [];

    if (isFirstMessage) {
      // Generate initial interview prompt
      const systemPrompt = `You are an AI interviewer conducting a ${interviewType} interview for the position of ${position} at ${company}.
The candidate has ${experience} years of experience and is applying for a role that involves the following job responsibilities:
${jobDescription}

Please ask relevant interview questions based on the following:
1. Technical knowledge relevant to the position.
2. Experience based on the years in the field.
3. Role-specific challenges they might face at ${company}.
4. Be sure to ask deep technical questions if the candidate has extensive experience (e.g., more than 5 years).

Guidelines:
- Ask ONE question at a time
- Listen carefully to the candidate's responses
- Ask follow-up questions based on their answers
- Adapt the difficulty based on their responses
- Be professional yet conversational

Start the interview now and ask the first question.`;

      conversationMessages = [
        { role: 'system', content: 'You are an AI interview bot conducting a professional technical interview.' },
        { role: 'user', content: systemPrompt },
      ];
    } else {
      // Continue conversation with context
      conversationMessages = [
        {
          role: 'system',
          content: `You are an AI interviewer for a ${interviewType} interview for the ${position} position at ${company}. The candidate has ${experience} years of experience. Continue the interview by asking relevant follow-up questions based on their previous answers. Ask ONE question at a time and adapt based on their responses.`,
        },
        ...messages,
      ];
    }

    try {
      // Use the HF JS client to request a chat completion. This handles provider routing
      // and model/provider selection automatically. We still keep a timeout guard.
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      try {
        const chatRes = await hfClient.chatCompletion({
          model: 'MiniMaxAI/MiniMax-M2:novita',
          messages: conversationMessages as any,
          temperature: 0.7,
          max_tokens: 500,
          // provider: 'auto' // optional
        }, { signal: controller.signal });

        clearTimeout(timeout);

        // The SDK returns an object similar to the router API
        let aiResponse = '';
        if (chatRes.choices && chatRes.choices.length > 0) {
          aiResponse = chatRes.choices[0].message?.content || chatRes.choices[0].message?.text || '';
        }

        if (!aiResponse || !aiResponse.trim()) {
          throw new Error('Empty response from API');
        }

        return NextResponse.json({ question: aiResponse, success: true });
      } finally {
        clearTimeout(timeout);
      }
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      
      // Fallback responses based on context
      const fallbackResponses: { [key: string]: string[] } = {
        'technical': [
          'Could you explain your most recent project and the technical challenges you faced?',
          'Tell me about your experience with different programming languages and frameworks.',
          'How do you approach debugging and problem-solving in your code?',
          'Describe your experience with databases and data management.',
          'What development tools and methodologies do you prefer?',
        ],
        'behavioral': [
          'Tell me about a time you had to work with a difficult team member.',
          'Describe a situation where you had to learn something new quickly.',
          'How do you handle tight deadlines and pressure?',
          'Tell me about a failure and what you learned from it.',
          'How do you prioritize tasks when everything seems urgent?',
        ],
        'system-design': [
          'How would you design a system to handle millions of concurrent users?',
          'Explain how you would scale a web application from thousands to billions of requests.',
          'What are the key considerations when designing a distributed system?',
          'How would you approach database optimization for a large-scale application?',
          'Describe your approach to system reliability and fault tolerance.',
        ],
        'coding': [
          'Write a function that reverses a string.',
          'How would you implement a binary search algorithm?',
          'Solve the problem of finding duplicate numbers in an array.',
          'Implement a data structure that supports efficient insertions and lookups.',
          'Write code to traverse a tree in different ways.',
        ],
        'mixed': [
          'Tell me about your background and why you are interested in this role.',
          'What is the most complex system you have designed or worked on?',
          'How do you approach technical challenges in your work?',
          'Describe your experience with team collaboration and code reviews.',
          'What is your experience with cloud platforms and deployment?',
        ],
      };

      const responses = fallbackResponses[interviewType.toLowerCase()] || fallbackResponses['mixed'];
      const randomIndex = Math.floor(Math.random() * responses.length);
      
      return NextResponse.json({
        question: responses[randomIndex],
        success: true,
        usingFallback: true,
      });
    }
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate response',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}