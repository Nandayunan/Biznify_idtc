"use client";

import { useChat } from "@ai-sdk/react";
import { createContext, useContext } from "react";

const ChatContext = createContext<ReturnType<typeof useChat> | null>(null);

export const useChatContext = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }

  return context;
};

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const chat = useChat({
    id: "APP_MAIN_CHAT_AI",
  });

  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
};
