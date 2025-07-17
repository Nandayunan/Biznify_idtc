"use client";

import { useChatContext } from "@/app/chat-context";
import MarkdownSummary from "./mardown-summary";
import KeyInsight from "./key-insight";
import Recommendation from "./recommendation";
import QuickStats from "./quick-stats";
import Problems from "./problems";

export default function SummarySection() {
  const { conclusions, keyInsights, recommendations, problems, quickStats } =
    useChatContext();

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
      <div className="flex gap-4">
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

      <div className="grid grid-cols-2 gap-4">
        {keyInsights && keyInsights.length > 0 && (
          <KeyInsight keyInsights={keyInsights} />
        )}
        {recommendations && recommendations.length > 0 && (
          <Recommendation recommendations={recommendations} />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {quickStats && (
          <QuickStats
            successRate={quickStats.successRate}
            minModal={quickStats.minModal}
            roi={quickStats.roi}
          />
        )}
        {problems && problems.length > 0 && <Problems problems={problems} />}
      </div>
    </div>
  );
}
