"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function Conclusion() {
  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl mt-6">
      <CardHeader>
        <CardTitle className="text-white text-lg">Session Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-2xl font-bold text-emerald-400">{10}</div>
            <div className="text-slate-400 text-sm">Total Messages</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-2xl font-bold text-purple-400">{10}</div>
            <div className="text-slate-400 text-sm">AI Responses</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-2xl font-bold text-cyan-400">
              {Math.ceil(1000 / 1000)}k
            </div>
            <div className="text-slate-400 text-sm">Characters Analyzed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
