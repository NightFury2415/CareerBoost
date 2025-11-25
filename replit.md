# CareerBoost - AI Mock Interview Platform

## Overview
CareerBoost is a Next.js-based platform for practicing technical interviews with AI-powered adaptive questioning. Built with Next.js 16, React 18, and Hugging Face AI models.

## Project Type
- **Framework**: Next.js 16 (React 18)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4.1
- **UI Components**: shadcn/ui with Radix UI primitives

## Features
1. **AI Mock Interviews**: Adaptive interview questions powered by Mistral-7B-Instruct
2. **Voice Mode**: Speech-to-Text (Whisper) and Text-to-Speech (XTTS-v2)
3. **Resume Builder**: Create and download professional resumes as PDF
4. **Big Six Strategy Guide**: Curated interview tips for major tech companies (Google, Amazon, Meta, etc.)
5. **Transcript Download**: Save interview sessions as text files

## Architecture
- **Frontend**: Next.js app running on port 5000 (configured for Replit)
- **Backend**: Next.js API routes for AI chat, STT, and TTS
- **AI Provider**: Hugging Face Inference API

## Environment Configuration
- **Required Secrets**: 
  - `HUGGINGFACE_API_KEY`: For AI chat, speech-to-text, and text-to-speech features
  - Get your API key from: https://huggingface.co/settings/tokens

## Development Setup
- **Dev Server**: Runs on 0.0.0.0:5000 (Replit-compatible)
- **Host Configuration**: Configured to allow proxy requests (Next.js allowedOrigins)
- **Build System**: Next.js with TypeScript compilation

## Routes
- `/` - Home page
- `/mock-interview` - Main interview interface
- `/resume-builder` - Resume creation tool
- `/big-six-hack` - Interview strategy guide
- `/api/interview/chat` - AI chat endpoint
- `/api/interview/stt` - Speech-to-text endpoint
- `/api/interview/tts` - Text-to-speech endpoint

## Recent Changes
- **2025-11-25**: Initial Replit setup
  - Configured Next.js to run on port 5000 with host 0.0.0.0
  - Added allowedOrigins to support Replit proxy
  - Set up workflow for automatic dev server restart

## User Preferences
None set yet

## Project Dependencies
All dependencies are already installed via npm (see package.json)
