"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useChatContext } from "./chat-context";

export default function ChatInput() {
  const { input, handleInputChange, handleSubmit, status } = useChatContext();

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Jelaskan tentang bisnis anda..."
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl h-12"
            disabled={status === "streaming"}
          />
          <Button
            type="submit"
            disabled={status === "streaming" || !input.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl h-12 px-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
