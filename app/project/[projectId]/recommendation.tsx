"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function Recommendation({
  recommendations,
}: {
  recommendations: string[];
}) {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CheckCircle className="w-5 h-5 text-green-400" />
          Rekomendasi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {recommendations.map((recommendation, index) => (
            <li
              key={index}
              className="text-sm text-white/90 leading-relaxed list-disc list-inside"
            >
              {recommendation}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
