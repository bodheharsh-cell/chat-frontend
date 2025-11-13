import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://chat-backend-98fg.onrender.com", {
  transports: ["websocket"], 
});

// connect to backend

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    // When new message arrives from backend (via WebSocket)
    socket.on("new_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("new_message");
  }, []);

  const sendMessage = async () => {
    if (!text) return;

    // Send message by API (REST)
    await fetch("https://chat-backend-98fg.onrender.com/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: "6915808ef1b24715a440bc6f", // <-- CHANGE THIS TO YOUR USER ID
        text,
      }),
    });

    setText("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Chat App</h1>

      <div
        style={{
          border: "1px solid black",
          height: 300,
          overflowY: "scroll",
          padding: 10,
          marginBottom: 20,
        }}
      >
        {messages.map((m) => (
          <div key={m._id}>
            <b>{m.sender?.username}:</b> {m.text}
            <hr />
          </div>
        ))}
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
