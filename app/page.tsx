"use client"

import { useChat } from "ai/react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Sparkles, TrendingUp, Target, DollarSign, Users } from "lucide-react"

const suggestedQuestions = [
  "Bagaimana saya mengembangkan marketing saya?",
  "Apa cara terbaik untuk mengelola keuangan bisnis saya?",
  "Bagaimana cara meningkatkan produktivitas tim saya?",
  "apa strategi terbaik untuk meningkatkan penjualan?",
]

const businessAreas = [
  { icon: TrendingUp, label: "Pengembangan bisnis", color: "from-emerald-400 to-cyan-400" },
  { icon: Target, label: "Marketing", color: "from-purple-400 to-pink-400" },
  { icon: DollarSign, label: "Keuangan", color: "from-yellow-400 to-orange-400" },
  { icon: Users, label: "Management", color: "from-blue-400 to-indigo-400" },
]

export default function BusinessConsultingChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
  const [selectedArea, setSelectedArea] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSuggestedQuestion = (question: string) => {
    handleSubmit(new Event("submit") as any, { data: { message: question } })
  }

  const handleAreaClick = (area: string) => {
    setSelectedArea(area)
    const areaPrompt = `I need help with ${area.toLowerCase()} for my small business. Can you provide some initial guidance?`
    handleSubmit(new Event("submit") as any, { data: { message: areaPrompt } })
  }

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
              <p className="text-slate-400 text-sm">asisten digital bisnis Anda</p>
            </div>
          </div>

          {messages.length === 0 && (
            <>
              <p className="text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                chatbot pintar berbasis AI yang dirancang khusus untuk membantu pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) dalam mengembangkan strategi bisnis yang lebih efisien, tepat sasaran, dan berkelanjutan.
              </p>

              {/* Business Areas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {businessAreas.map((area, index) => (
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
                      <p className="text-white text-sm font-medium">{area.label}</p>
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
        {messages.length > 0 && (
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-6 shadow-2xl">
            <CardContent className="p-0">
              <div className="h-[60vh] overflow-y-auto p-6 space-y-6">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <Avatar
                      className={`w-10 h-10 shadow-lg ${message.role === "user" ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-gradient-to-r from-emerald-500 to-cyan-500"}`}
                    >
                      <AvatarFallback className="text-white">
                        {message.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                      </AvatarFallback>
                    </Avatar>

                    <div className={`flex-1 max-w-[80%] ${message.role === "user" ? "text-right" : "text-left"}`}>
                      <div
                        className={`inline-block p-4 rounded-2xl shadow-lg ${message.role === "user"
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                          : "bg-white/10 backdrop-blur-sm text-white border border-white/20"
                          }`}
                      >
                        <div className="prose prose-invert max-w-none">
                          {message.content.split("\n").map((line, i) => (
                            <p key={i} className={`${i === 0 ? "" : "mt-2"} ${line.trim() === "" ? "h-2" : ""}`}>
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 px-2">
                        {message.role === "user" ? "You" : "BizConsult AI"}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg">
                      <AvatarFallback className="text-white">
                        <Bot className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-lg">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Input Form */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Jelaskan tentang bisnis anda..."
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl h-12"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl h-12 px-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-slate-500 text-xs">copyrigt | Biznify 2025</p>
        </div>
      </div>
    </div>
  )
}
