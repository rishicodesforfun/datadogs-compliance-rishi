import { useState, useEffect, useRef } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [latency, setLatency] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [simulateSlow, setSimulateSlow] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setReply("");
    setLatency(null);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: simulateSlow ? `[SLOW] ${message}` : message,
        }),
      });

      if (!res.ok) throw new Error("Backend error");

      const data = await res.json();
      setReply(data.reply);
      setLatency(data.latency_ms);
    } catch {
      setError("Unable to reach backend");
    } finally {
      setLoading(false);
    }
  };

  const latencyColor =
    latency === null
      ? "#666"
      : latency < 800
      ? "#0f0"
      : latency < 1500
      ? "#fa0"
      : "#f00";

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "100vh",
        background: "#000",
        fontFamily: "monospace",
        padding: 0,
        margin: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.06), transparent 40%)`,
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <header
        style={{
          padding: "20px 40px",
          borderBottom: "1px solid #222",
          background: "#000",
          position: "relative",
        }}
      >
        <h1 style={{ margin: 0, color: "#fff", fontSize: 24, fontWeight: 400, letterSpacing: "0.5px" }}>
          LLM Ops Control Panel
        </h1>
        <p style={{ margin: "6px 0 0", color: "#666", fontSize: 13 }}>
          Monitor latency, errors, and runtime behavior of an LLM-backed system.
        </p>
      </header>

      {/* Main Content */}
      <main
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 24,
          padding: "40px",
          minHeight: "calc(100vh - 100px)",
        }}
      >
        {/* Left: Chat */}
        <section
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid #222",
            borderRadius: 4,
            padding: 24,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.03), transparent 70%)`,
              pointerEvents: "none",
              borderRadius: 4,
            }}
          />
          <h2 style={{ marginBottom: 16, color: "#fff", fontSize: 16, fontWeight: 400, position: "relative" }}>
            Send Prompt
          </h2>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask the model something…"
            rows={6}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 2,
              border: "1px solid #333",
              fontSize: 13,
              resize: "none",
              background: "#0a0a0a",
              color: "#ccc",
              outline: "none",
              fontFamily: "monospace",
              position: "relative",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 16,
              position: "relative",
            }}
          >
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                padding: "10px 20px",
                borderRadius: 2,
                border: "1px solid #444",
                background: loading ? "#111" : "#000",
                color: loading ? "#555" : "#fff",
                fontWeight: 400,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "monospace",
                fontSize: 13,
              }}
            >
              {loading ? "Sending…" : "Send"}
            </button>

            <label style={{ fontSize: 13, color: "#666", display: "flex", alignItems: "center", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={simulateSlow}
                onChange={(e) => setSimulateSlow(e.target.checked)}
                style={{ marginRight: 8, cursor: "pointer" }}
              />
              Simulate slow request
            </label>
          </div>
        </section>

        {/* Right: Metrics */}
        <section
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid #222",
            borderRadius: 4,
            padding: 24,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.03), transparent 70%)`,
              pointerEvents: "none",
              borderRadius: 4,
            }}
          />
          <h2 style={{ marginBottom: 16, color: "#fff", fontSize: 16, fontWeight: 400, position: "relative" }}>
            Last Request Metrics
          </h2>

          {error && (
            <div
              style={{
                background: "#100",
                border: "1px solid #300",
                borderRadius: 2,
                padding: 12,
                color: "#f66",
                fontSize: 13,
                position: "relative",
              }}
            >
              {error}
            </div>
          )}

          {reply && (
            <div
              style={{
                background: "#0a0a0a",
                padding: 16,
                borderRadius: 2,
                border: "1px solid #222",
                position: "relative",
              }}
            >
              <p style={{ marginBottom: 12, color: "#ccc", lineHeight: 1.5, fontSize: 13 }}>
                <strong style={{ color: "#fff" }}>Reply:</strong> {reply}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <strong style={{ color: "#fff", fontSize: 13 }}>Latency:</strong>
                <span
                  style={{
                    color: latencyColor,
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {latency} ms
                </span>
              </div>
            </div>
          )}

          {!reply && !error && (
            <p style={{ color: "#555", fontSize: 13, position: "relative" }}>
              No requests sent yet.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;