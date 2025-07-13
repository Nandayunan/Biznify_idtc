"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Sparkles,
  TrendingUp,
  Target,
  DollarSign,
  Users,
} from "lucide-react";
import ChatInput from "./chat-input";
import ChatMessages from "./chat-messages";
import { useChatContext } from "./chat-context";

const suggestedQuestions = [
  "Bagaimana saya mengembangkan marketing saya?",
  "Apa cara terbaik untuk mengelola keuangan bisnis saya?",
  "Bagaimana cara meningkatkan produktivitas tim saya?",
  "apa strategi terbaik untuk meningkatkan penjualan?",
];

const businessAreas = [
  {
    icon: TrendingUp,
    label: "Pengembangan bisnis",
    color: "from-emerald-400 to-cyan-400",
  },
  { icon: Target, label: "Marketing", color: "from-purple-400 to-pink-400" },
  {
    icon: DollarSign,
    label: "Keuangan",
    color: "from-yellow-400 to-orange-400",
  },
  { icon: Users, label: "Management", color: "from-blue-400 to-indigo-400" },
];

export default function BusinessConsultingChat() {
  const { messages, handleSubmit } = useChatContext();
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  void selectedArea;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSuggestedQuestion = (question: string) => {
    handleSubmit(new Event("submit"), { data: { message: question } });
  };

  const handleAreaClick = (area: string) => {
    setSelectedArea(area);
    const areaPrompt = `I need help with ${area.toLowerCase()} for my small business. Can you provide some initial guidance?`;
    handleSubmit(new Event("submit"), { data: { message: areaPrompt } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-ping"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                Biznify AI
              </h1>
              <p className="text-slate-400 text-sm">
                asisten digital bisnis Anda
              </p>
            </div>
          </div>

          {messages.length === 0 && (
            <>
              <p className="text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                chatbot pintar berbasis AI yang dirancang khusus untuk membantu
                pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) dalam
                mengembangkan strategi bisnis yang lebih efisien, tepat sasaran,
                dan berkelanjutan.
              </p>

              {/* Business Areas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {businessAreas.map((area) => (
                  <Card
                    key={area.label}
                    className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-xl group"
                    onClick={() => handleAreaClick(area.label)}
                  >
                    <CardContent className="p-4 text-center">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${area.color} rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                      >
                        <area.icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-white text-sm font-medium">
                        {area.label}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Suggested Questions */}
              <div className="space-y-3">
                <p className="text-slate-400 text-sm font-medium flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Coba pertanyaan berikut untuk memulai:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedQuestions.map((question, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-white/10 hover:bg-white/20 text-white border-white/20 cursor-pointer transition-all duration-300 hover:scale-105 px-4 py-2"
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      {question}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Chat Messages */}
        {messages.length > 0 && <ChatMessages />}

        {/* Input Form */}
        <ChatInput />

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-slate-500 text-xs">copyrigt | Biznify 2025</p>
        </div>
      </div>
    </div>
  );
}
