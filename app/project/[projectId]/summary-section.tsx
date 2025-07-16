"use client";

import { useChatContext } from "@/app/chat-context";
import MarkdownSummary from "./mardown-summary";
import KeyInsight from "./key-insight";

export default function SummarySection() {
  const { conclusions, keyInsights } = useChatContext();

  if (!conclusions || conclusions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Sedang menganalisa...</p>
          <p className="text-slate-400 text-sm mt-2">
            AI sedang memproses data bisnis Anda
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      {conclusions.map((conclusion, index) => (
        <MarkdownSummary
          key={index}
          title={conclusion.title}
          content={conclusion.content}
          badge={conclusion.badge}
          defaultExpanded={true}
        />
      ))}

      {keyInsights && keyInsights.length > 0 && (
        <KeyInsight keyInsights={keyInsights} />
      )}
    </div>
  );
}
