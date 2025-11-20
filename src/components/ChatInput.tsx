"use client";

import { useState } from "react";
import { useChat } from "@/contexts/ChatContext";
import { sendPrompt } from "@/services/prompt";
import { Chat } from "@/types/chats";

export default function ChatInput() {
  const [input, setInput] = useState("");
  const { addChat } = useChat();
  const [loading, setLoading] = useState(false);



  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    const newChat: Chat = { id: crypto.randomUUID(), type:"text", content: input, response: null };
    addChat(newChat);
    setInput("");
    setLoading(true);

    try {
      const res = await sendPrompt(input);
      const aiChat: Chat = res;
      addChat(aiChat);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 p-4 border-t">
      <input
        type="text"
        className="flex-1 p-2 border rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Prompt..."
      />
      <button onClick={handleSubmit} className="p-2 px-4 rounded bg-blue-500 text-white" disabled={loading ? true : false}>
        {loading ? "⏳" : "Send"}
      </button>
    </div>
  );
}
