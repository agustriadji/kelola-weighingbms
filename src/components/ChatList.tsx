"use client";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { useChat } from "@/contexts/ChatContext";

export default function ChatList() {
  const { chats } = useChat();

  return (
    <div className="p-4 space-y-3 overflow-auto">
      {chats.map((chat) => (
        <div key={chat.id} className="mb-4">
          <div className="p-5 rounded bg-blue-100 text-blue-900 w-90 h-auto">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {chat.content}
            </ReactMarkdown>
          </div>

          {chat.response && (
            <div className="p-5 rounded bg-gray-200 text-gray-900 w-90 h-auto mt-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {chat.response}
              </ReactMarkdown>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
