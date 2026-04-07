from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from redis_global import redis_client

app = FastAPI()

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

    try:
        redis_client.ping()
    except Exception:
        redis_status = "disconnected"

    return {
        "status": "ok",
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

