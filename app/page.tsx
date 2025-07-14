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

// Custom hook untuk load Spline script
const useSplineLoader = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="spline-viewer"]');
    
    if (existingScript) {
      setIsLoaded(true);
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.10.27/build/spline-viewer.js';
    script.async = true;
    
    script.onload = () => {
      setIsLoaded(true);
    };
    
    script.onerror = () => {
      console.error('Failed to load Spline viewer');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      const scriptToRemove = document.querySelector('script[src*="spline-viewer"]');
      if (scriptToRemove) {
        document.head.removeChild(scriptToRemove);
      }
    };
  }, []);

  return isLoaded;
};

// Spline Viewer Component
const SplineViewer = ({ url, className = "" }) => {
  const isSplineLoaded = useSplineLoader();
  const splineRef = useRef(null);

  useEffect(() => {
    if (isSplineLoaded && splineRef.current) {
      // Make sure the custom element is properly recognized
      if (!customElements.get('spline-viewer')) {
        // Wait a bit for the script to fully register the custom element
        setTimeout(() => {
          if (splineRef.current) {
            splineRef.current.setAttribute('url', url);
            
            // Add event listener untuk akses ke spline app setelah load
            splineRef.current.addEventListener('load', () => {
              try {
                // Akses spline app untuk mengatur kamera
                const splineApp = splineRef.current.spline;
                if (splineApp) {
                  // Reset kamera ke posisi default atau sesuai scene
                  splineApp.setZoom(1);
                  // Jika ada fungsi untuk reset kamera orientation
                  if (splineApp.emitEvent) {
                    splineApp.emitEvent('resetCamera');
                  }
                }
              } catch (error) {
                console.log('Spline camera adjustment not available:', error);
              }
            });
          }
        }, 100);
      }
    }
  }, [isSplineLoaded, url]);

  if (!isSplineLoaded) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/50"></div>
      </div>
    );
  }

  return (
    <spline-viewer
      ref={splineRef}
      url={url}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        transform: 'translate(90px, 100px)', // Geser ke kanan 200px
        transformOrigin: 'center center'
      }}
      // Tambahkan attributes yang mungkin membantu orientasi
      loading="lazy"
      events-target="global"
    />
  );
};

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

      {/* 3D Spline Background - Digeser ke kanan */}
      <div className="absolute inset-0 z-0">
        <SplineViewer 
          url="https://prod.spline.design/y0EnxvXrPRsZpMhP/scene.splinecode"
          className="w-full h-full opacity-30"
          
        />
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
              <p className="text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed backdrop-blur-sm bg-black/20 rounded-lg p-4">
                Chatbot pintar berbasis AI yang dirancang khusus untuk membantu
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
                      className="bg-white/10 hover:bg-white/20 text-white border-white/20 cursor-pointer transition-all duration-300 hover:scale-105 px-4 py-2 backdrop-blur-sm"
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
          <div className="backdrop-blur-sm bg-black/20 rounded-lg">
            <ChatMessages />
          </div>
        )}

        {/* Input Form */}
        <div className="backdrop-blur-sm bg-black/20 rounded-lg p-2">
          <ChatInput />
        </div>

        {/* Footer */}
        <div className="text-center mt-20">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} | Biznify
          </p>
        </div>
      </div>
    </div>
  );
}