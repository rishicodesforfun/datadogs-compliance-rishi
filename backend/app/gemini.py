import os
import time
import google.generativeai as genai

print("🔥 Gemini module loaded")

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    raise RuntimeError("GEMINI_API_KEY environment variable not set")

genai.configure(api_key=api_key)

model = genai.GenerativeModel("models/gemini-1.0-pro")


def generate_response(prompt: str):
    start = time.time()

    response = model.generate_content(prompt)

    latency_ms = (time.time() - start) * 1000
    usage = response.usage_metadata

    return {
        "text": response.text,
        "latency_ms": round(latency_ms, 2),
        "prompt_tokens": usage.prompt_token_count,
        "response_tokens": usage.candidates_token_count,
        "total_tokens": usage.total_token_count,
    }
