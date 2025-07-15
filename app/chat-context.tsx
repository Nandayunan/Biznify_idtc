"use client";

import { useChat } from "@ai-sdk/react";
import { createContext, useContext, useState } from "react";

const ChatContext = createContext<
  | (ReturnType<typeof useChat> & { conclusion: { conclusion: string } | null })
  | null
>(null);

export const useChatContext = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }

  return context;
};

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [conclusion, setConclusion] = useState<{
    conclusion: string;
  } | null>(null);
  const chat = useChat({
    id: "APP_MAIN_CHAT_AI",
    onToolCall: ({ toolCall }) => {
      if (toolCall.toolName === "generateConclusion") {
        setConclusion(toolCall.args as { conclusion: string });
      }
    },
  });

  return (
    <ChatContext.Provider value={{ ...chat, conclusion }}>
      {children}
    </ChatContext.Provider>
  );
};
