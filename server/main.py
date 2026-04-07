import json
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from redis_global import redis_client
from Scrapper.scrap import get_github_details, get_leetcode_details

app = FastAPI()

resume_path = os.path.join(os.path.dirname(__file__), "constant", "resume.pdf")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    if redis_client.get("visits") is None:
        redis_client.set("visits", 0)
except Exception:
    pass

@app.get("/")
def read_root():
    visits = 0

    try:
        visits = redis_client.incr("visits")
    except Exception:
        visits = 0

    return {
        "message": "asses.ai backend is running",
        "visits": visits
    }

@app.get("/health")
def health_check():
    redis_status = "connected"
    status = "ok"

    try:
        redis_client.ping()
    except Exception:
        redis_status = "disconnected"
        status = "degraded"

    return {
        "status": status,
        "redis": redis_status
    }

@app.get("/api/platform-summary")
def platform_summary():
    return {
        "name": "asses.ai",
        "features": [
            "Resume Analysis",
            "Profile Scraping",
            "Voice Interaction",
            "Structured Interview Flow"
        ],
        "rounds": [
            "Introduction and self-presentation",
            "Core CS concepts",
            "Algorithmic coding questions"
        ]
    }

@app.get("/api/resume-analysis")
def resume_analysis():
    github_details = []
    leetcode_details = ""

    try:
        github_details = get_github_details(resume_path)
    except Exception:
        github_details = []

    try:
        leetcode_details = get_leetcode_details(resume_path)
    except Exception:
        leetcode_details = ""

    try:
        leetcode_details = json.loads(leetcode_details) if leetcode_details else {}
    except Exception:
        pass

    return {
        "resumePath": resume_path,
        "githubDetails": github_details,
        "leetcodeDetails": leetcode_details
    }

@app.get("/api/chat-history")
def chat_history():
    intro_messages = []
    technical_messages = []

    try:
        intro_keys = sorted(redis_client.keys("chat:*"))

        for key in intro_keys:
            value = redis_client.get(key)

            if value:
                intro_messages.append(json.loads(value))
    except Exception:
        intro_messages = []

    try:
        technical_keys = sorted(redis_client.keys("technical_interview:chat:*"))

        for key in technical_keys:
            value = redis_client.get(key)

            if value:
                technical_messages.append(json.loads(value))
    except Exception:
        technical_messages = []

    return {
        "intro": intro_messages,
        "technical": technical_messages
    }

@app.get("/api/session-status")
def session_status():
    intro_count = 0
    technical_count = 0
    resume_available = os.path.exists(resume_path)

    try:
        intro_count = len(redis_client.keys("chat:*"))
    except Exception:
        intro_count = 0

    try:
        technical_count = len(redis_client.keys("technical_interview:chat:*"))
    except Exception:
        technical_count = 0

    return {
        "resumeAvailable": resume_available,
        "introMessages": intro_count,
        "technicalMessages": technical_count,
        "hasInterviewData": intro_count > 0 or technical_count > 0
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

