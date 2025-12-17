from fastapi import APIRouter, HTTPException
from app.models import ChatRequest, ChatResponse
from app.gemini import generate_response

router = APIRouter()

@router.get("/health")
def health():
    return {"status": "healthy"}

@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    try:
        result = generate_response(req.message)

        return ChatResponse(
            reply=result["text"],
            latency_ms=result["latency_ms"],
            prompt_tokens=result["prompt_tokens"],
            response_tokens=result["response_tokens"],
            total_tokens=result["total_tokens"],
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
