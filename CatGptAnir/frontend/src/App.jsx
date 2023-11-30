import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const chat = async (e, message) => {
    e.preventDefault();
  
    if (!message) return;
    setIsTyping(true);
  
    let msgs = [...chats, { role: "user", content: message }];
    setChats(msgs);
    setMessage("");
  
    try {
      const response = await fetch("http://localhost:8000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chats: msgs,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Check if the data has the expected structure
      if (data && data.output && data.output.role && data.output.content) {
        msgs.push({ role: data.output.role, content: data.output.content });
      } else {
        console.error("Invalid response format:", data);
        // Handle unexpected response format
      }
  
      setChats(msgs);
      setIsTyping(false);
    } catch (error) {
      console.error("Error:", error);
      // Handle the error, show a message to the user, etc.
      setIsTyping(false); // Ensure that typing indicator is turned off in case of an error
    }
  };
  

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const scrollToBottom = () => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  const getAvatarEmoji = (role) => {
    return role === "user" ? "😁 YOU" : "🤖 AI";
  };

  return (
    <main>
      <header>
        <h1>🔱 Chat with ME 🔱</h1>
        <p>Created By Anirban Sarkar🤓</p>
      </header>

      <div className="chat-container" id="chat-container">
        {chats.map((chat, index) => (
          <div key={index} className={`message ${chat.role}`}>
            <span className="avatar">{getAvatarEmoji(chat.role)}</span>
            <div>
              <p>{chat.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message assistant typing">
            <span className="avatar">{getAvatarEmoji("assistant")}</span>
            <div>
               <p>Typing...</p>  
            </div>
          </div>
        )}

      </div>

      <form onSubmit={(e) => chat(e, message)}>
        <input
          type="text"
          name="message"
          value={message}
          placeholder="Type a message here and hit Enter..."
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </main>
  );
}

export default App;
