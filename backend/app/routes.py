from fastapi import APIRouter
from .models import ChatRequest, ChatResponse
import time
import random

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    start = time.time()

    if random.random() < 0.3:
        time.sleep(1.5)

    reply = f"Echo: {req.message}"

    latency = (time.time() - start) * 1000

    return ChatResponse(
        reply=reply,
        latency_ms=round(latency, 2)
    )
