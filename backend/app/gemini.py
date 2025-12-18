import time

def generate_response(prompt: str):
    """
    Temporary stub while Gemini / Vertex AI billing is pending.
    This allows observability, tracing, and UI to function.
    """

    start = time.time()

    # Simulate model latency
    if "[SLOW]" in prompt:
        time.sleep(1.5)
    else:
        time.sleep(0.2)

    latency_ms = (time.time() - start) * 1000

    return {
        "text": f"Echo (stub): {prompt}",
        "latency_ms": round(latency_ms, 2),
        "prompt_tokens": 0,
        "response_tokens": 0,
        "total_tokens": 0,
    }
