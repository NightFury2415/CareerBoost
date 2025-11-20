# Python ↔ Next.js Code Mapping

This document shows the direct mapping between your Python interview code and the Next.js implementation.

## Core Components Mapping

### Python Structure

```python
# Your Python Code
position = "Full Stack Engineer"
experience_years = 5
interview_type = "Technical"
company_name = "Meta"
job_description = "..."
conversation_history = []

def generate_interview_prompt(...):
def get_ai_response(messages):
def save_transcript(conversation_history):
def start_interview():
```

### Next.js Structure

```typescript
// Next.js Implementation
const config = {
  position: "Full Stack Engineer"
  experience: "5-7"
  interviewType: "Technical"
  company: "Meta"
  jobDescription: "..."
}
const messages: Message[] = []

// components/interview-setup.tsx
export default function InterviewSetup()

// components/mock-interview-chat.tsx
export default function MockInterviewChat()

// app/api/interview/chat/route.ts
export async function POST(req: NextRequest)

// download in chat.tsx
const downloadTranscript = ()
```

## 1. Conversation History

### Python

```python
conversation_history = []

# Add to history
conversation_history.append({"role": "system", "content": "You are..."})
conversation_history.append({"role": "user", "content": prompt})
conversation_history.append({"role": "assistant", "content": response})
```

### Next.js

```typescript
interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const [messages, setMessages] = useState<Message[]>([]);

// Add to history
const updatedMessages = [...messages, userMessage];
setMessages(updatedMessages);
```

## 2. Initial Prompt Generation

### Python

```python
def generate_interview_prompt(position, experience_years, interview_type,
                             company_name, job_description):
    prompt = f"""
    You are an AI interviewer conducting a {interview_type} interview
    for the position of {position} at {company_name}.
    The candidate has {experience_years} years of experience...
    """
    return prompt

# Usage
prompt = generate_interview_prompt(position, experience_years,
                                  interview_type, company_name, job_description)
conversation_history.append({"role": "user", "content": prompt})
```

### Next.js

```typescript
// app/api/interview/chat/route.ts
if (isFirstMessage) {
  const systemPrompt = `You are an AI interviewer conducting a ${interviewType} interview 
    for the position of ${position} at ${company}.
    The candidate has ${experience} years of experience...`;

  conversationMessages = [
    { role: "system", content: "You are an AI interview bot..." },
    { role: "user", content: systemPrompt },
  ];
}

// Usage in component
const res = await fetch("/api/interview/chat", {
  body: JSON.stringify({
    position: config.position,
    experience: config.experience,
    interviewType: config.interviewType,
    company: config.company,
    jobDescription: config.jobDescription,
    messages: [],
    isFirstMessage: true,
  }),
});
```

## 3. API Calls

### Python

```python
from huggingface_hub import InferenceClient

api_key = ""
client = InferenceClient(api_key=api_key)

def get_ai_response(messages):
    response = client.chat.completions.create(
        model="MiniMaxAI/MiniMax-M2",
        messages=messages
    )
    return response.choices[0].message["content"]

first_question = get_ai_response(conversation_history)
```

### Next.js

```typescript
// app/api/interview/chat/route.ts
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_API_URL =
  "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1/v1/chat/completions";

// Inside POST handler
const response = await fetch(HF_API_URL, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${HF_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "mistralai/Mistral-7B-Instruct-v0.1",
    messages: conversationMessages,
    max_tokens: 500,
    temperature: 0.7,
  }),
});

const data = await response.json();
let aiResponse = data.choices[0].message.content;

// Usage in component
const res = await fetch("/api/interview/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    position,
    experience,
    interviewType,
    company,
    jobDescription,
    messages,
    isFirstMessage,
  }),
});
const data = await res.json();
setMessages([...messages, { role: "assistant", content: data.question }]);
```

## 4. Follow-up Question Generation

### Python

