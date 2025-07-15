"use client";

import { useChat } from "@ai-sdk/react";
import { createContext, useContext, useState } from "react";

type Conclusion = {
  title: string;
  content: string;
  badge: string;
};

const ChatContext = createContext<
  (ReturnType<typeof useChat> & { conclusions: Conclusion[] | null }) | null
>(null);

export const useChatContext = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }

  return context;
};

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [conclusions, setConclusions] = useState<Conclusion[] | null>(null);
  const chat = useChat({
    id: "APP_MAIN_CHAT_AI",
    onToolCall: ({ toolCall }) => {
      if (toolCall.toolName === "generateConclusion") {
        setConclusions(
          (toolCall.args as { conclusions: Conclusion[] }).conclusions || []
        );
      }
    },
  });

  return (
    <ChatContext.Provider value={{ ...chat, conclusions }}>
      {children}
    </ChatContext.Provider>
  );
};
