import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

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
    <div className="App">
      <div className="container">
        <h1>Chat App</h1>

        <div className="chat-window">
          {messages.map((m) => (
            <div key={m._id} className="message">
              <strong>{m.sender?.username}</strong>
              <span className="text">{m.text}</span>
            </div>
          ))}
        </div>

        <div className="composer">
          <input
            className="message-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
          />

          <button className="send-btn" onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
