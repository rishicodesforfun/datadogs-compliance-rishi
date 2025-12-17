import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [latency, setLatency] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async () => {
    setLoading(true);
    setReply("");
    setLatency(null);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        throw new Error("Backend error");
      }

      const data = await res.json();
      setReply(data.reply);
      setLatency(data.latency_ms);
    } catch (err) {
      setError("Failed to reach backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1>LLM Ops Control Panel</h1>

      <p>Send a message to the LLM backend and observe latency.</p>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        style={{ padding: 8, width: 300 }}
      />

      <button
        onClick={sendMessage}
        style={{ marginLeft: 10, padding: "8px 12px" }}
      >
        Send
      </button>

      {loading && <p>Thinking...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {reply && (
        <div style={{ marginTop: 20 }}>
          <p><strong>Reply:</strong> {reply}</p>
          <p><strong>Latency:</strong> {latency} ms</p>
        </div>
      )}
    </div>
  );
}

export default App;
