import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [latency, setLatency] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [simulateSlow, setSimulateSlow] = useState(false);

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
      ? "#64748b"
      : latency < 800
      ? "#16a34a"
      : latency < 1500
      ? "#d97706"
      : "#dc2626";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: 0,
        margin: 0,
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "20px 40px",
          borderBottom: "1px solid #e2e8f0",
          background: "#ffffff",
        }}
      >
        <h1 style={{ margin: 0 }}>LLM Ops Control Panel</h1>
        <p style={{ margin: "4px 0 0", color: "#475569" }}>
          Monitor latency, errors, and runtime behavior of an LLM-backed system.
        </p>
      </header>

      {/* Main Content */}
      <main
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 32,
          padding: "40px",
        }}
      >
        {/* Left: Chat */}
        <section
          style={{
            background: "#ffffff",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ marginBottom: 12 }}>Send Prompt</h2>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask the model something…"
            rows={6}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 8,
              border: "1px solid #cbd5f5",
              fontSize: 14,
              resize: "none",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 16,
            }}
          >
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                background: "#4f46e5",
                color: "#ffffff",
                fontWeight: 600,
                cursor: "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Sending…" : "Send"}
            </button>

            <label style={{ fontSize: 14, color: "#475569" }}>
              <input
                type="checkbox"
                checked={simulateSlow}
                onChange={(e) => setSimulateSlow(e.target.checked)}
                style={{ marginRight: 6 }}
              />
              Simulate slow request
            </label>
          </div>
        </section>

        {/* Right: Metrics */}
        <section
          style={{
            background: "#ffffff",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ marginBottom: 12 }}>Last Request Metrics</h2>

          {error && (
            <p style={{ color: "#dc2626" }}>{error}</p>
          )}

          {reply && (
            <div
              style={{
                background: "#f8fafc",
                padding: 16,
                borderRadius: 8,
                border: "1px solid #e2e8f0",
              }}
            >
              <p style={{ marginBottom: 10 }}>
                <strong>Reply:</strong> {reply}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Latency:</strong>{" "}
                <span style={{ color: latencyColor }}>
                  {latency} ms
                </span>
              </p>
            </div>
          )}

          {!reply && !error && (
            <p style={{ color: "#64748b" }}>
              No requests sent yet.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
