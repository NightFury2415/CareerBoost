# AI Mock Interview Setup Guide

CareerBoost is a Next.js-based platform for practicing interviews with AI-powered adaptive questioning.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

All required dependencies are already listed in `package.json`:

- Next.js 16.0+
- React 18.3+
- shadcn/ui components
- TailwindCSS 4.1+
- Lucide React icons

### 2. Environment Setup

Your `.env.local` file should contain your Hugging Face API key:

```env
HUGGINGFACE_API_KEY=
```

**Important:** `.env.local` is already in `.gitignore` - never commit this file!

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000/mock-interview](http://localhost:3000/mock-interview) in your browser.

## 🎯 How to Use the Platform

### Interview Flow

1. **Navigate to:** `http://localhost:3000/mock-interview`

2. **Step 1 - Setup:**

   - Enter position name (e.g., "Full Stack Developer", "Senior Engineer")
   - Select years of experience (0-1, 1-3, 3-5, 5-7, 7-10, 10+)
   - Choose interview type (Technical, Behavioral, System Design, Coding, Mixed)

3. **Step 2 - Preferences:**

   - Set time limit (30 mins, 45 mins, 1 hour, 90 mins)
   - Select practice areas (Coding, Technical, System Design, Behavioral, Mixed)
   - Paste job description for targeted preparation

4. **Step 3 - Company:**

   - Enter company name
   - Click "Start Interview"

5. **Interview:**
   - Answer questions in the chat interface
   - AI asks follow-up questions based on your responses
   - Monitor time remaining in the header
   - Download transcript anytime
   - Click "End Interview" when done

## 🔧 Technical Architecture

### API Route: `/api/interview/chat`

**Endpoint:** `POST /api/interview/chat`

**Request Body:**

```json
{
  "position": "Senior Software Engineer",
  "experience": "5-7",
  "interviewType": "technical",
  "company": "Meta",
  "jobDescription": "...",
  "messages": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ],
  "isFirstMessage": false
}
```

**Response:**

```json
{
  "question": "Can you describe your experience with...",
  "success": true,
  "usingFallback": false
}
```

### Components

#### `interview-setup.tsx`

- 3-step wizard for interview configuration
- Position, experience level, interview type selection
- Time limit and practice area preferences
- Job description input

#### `mock-interview-chat.tsx`

- Real-time chat interface
- Message history with timestamps
- Timer with visual progress indicator
- Transcript download functionality
- AI response generation with fallback support

#### `page.tsx`

- Main page component
- Manages interview state (setup vs. active interview)
- Routes between setup and chat components

## 🤖 AI Integration

### Hugging Face API

The platform uses the **Mistral-7B-Instruct** model via Hugging Face API:

```
Model: mistralai/Mistral-7B-Instruct-v0.1
API: https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1/v1/chat/completions
```

**Features:**

- Context-aware responses
- Conversation history tracking
- Interview-type specific questioning
- Adaptive difficulty based on experience level

### Fallback System

If the Hugging Face API is unavailable, the system uses curated fallback questions based on interview type:

- **Technical:** Questions about projects, technical challenges, tools
- **Behavioral:** Questions about teamwork, failures, stress management
- **System Design:** Questions about scalability, architecture, databases
- **Coding:** Algorithm and data structure problems
- **Mixed:** Combination of all types

## 🔑 Key Features

✅ **AI-Powered Questions** - Uses Mistral-7B via Hugging Face API  
✅ **Context-Aware** - Remembers conversation history  
✅ **Adaptive Difficulty** - Adjusts based on experience level  
✅ **Time Management** - Configurable timer with warnings  
✅ **Transcript Download** - Save interviews for review  
✅ **Fallback Handling** - Works even if API has issues  
✅ **Multiple Interview Types** - Technical, Behavioral, System Design, Coding  
✅ **Responsive Design** - Works on desktop and tablet

## 🧪 Testing

### Test the API Directly

```bash
curl -X POST http://localhost:3000/api/interview/chat \
  -H "Content-Type: application/json" \
  -d '{
    "position": "Full Stack Engineer",
    "experience": "5-7",
    "interviewType": "technical",
    "company": "Meta",
    "jobDescription": "We are looking for...",
    "messages": [],
    "isFirstMessage": true
  }'
```

Expected response:

```json
{
  "question": "Can you describe your experience with full-stack development?",
  "success": true
}
```

### Test the Frontend

1. Navigate to `http://localhost:3000/mock-interview`
2. Fill in the setup form
3. Start the interview and interact with the chat
4. Download the transcript to verify functionality

## 🐛 Troubleshooting

### Issue: 500 Internal Server Error

**Cause:** API route not found or Hugging Face API key missing

**Solution:**

1. Verify `app/api/interview/chat/route.ts` exists
2. Check that `HUGGINGFACE_API_KEY` is set in `.env.local`
3. Restart dev server: `npm run dev`
4. Check server logs for detailed error messages

### Issue: Module not found errors

**Cause:** Missing component imports

**Solution:**

```bash
# Make sure these shadcn/ui components are installed:
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add alert
```

### Issue: Slow API responses

**Cause:** Hugging Face API is loading the model

**Solution:**

- First request takes 30-60 seconds as the model loads
- Subsequent requests are faster
- The fallback system provides instant responses if needed

### Issue: Chat component not showing messages

**Cause:** Component state not updating properly

**Solution:**

1. Check browser console for JavaScript errors
2. Verify the API is returning responses correctly
3. Clear browser cache and reload
4. Check that all required UI components are installed

## 📝 Environment Variables

```env
# Hugging Face API Key (Required)
# Get from: https://huggingface.co/settings/tokens
HUGGINGFACE_API_KEY=your_key_here
```

## 🚀 Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Setup for Production

1. Set environment variables in your hosting platform (Vercel, Railway, etc.)
2. Never commit `.env.local` to version control
3. Use secure secret management for API keys

### Deployment on Vercel (Recommended)

```bash
vercel deploy
```

Configure environment variables in Vercel dashboard:

- `HUGGINGFACE_API_KEY`

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Hugging Face API](https://huggingface.co/docs/api-inference/quicktour)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/)

## 🤝 Contributing

To add new features or interview types:

1. Update `interview-setup.tsx` to add new options
2. Modify `route.ts` to handle new interview types
3. Add corresponding fallback questions
4. Test with `mock-interview-chat.tsx`

## 📋 Next Steps

- [ ] Add user authentication
- [ ] Implement database for storing interview history
- [ ] Add scoring and feedback system
- [ ] Create interview analytics dashboard
- [ ] Add more AI models/providers
- [ ] Implement real-time collaboration features
- [ ] Add mobile app version

## 📄 License

Private project for CareerBoost

---

**Last Updated:** November 2025
