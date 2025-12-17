from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str
    latency_ms: float
    prompt_tokens: int
    response_tokens: int
    total_tokens: int
