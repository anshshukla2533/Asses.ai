import subprocess
from fastapi import FastAPI,Request
from redis import Redis
import uvicorn
import json
import time
from redis_global import redis_client

app = FastAPI()

redis_client.set("visits", 0)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

