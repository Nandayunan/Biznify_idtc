"use client";

import { useChat } from "@ai-sdk/react";
import { createContext, useContext, useState } from "react";

type Conclusion = {
  title: string;
  content: string;
  badge: string;
};

type ChatContextType = ReturnType<typeof useChat> & {
  conclusions: Conclusion[] | null;
  keyInsights: string[] | null;
  recommendations: string[] | null;
  problems: string[] | null;
  quickStats: {
    successRate: string;
    minModal: string;
    roi: string;
  } | null;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const useChatContext = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }

  return context;
};

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [conclusions, setConclusions] = useState<Conclusion[] | null>(null);
  const [keyInsights, setKeyInsights] = useState<string[] | null>(null);
  const [recommendations, setRecommendations] = useState<string[] | null>(null);
  const [problems, setProblems] = useState<string[] | null>(null);
  const [quickStats, setQuickStats] = useState<{
    successRate: string;
    minModal: string;
    roi: string;
  } | null>(null);

  const chat = useChat({
    id: "APP_MAIN_CHAT_AI",
    onToolCall: ({ toolCall }) => {
      if (toolCall.toolName === "generateConclusion") {
        setConclusions(
          (toolCall.args as { conclusions: Conclusion[] }).conclusions || []
        );
      }

      if (toolCall.toolName === "generateKeyInsight") {
        setKeyInsights(
          (toolCall.args as { keyInsights: string[] }).keyInsights || []
        );
      }

      if (toolCall.toolName === "generateRecommendation") {
        setRecommendations(
          (toolCall.args as { recommendations: string[] }).recommendations || []
        );
      }

      if (toolCall.toolName === "generateProblems") {
        setProblems((toolCall.args as { problems: string[] }).problems || []);
      }

      if (toolCall.toolName === "generateQuickStats") {
        setQuickStats(
          (toolCall.args as {
            successRate: string;
            minModal: string;
            roi: string;
          }) || null
        );
      }
    },
  });

  return (
    <ChatContext.Provider
      value={{
        ...chat,
        conclusions,
        keyInsights,
        recommendations,
        problems,
        quickStats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
