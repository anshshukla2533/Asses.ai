import subprocess
import time
from redis import Redis

def start_redis_container():
    """Start Redis container if it's not already running."""
    try:
        # Check if Redis container is running
        result = subprocess.run(["docker", "ps", "-q", "--filter", "name=redis-stack"], 
                                capture_output=True, text=True)
        if not result.stdout.strip():
            print("🚀 Starting Redis container...")
            subprocess.run([
                "docker", "run", "-d", "--name", "redis-stack",
                "-p", "6379:6379", "-p", "8001:8001", "redis/redis-stack:latest"
            ], check=True)
            print("✅ Redis container started successfully.")
            time.sleep(5)  # Wait for Redis to initialize
        else:
            print("✅ Redis container is already running.")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error starting Redis: {e}")

# Start Redis container automatically
start_redis_container()

# Connect to Redis
try:
    redis_client = Redis(host="localhost", port=6379, decode_responses=True)
    redis_client.ping()
    print("✅ Connected to Redis")
except Exception as e:
    print(f"❌ Redis connection failed: {e}")


