"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function QuickStats({
  successRate,
  minModal,
  roi,
}: {
  successRate: string;
  minModal: string;
  roi: string;
}) {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Star className="w-5 h-5 text-yellow-400" />
          Statistik Cepat
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm">Tingkat Kesuksesan</span>
          <span className="text-green-400 font-bold">{successRate}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Modal Minimal</span>
          <span className="text-blue-400 font-bold">{minModal}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">ROI Estimasi</span>
          <span className="text-purple-400 font-bold">{roi}</span>
        </div>
      </CardContent>
    </Card>
  );
}
