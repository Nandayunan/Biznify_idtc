"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function Problems({ problems }: { problems: string[] }) {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          Tantangan yang Akan Dihadapi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {problems.map((problem, index) => (
            <li
              key={index}
              className="text-sm text-white/90 leading-relaxed list-disc list-inside"
            >
              {problem}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
