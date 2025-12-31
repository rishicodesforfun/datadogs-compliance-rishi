from fastapi import APIRouter, HTTPException
import random
import time

from .models import ChatRequest, ChatResponse
from .metrics import record_llm_metrics

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    message = req.message

    try:
        # Simulate latency
        if "slow" in message.lower():
            delay = random.uniform(0.3, 1.2)  # 300–1200ms
            time.sleep(delay)
            latency_ms = int(delay * 1000)
        else:
            latency_ms = random.randint(50, 150)

        # 🔥 Emit Datadog metrics
        record_llm_metrics(latency_ms)

        return ChatResponse(
            reply=f"Echo: {message}",
            latency_ms=latency_ms,
            prompt_tokens=random.randint(5, 15),
            response_tokens=random.randint(20, 60),
            total_tokens=random.randint(25, 80),
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
