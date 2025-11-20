"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Chat } from "@/types/chats";
import { getChatsFromStorage, saveChatsToStorage } from "@/utils/storage";

type ChatContextType = {
  chats: Chat[];
  addChat: (chat: Chat) => void;
  setChats: (chats: Chat[]) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const storedChats = getChatsFromStorage();
    if (storedChats) setChats(storedChats);
  }, []);

  const addChat = (chat: Chat) => {
    const newChats = [...chats, chat];
    setChats(newChats);
    saveChatsToStorage(newChats);
  };

  return (
    <ChatContext.Provider value={{ chats, addChat, setChats }}>
      {children}
    </ChatContext.Provider>
  );
};
