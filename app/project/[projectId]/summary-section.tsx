"use client";

import { useChatContext } from "@/app/chat-context";
import MarkdownSummary from "./mardown-summary";

export default function SummarySection() {
  const { conclusions } = useChatContext();

  if (!conclusions || conclusions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        Sedang menganalisa...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {conclusions.map((conclusion, index) => (
        <MarkdownSummary
          key={index}
          title={conclusion.title}
          content={conclusion.content}
          badge={conclusion.badge}
          defaultExpanded={true}
        />
      ))}
    </div>
  );
}
