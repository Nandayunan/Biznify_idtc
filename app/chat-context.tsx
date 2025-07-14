"use client";

import { useChat } from "@ai-sdk/react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const chat = useChat({
    id: "APP_MAIN_CHAT_AI",
    onToolCall: ({ toolCall }) => {
      if (toolCall.toolName === "generateConclusion") {
        router.push("/conclusion");
      }
    },
  });

  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
};
