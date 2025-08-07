import React, { useState } from "react";
import axios from "axios";

const LawGPTApp = () => {
  const [messages, setMessages] = useState([
    { type: "bot", text: "Welcome to LawGPT! How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { type: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("https://mailabs.app.n8n.cloud/webhook/query", {
        message: input
      });

      const botMessage = response.data?.content || "Sorry, I couldn't understand that.";
      setMessages(prev => [...prev, { type: "bot", text: botMessage }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages(prev => [
        ...prev,
        { type: "bot", text: "There was an error processing your request." }
      ]);
    }

    setLoading(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMessages(prev => [...prev, { type: "user", text: `📎 Uploaded: ${file.name}` }]);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("https://mailabs.app.n8n.cloud/webhook/summary", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const botMessage = response.data?.content || "File uploaded. Processing completed.";
      setMessages(prev => [...prev, { type: "bot", text: botMessage }]);
    } catch (error) {
      console.error("File upload failed:", error);
      setMessages(prev => [...prev, { type: "bot", text: "Error uploading file." }]);
    }

    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-4">LawGPT</h2>
          <ul className="space-y-2">
            <li className="cursor-pointer">+ New Chat</li>
            <li className="cursor-pointer">🔍 Search Chat</li>
            <li className="cursor-pointer">📚 Library</li>
            <li className="cursor-pointer">📁 Case Repository</li>
          </ul>
        </div>
        <div className="mt-4">
          <hr className="my-2 border-gray-600" />
          <p className="text-sm text-gray-400">arunpandey2023 (Free Plan)</p>
        </div>
      </div>

      {/* Chat Panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-md max-w-xl ${
                msg.type === "user" ? "bg-blue-700 self-end" : "bg-gray-700 self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && <div className="text-gray-400">LawGPT is typing...</div>}
        </div>

        <div className="p-4 border-t border-gray-700 flex items-center gap-2">
          <label className="cursor-pointer bg-gray-700 px-2 py-1 rounded-md">
            📎
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <input
            className="flex-1 p-2 rounded-md bg-gray-800 border border-gray-700 text-white"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700"
            onClick={handleSend}
          >
            Send
          </button>
        </div>

        {/* Tools + Voice Buttons */}
        <div className="flex items-center justify-center gap-4 pb-4">
          <button className="text-gray-400 hover:text-white">🛠️ Tools</button>
          <button className="text-gray-400 hover:text-white">🎙️ Voice</button>
        </div>
      </div>
    </div>
  );
};

export default LawGPTApp;
