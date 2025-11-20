"use client";
import dynamic from "next/dynamic";

const ChatMessage = dynamic(() => import("./ChatMessageContent"), {
  loading: () => <p>Loading chat...</p>,
});

export default ChatMessage;
