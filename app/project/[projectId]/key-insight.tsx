"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export default function KeyInsight({ keyInsights }: { keyInsights: string[] }) {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          Key Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {keyInsights.map((insight, index) => (
            <li key={index} className="text-sm text-white/90 leading-relaxed">
              • {insight}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