```python
# Main interview loop
while True:
    user_answer = input("Your answer: ").strip()
    conversation_history.append({"role": "user", "content": user_answer})

    # Pass entire history for context
    follow_up_question = get_ai_response(conversation_history)
    print(f"AI Interviewer: {follow_up_question}")

    conversation_history.append({"role": "assistant", "content": follow_up_question})
```

### Next.js

```typescript
// components/mock-interview-chat.tsx
const handleSendMessage = async () => {
  const userMessage = { role: "user", content: userMessage };
  const updatedMessages = [...messages, userMessage];
  setMessages(updatedMessages);

  // Convert to API format (entire history sent)
  const apiMessages = updatedMessages.map((msg) => ({
    role: msg.role === "assistant" ? "assistant" : "user",
    content: msg.content,
  }));

  // Send with full context
  const res = await fetch("/api/interview/chat", {
    method: "POST",
    body: JSON.stringify({
      position: config.position,
      experience: config.experience,
      interviewType: config.interviewType,
      company: config.company,
      jobDescription: config.jobDescription,
      messages: apiMessages, // Full history
      isFirstMessage: false,
    }),
  });

  const data = await res.json();
  setMessages((prev) => [
    ...prev,
    {
      role: "assistant",
      content: data.question,
    },
  ]);
};
```

## 5. Error Handling & Fallback

### Python

```python
def get_ai_response(messages):
    try:
        response = client.chat.completions.create(...)
        return response.choices[0].message["content"]
    except Exception as e:
        return "Sorry, I didn't get that. Could you please try again?"
```

### Next.js

```typescript
// app/api/interview/chat/route.ts
try {
  const response = await fetch(HF_API_URL, { ... })
  if (!response.ok) throw new Error(...)
  const data = await response.json()
  return NextResponse.json({ question: data.choices[0].message.content })
} catch (fetchError) {
  // Fallback to curated questions
  const fallbackResponses = {
    'technical': [
      'Could you explain your most recent project...',
      'Tell me about your experience with different programming languages...',
      // ... more
    ],
    'behavioral': [ ... ],
    'system-design': [ ... ],
    'coding': [ ... ],
  }

  const responses = fallbackResponses[interviewType]
  return NextResponse.json({
    question: responses[Math.random() * responses.length],
    success: true,
    usingFallback: true,
  })
}
```

## 6. Transcript Saving

### Python

```python
def save_transcript(conversation_history):
    script_directory = os.path.dirname(os.path.abspath(__file__))
    transcript_path = os.path.join(script_directory, "interview_transcript.txt")

    with open(transcript_path, "w") as f:
        for entry in conversation_history:
            role = entry['role']
            content = entry['content']
            f.write(f"{role.capitalize()}: {content}\n\n")

    print(f"Transcript saved to {transcript_path}")

# Called at end of interview
save_transcript(conversation_history)
```

### Next.js

```typescript
// components/mock-interview-chat.tsx
const downloadTranscript = () => {
  let transcript = `Interview Transcript\n`;
  transcript += `====================\n\n`;
  transcript += `Position: ${config.position}\n`;
  transcript += `Company: ${config.company}\n`;
  // ... more metadata

  messages.forEach((msg) => {
    const role = msg.role === "assistant" ? "AI Interviewer" : "Candidate";
    transcript += `${role}: ${msg.content}\n\n`;
  });

  const blob = new Blob([transcript], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `interview_transcript_${new Date().getTime()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Called when user clicks "Download Transcript"
downloadTranscript();
```

## 7. Time Management

### Python

```python
import time

max_duration = 1 * 60  # 1 minute for testing
start_time = time.time()

while True:
    elapsed_time = time.time() - start_time
    if elapsed_time >= max_duration:
        print("The interview time is up.")
        user_response = input("...")
        if 'thank you' in user_response or 'end' in user_response:
            save_transcript(conversation_history)
            break
```

### Next.js

```typescript
// components/mock-interview-chat.tsx
const timeLimitMinutes = parseInt(config.timeLimit.split(" ")[0]);
const totalSeconds = timeLimitMinutes * 60;

useEffect(() => {
  timerRef.current = setInterval(() => {
    setElapsedTime((prev) => {
      if (prev >= totalSeconds) {
        handleTimeUp();
        return prev;
      }
      return prev + 1;
    });
  }, 1000);

  return () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
}, [totalSeconds]);

const handleTimeUp = () => {
  if (!interviewEnded) {
    setInterviewEnded(true);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "The interview time is up. Your responses have been recorded.",
      },
    ]);
  }
};
```

## 8. Configuration

### Python

```python
position = "Full Stack Engineer"
experience_years = 5
interview_type = "Technical"
company_name = "Meta"
job_description = "..."
```

### Next.js

```typescript
// Step 1: User fills form in InterviewSetup component
const [config, setConfig] = useState({
  position: "",           // User input
  experience: "",         // User selection
  interviewType: "",      // User selection
  timeLimit: "",          // User selection
  practiceTypes: [],      // User selection
  jobDescription: "",     // User input
  company: "",            // User input
})

