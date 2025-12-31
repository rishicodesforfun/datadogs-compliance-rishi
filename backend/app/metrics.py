from datadog import statsd

def record_llm_metrics(latency_ms: int):
    # Total requests
    statsd.increment("llm.requests")

    # Latency distribution
    statsd.histogram("llm.latency_ms", latency_ms)

    # Slow request bucket (example: >700ms)
    if latency_ms > 700:
        statsd.increment("llm.requests.slow")
