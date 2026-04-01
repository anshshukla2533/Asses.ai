# Asses.ai

An AI-powered mock interview platform that simulates real-world technical interviews with conversational AI, voice interactions, and comprehensive candidate assessment.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Technical Components](#technical-components)
- [API Integrations](#api-integrations)
- [Development](#development)

## Overview

asses.ai is an intelligent interview simulation platform that conducts structured technical interviews. The system extracts candidate information from resumes, analyzes their GitHub repositories and LeetCode profiles, and uses Retrieval-Augmented Generation (RAG) to create personalized, context-aware interview questions. It conducts adaptive interviews covering introductions, core computer science concepts, and algorithmic problem-solving tailored to the candidate's experience and skill level.

## Features

### Core Functionality

- **Resume Analysis**: Extracts GitHub and LeetCode profiles from PDF/DOCX resumes
- **Profile Scraping**: Fetches repository details, README files, and LeetCode problem-solving statistics
- **RAG-Based Context**: Uses Retrieval-Augmented Generation to incorporate candidate profile data into interview questions
- **AI-Powered Interviews**: Conducts natural, conversational interviews using Google Gemini AI
- **Voice Interaction**: Supports speech-to-text and text-to-speech for realistic interview experience
- **Audio Recording**: Records candidate responses with keyboard-controlled recording
- **Structured Interview Flow**: 
  - Introduction and self-presentation
  - Core CS concepts (OOPs, DBMS)
  - Algorithmic coding questions based on candidate's profile
- **Redis Integration**: Stores chat history and maintains interview session state
- **Adaptive Questioning**: Adjusts difficulty based on candidate responses

## Architecture

### Backend (FastAPI + Python)

- **FastAPI Server**: REST API endpoints for interview management
- **Redis**: Session storage and chat history persistence
- **Docker**: Redis Stack containerization for easy deployment
- **RAG Pipeline**: Retrieval-Augmented Generation using candidate data from GitHub/LeetCode profiles
- **AI Integration**: Google Gemini 1.5 Pro for natural language generation
- **Audio Processing**: PyAudio for recording, AssemblyAI for transcription, pyttsx3 for TTS

### Frontend (React + Vite)

- **React 18**: Modern UI framework
- **Vite**: Fast development and build tooling
- **Tailwind CSS**: Utility-first styling
- **ESLint**: Code quality and consistency

## Project Structure

```
asses.ai/
├── client/                      # React frontend
│   ├── src/
│   │   ├── App.jsx             # Main application component
│   │   ├── main.jsx            # Application entry point
│   │   └── index.css           # Global styles
│   ├── public/                 # Static assets
│   └── package.json            # Frontend dependencies
│
├── server/                      # Python backend
│   ├── main.py                 # FastAPI application entry
│   ├── generate.py             # Google Gemini AI text generation
│   ├── redis_global.py         # Redis connection and Docker management
│   ├── requirements.txt        # Python dependencies
│   │
│   ├── Agents/                 # Interview conversation agents
│   │   ├── intro.py           # Introduction round agent
│   │   └── concept.py         # Technical interview agent
│   │
│   ├── Models/                 # Audio processing models
│   │   ├── record_audio.py    # Audio recording with PyAudio
│   │   ├── speech_to_text.py  # AssemblyAI transcription
│   │   └── text_to_speech.py  # pyttsx3 text-to-speech
│   │
│   ├── Scrapper/              # Profile scraping utilities
│   │   └── scrap.py           # GitHub and LeetCode data extraction
│   │
│   └── constant/              # Configuration and constants
│       └── resume.pdf         # Sample resume for testing
│
└── README.md                   # Project documentation
```

## Prerequisites

### System Requirements

- Python 3.8 or higher
- Node.js 16 or higher
- Docker Desktop (for Redis Stack)
- Microphone and speakers (for voice features)

### API Keys Required

- **Google Gemini API Key**: For AI text generation
- **AssemblyAI API Key**: For speech-to-text transcription

## Installation

### Backend Setup

1. Navigate to the server directory:
```powershell
cd server
```

2. Create a virtual environment:
```powershell
python -m venv venv
```

3. Activate the virtual environment:
```powershell
.\venv\Scripts\Activate.ps1
```

4. Install dependencies:
```powershell
pip install -r requirements.txt
```

5. Ensure Docker Desktop is running for Redis Stack

### Frontend Setup

1. Navigate to the client directory:
```powershell
cd client
```

2. Install dependencies:
```powershell
npm install
```

## Configuration

### Environment Variables

Create a `.env` file in the `server/` directory with the following variables:

```env
GOOGLE_API_KEY=your_google_gemini_api_key
ASSEMBLYAI_API_KEY=your_assemblyai_api_key
```

### Redis Configuration

Redis Stack automatically starts via Docker when `redis_global.py` is imported. The configuration includes:

- Redis Server: `localhost:6379`
- Redis Insight Dashboard: `localhost:8001`
- Docker container name: `redis-stack`

## Usage

### Starting the Backend

1. Ensure Docker Desktop is running

2. Start the FastAPI server:
```powershell
cd server
python main.py
```

The server will start on `http://0.0.0.0:8000` and automatically launch the Redis Stack container.

### Starting the Frontend

```powershell
cd client
npm run dev
```

The development server will start on `http://localhost:5173` (default Vite port).

### Running an Interview

#### Introduction Round

```powershell
cd server/Agents
python intro.py
```

This initiates the introduction phase where the AI interviewer:
- Introduces itself
- Asks for candidate self-introduction
- Engages in conversational follow-up
- Runs for minimum 2 minutes before transitioning

#### Technical Interview Round

```powershell
cd server/Agents
python concept.py
```

This starts the technical assessment covering:
- Core CS questions (OOPs, DBMS)
- Algorithmic coding problems based on LeetCode profile using RAG
- Progressive difficulty adjustment
- Optimization challenges for brute-force solutions

The agent uses RAG to retrieve candidate's LeetCode statistics and GitHub project information, incorporating this context into personalized technical questions.

### Resume Analysis

To extract candidate information:

```python
from Scrapper.scrap import get_github_details, get_leetcode_details

# Extract GitHub repository details
github_data = get_github_details("path/to/resume.pdf")

# Extract LeetCode problem-solving statistics
leetcode_data = get_leetcode_details("path/to/resume.pdf")
```

## Technical Components

### AI Text Generation (`generate.py`)

Uses Google Gemini 1.5 Pro model for natural language generation with context-aware prompting.

```python
from generate import generate_text

response = generate_text("Your prompt here")
```

### Audio Recording (`Models/record_audio.py`)

Records audio until Enter key is pressed, saves as WAV file.

```python
from Models.record_audio import record_audio

record_audio(output_file="recording.wav")
```

### Speech-to-Text (`Models/speech_to_text.py`)

Transcribes audio files using AssemblyAI API.

```python
from Models.speech_to_text import transcribe_audio

text = transcribe_audio("recording.wav")
```

### Text-to-Speech (`Models/text_to_speech.py`)

Converts text to speech using pyttsx3 engine.

```python
from Models.text_to_speech import text_to_speech

text_to_speech("Hello, welcome to the interview.")
```

### Redis Session Management

Chat history and session data are stored in Redis with structured keys:

- Introduction chat: `chat:{id}`
- Technical interview chat: `technical_interview:chat:{id}`
- Chat ID counters: `technical_interview_chat_id`

## API Integrations

### GitHub API

Fetches repository details and README content:
- Repository description
- README markdown content
- Public repository metadata

### LeetCode GraphQL API

Retrieves problem-solving statistics:
- Tag-wise problem counts (fundamental, intermediate, advanced)
- Problem categories (arrays, trees, graphs, etc.)
- Total problems solved per category

### Google Gemini API

Powers conversational AI with:
- Context-aware responses
- Adaptive questioning
- Natural language understanding
- Interview flow management
- RAG-enhanced prompting with retrieved candidate data

### AssemblyAI API

Provides accurate speech transcription:
- Audio file upload
- Asynchronous transcription processing
- Polling-based result retrieval

## Development

### Frontend Development

```powershell
cd client
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Backend Development

The FastAPI server includes automatic reload during development. Modify files in the `server/` directory and the server will restart automatically.

### Docker Management

Check Redis container status:
```powershell
docker ps -a --filter name=redis-stack
```

Stop Redis container:
```powershell
docker stop redis-stack
```

Remove Redis container:
```powershell
docker rm redis-stack
```

### Testing Interview Agents

Both interview agents can be tested independently:

- **Introduction Agent**: Tests conversational AI and basic interaction flow
- **Technical Agent**: Tests technical question generation and adaptive difficulty

Each agent maintains its own chat context and can run standalone for testing purposes.

## Notes

- Voice features are optional; interviews can be conducted via text input
- Redis container starts automatically when the server initializes
- Interview duration can be adjusted via the `conversation_duration` parameter
- The system supports both PDF and DOCX resume formats
- GitHub repositories must be public for scraping to work
- LeetCode profiles must be publicly visible

## Dependencies

### Backend

- fastapi: Web framework
- uvicorn: ASGI server
- redis: Redis client
- google-generativeai: Gemini AI SDK
- pyaudio: Audio recording
- pyttsx3: Text-to-speech
- requests: HTTP client
- python-dotenv: Environment management
- PyMuPDF (fitz): PDF processing
- python-docx: DOCX processing

### Frontend

- react: UI library
- react-dom: React rendering
- vite: Build tool
- tailwindcss: CSS framework
- eslint: Code linting

## License

This project is for educational and demonstration purposes.#