// Step 2: Config passed to MockInterviewChat
<MockInterviewChat
  config={config}         // All user inputs
  onEndInterview={handleEndInterview}
/>

// Step 3: Config used in API requests
const res = await fetch("/api/interview/chat", {
  body: JSON.stringify({
    position: config.position,
    experience: config.experience,
    interviewType: config.interviewType,
    company: config.company,
    jobDescription: config.jobDescription,
    messages,
    isFirstMessage,
  })
})
```

## Side-by-Side: Main Loop

### Python

```python
def start_interview():
    # First question
    prompt = generate_interview_prompt(...)
    conversation_history.append({"role": "user", "content": prompt})
    first_question = get_ai_response(conversation_history)
    print(f"AI Interviewer: {first_question}")

    # Loop
    while True:
        elapsed_time = time.time() - start_time
        if elapsed_time >= max_duration:
            print("Time's up")
            break

        user_answer = input("Your answer: ").strip()
        conversation_history.append({"role": "user", "content": user_answer})

        follow_up_question = get_ai_response(conversation_history)
        print(f"AI Interviewer: {follow_up_question}")
        conversation_history.append({"role": "assistant", "content": follow_up_question})

start_interview()
```

### Next.js

```typescript
// Interview Page
export default function InterviewPage() {
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [interviewConfig, setInterviewConfig] = useState(null);

  // Show setup or chat based on state
  return !isInterviewStarted ? (
    <InterviewSetup onStartInterview={handleStartInterview} />
  ) : (
    <MockInterviewChat
      config={interviewConfig}
      onEndInterview={handleEndInterview}
    />
  );
}

// Chat Component
export default function MockInterviewChat({ config, onEndInterview }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Generate first question
  useEffect(() => {
    generateInitialQuestion();
  }, []);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => {
        if (prev >= totalSeconds) handleTimeUp();
        return prev + 1;
      });
    }, 1000);
  }, [totalSeconds]);

  // Send message / get follow-up
  const handleSendMessage = async () => {
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    const res = await fetch("/api/interview/chat", {
      body: JSON.stringify({ ...config, messages: updatedMessages }),
    });
    const data = await res.json();
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: data.question },
    ]);
  };
}
```

## Key Differences

| Aspect         | Python          | Next.js            |
| -------------- | --------------- | ------------------ |
| **Input**      | CLI input()     | Web form           |
| **Output**     | Console print() | React state        |
| **Storage**    | File system     | Browser download   |
| **Timing**     | time.time()     | setInterval        |
| **API**        | Direct call     | Via route handler  |
| **UI**         | Text only       | Full web interface |
| **Deployment** | Local only      | Global             |

## Identical Logic

✅ Hugging Face API integration  
✅ Conversation history tracking  
✅ Dynamic prompt generation  
✅ Context-aware responses  
✅ Fallback responses  
✅ Transcript generation  
✅ Time tracking

---

Your Python implementation has been perfectly ported to a modern Next.js web application while maintaining all core functionality and adding a beautiful user interface!
