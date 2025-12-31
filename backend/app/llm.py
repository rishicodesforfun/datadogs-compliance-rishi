import time
from datadog import statsd

def generate_response(prompt: str) -> dict:
    start = time.time()

    slow = "[SLOW]" in prompt
    if slow:
        time.sleep(1.5)
        text = prompt.replace("[SLOW]", "").strip()
    else:
        time.sleep(0.2)
        text = prompt

    latency_ms = int((time.time() - start) * 1000)

    # 🔥 Custom Datadog metrics
    statsd.histogram("llm.latency_ms", latency_ms)
    statsd.increment("llm.requests")
    statsd.increment("llm.requests.slow" if slow else "llm.requests.fast")

    return {
        "text": f"Echo: {text}",
        "latency_ms": latency_ms,
        "prompt_tokens": len(prompt.split()),
        "response_tokens": len(text.split()),
        "total_tokens": len(prompt.split()) + len(text.split()),
        "model": "stub-llm"
    }
