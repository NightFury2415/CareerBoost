# 🚀 Quick Start Guide

## One-Minute Setup

### 1. Install & Run

```bash
cd CareerBoost
npm install
npm run dev
```

### 2. Open Browser

Go to: **http://localhost:3000/mock-interview**

### 3. Start Interview

- Fill in position, experience, company, and job description
- Click "Start Interview"
- Answer AI questions
- Download transcript when done

## File Structure

```
CareerBoost/
├── app/
│   ├── api/interview/chat/route.ts       ← API handles AI responses
│   └── mock-interview/page.tsx           ← Main interview page
├── components/
│   ├── interview-setup.tsx               ← Setup wizard (3 steps)
│   └── mock-interview-chat.tsx           ← Chat interface
├── .env.local                            ← Contains HUGGINGFACE_API_KEY ✅
└── README.md                             ← Full documentation
```

## What Was Changed

| File                              | Change                            | Status |
| --------------------------------- | --------------------------------- | ------ |
| `.env.local`                      | Added HUGGINGFACE_API_KEY         | ✅     |
| `app/api/interview/chat/route.ts` | Updated to use Mistral-7B model   | ✅     |
| `app/mock-interview/page.tsx`     | Fixed component imports           | ✅     |
| `README.md`                       | Added comprehensive documentation | ✅     |
| `SETUP_COMPLETE.md`               | Setup verification guide          | ✅     |

## How It Works

```
User → Setup Form
       ↓
    Config Stored
       ↓
    Chat Interface Loads
       ↓
    First Question Generated (API)
       ↓
    User Answers Question
       ↓
    Follow-up Question (API with history)
       ↓
    Repeat Until Time Up or End Interview
       ↓
    Download Transcript
```

## Key Features

🤖 **AI Interviewer** - Uses Mistral-7B via Hugging Face  
💬 **Smart Context** - Remembers conversation history  
⏱️ **Timer** - Visual time tracking  
📥 **Fallback** - Fallback questions if API fails  
📥 **Transcript** - Download for review

## Environment

```env
HUGGINGFACE_API_KEY=
```

✅ Already configured in `.env.local`  
✅ Protected by `.gitignore` (never commit)

## Common Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Supported Interview Types

- ✅ Technical Interview
- ✅ Behavioral Interview
- ✅ System Design
- ✅ Coding Round
- ✅ Mixed (All Types)

## If Something Breaks

1. **API not responding?**

   - Check `.env.local` has the API key
   - Restart dev server: `npm run dev`
   - Try the fallback system (should still work)

2. **Components not loading?**

   - Clear browser cache
   - Check console for errors
   - Verify all dependencies: `npm install`

3. **Import errors?**
   - All imports are already fixed
   - Clear `.next` folder: `rm -r .next`
   - Restart: `npm run dev`

## API Endpoint

**POST** `/api/interview/chat`

```json
{
  "position": "Full Stack Engineer",
  "experience": "5-7",
  "interviewType": "Technical",
  "company": "Meta",
  "jobDescription": "...",
  "messages": [],
  "isFirstMessage": true
}
```

Response:

```json
{
  "question": "Can you describe...",
  "success": true
}
```

## Next Steps

1. ✅ Set up complete
2. ▶️ Run `npm run dev`
3. ▶️ Open http://localhost:3000/mock-interview
4. ▶️ Start practicing!

---

**All setup files are in place and ready to go!**

See `README.md` for detailed documentation.
See `SETUP_COMPLETE.md` for verification details.
