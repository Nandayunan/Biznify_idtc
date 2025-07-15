"use client";

/* eslint-disable @typescript-eslint/no-namespace */
import React from "react";
// import { useChat } from "ai/react"
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { ScrollArea } from "@/components/ui/scroll-area";
import { authClient } from "@/lib/auth-client";
import { User } from "lucide-react";
import { LogOut } from "lucide-react";
import {
  // Send,
  Bot,
  Sparkles,
  TrendingUp,
  Target,
  DollarSign,
  Users,
  X,
  MessageSquare,
  Clock,
  Trash2,
  History,
  Crown,
  Check,
  Zap,
} from "lucide-react";
import ChatInput from "./chat-input";
import ChatMessages from "./chat-messages";
import { useChatContext } from "./chat-context";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
// Declare custom elements for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "spline-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        url?: string;
        "events-target"?: string;
        loading?: string;
      };
    }
  }
}

// import { useRouter } from "next/navigation";
import { UIMessage } from "ai";

const suggestedQuestions = [
  "Bagaimana saya mengembangkan marketing saya?",
  "Apa cara terbaik untuk mengelola keuangan bisnis saya?",
  "Bagaimana cara meningkatkan produktivitas tim saya?",
  "apa strategi terbaik untuk meningkatkan penjualan?",
];

interface UserPrompt {
  id: string;
  content: string;
  timestamp: Date;
  sessionId: string;
}

interface SavedChatSession {
  id: string;
  title: string;
  timestamp: string;
  messages: UIMessage[];
}

interface SavedUserPrompt {
  id: string;
  content: string;
  timestamp: string;
  sessionId: string;
}

interface MockEvent {
  preventDefault?: () => void;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  messages: UIMessage[];
}

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
    const existingScript = document.querySelector(
      'script[src*="spline-viewer"]'
    );

    if (existingScript) {
      setIsLoaded(true);
      return;
    }

    // Create and load script
    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://unpkg.com/@splinetool/viewer@1.10.27/build/spline-viewer.js";
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      console.error("Failed to load Spline viewer");
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      const scriptToRemove = document.querySelector(
        'script[src*="spline-viewer"]'
      );
      if (scriptToRemove) {
        document.head.removeChild(scriptToRemove);
      }
    };
  }, []);

  return isLoaded;
};

// Add TypeScript interface for SplineViewer props
interface SplineViewerProps {
  url: string;
  className?: string;
}

interface SplineElement extends HTMLElement {
  spline?: {
    setZoom: (zoom: number) => void;
    emitEvent: (eventName: string) => void;
  };
}

// Spline Viewer Component
const SplineViewer: React.FC<SplineViewerProps> = ({ url, className = "" }) => {
  const isSplineLoaded = useSplineLoader();
  const splineRef = useRef<SplineElement | null>(null);

  useEffect(() => {
    if (isSplineLoaded && splineRef.current) {
      // Make sure the custom element is properly recognized
      if (!customElements.get("spline-viewer")) {
        // Wait a bit for the script to fully register the custom element
        setTimeout(() => {
          if (splineRef.current) {
            splineRef.current.setAttribute("url", url);

            // Add event listener untuk akses ke spline app setelah load
            splineRef.current.addEventListener("load", () => {
              try {
                // Akses spline app untuk mengatur kamera
                const splineApp = splineRef.current?.spline;
                if (splineApp) {
                  // Reset kamera ke posisi default atau sesuai scene
                  splineApp.setZoom(1);
                  // Jika ada fungsi untuk reset kamera orientation
                  if (splineApp.emitEvent) {
                    splineApp.emitEvent("resetCamera");
                  }
                }
              } catch (error) {
                console.log("Spline camera adjustment not available:", error);
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

  return React.createElement("spline-viewer", {
    ref: splineRef,
    url: url,
    className: className,
    style: {
      width: "100%",
      height: "100%",
      display: "block",
      transform: "translate(90px, 100px)",
      transformOrigin: "center center",
    },
    loading: "lazy",
    "events-target": "global",
  });
};

export default function BusinessConsultingChat() {
  const { messages, handleSubmit, setMessages } = useChatContext();
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [showConclusionButton, setShowConclusionButton] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [promptHistory, setPromptHistory] = useState<UserPrompt[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<"free" | "premium">(
    "free"
  );
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const router = useRouter()

  void chatHistory;
  void selectedArea;
  void showConclusionButton;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load saved subscription plan
    const savedPlan = localStorage.getItem("subscriptionPlan") as
      | "free"
      | "premium"
      | null;
    if (savedPlan) {
      setSubscriptionPlan(savedPlan);
    }

    // Load chat history and prompt history from localStorage
    const savedHistory = localStorage.getItem("chatHistory");
    if (savedHistory) {
      const parsed: SavedChatSession[] = JSON.parse(savedHistory);
      setChatHistory(
        parsed.map((session) => ({
          ...session,
          timestamp: new Date(session.timestamp),
        }))
      );
    }

    const savedPrompts = localStorage.getItem("promptHistory");
    if (savedPrompts) {
      const parsed: SavedUserPrompt[] = JSON.parse(savedPrompts);
      setPromptHistory(
        parsed.map((prompt) => ({
          ...prompt,
          timestamp: new Date(prompt.timestamp),
        }))
      );
    }

    // Generate session ID if not exists
    if (!currentSessionId) {
      setCurrentSessionId(Date.now().toString());
    }
  }, [currentSessionId]);

  useEffect(() => {
    // Count user messages for free plan limit
    const userMessages = messages.filter((m) => m.role === "user");
    setMessageCount(userMessages.length);

    // Show subscription modal after 5th message for free users
    if (subscriptionPlan === "free" && userMessages.length === 5) {
      setShowSubscriptionModal(true);
    }

    // Show conclusion button after 3+ meaningful exchanges
    const meaningfulMessages = messages.filter((m) => m.content.length > 50);
    if (meaningfulMessages.length >= 4) {
      setShowConclusionButton(true);
    }
  }, [messages, subscriptionPlan]);

  useEffect(() => {
    // Save current session to history when messages change
    if (messages.length > 0 && currentSessionId) {
      const sessionTitle =
        messages[0]?.content.substring(0, 50) + "..." || "New Chat";
      const currentSession: ChatSession = {
        id: currentSessionId,
        title: sessionTitle,
        timestamp: new Date(),
        messages: messages,
      };

      setChatHistory((prev) => {
        const filtered = prev.filter(
          (session) => session.id !== currentSessionId
        );
        const updated = [currentSession, ...filtered].slice(0, 20); // Keep last 20 sessions
        localStorage.setItem("chatHistory", JSON.stringify(updated));
        return updated;
      });

      // Extract and save user prompts
      const userMessages = messages.filter((m) => m.role === "user");
      const newPrompts: UserPrompt[] = userMessages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        timestamp: new Date(),
        sessionId: currentSessionId,
      }));

      setPromptHistory((prev) => {
        // Remove existing prompts from current session and add new ones
        const filtered = prev.filter(
          (prompt) => prompt.sessionId !== currentSessionId
        );
        const updated = [...newPrompts, ...filtered].slice(0, 50); // Keep last 50 prompts
        localStorage.setItem("promptHistory", JSON.stringify(updated));
        return updated;
      });
    }
  }, [messages, currentSessionId]);

  const handleSuggestedQuestion = (question: string) => {
    // Allow up to 5 questions for free users
    if (subscriptionPlan === "free" && messageCount >= 5) {
      setShowSubscriptionModal(true);
      return;
    }
    handleSubmit({} as MockEvent, { data: { message: question } });
  };

  const handleAreaClick = (area: string) => {
    // Allow up to 5 questions for free users
    if (subscriptionPlan === "free" && messageCount >= 5) {
      setShowSubscriptionModal(true);
      return;
    }
    setSelectedArea(area);
    const areaPrompt = `I need help with ${area.toLowerCase()} for my small business. Can you provide some initial guidance?`;
    handleSubmit({} as MockEvent, { data: { message: areaPrompt } });
  };
  const router = useRouter();
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          // Show success alert with timer
          Swal.fire({
            title: "Logout Berhasil!",
            text: "Sampai Jumpa Kembali",
            icon: "success",
            showConfirmButton: false,
            customClass: {
              popup: "border border-purple-500/20",
            },
          });
          setTimeout(() => {
            Swal.close();
            router.push("/login");
          }, 2000);
        },
      },
    });
  };

  // const handleFormSubmit = (e: React.FormEvent) => {
  //   // Check free plan limit - prevent submission after 5 messages
  //   if (subscriptionPlan === "free" && messageCount >= 5) {
  //     e.preventDefault()
  //     setShowSubscriptionModal(true)
  //     return
  //   }
  //   handleSubmit(e)
  // }

  // const handleCreateConclusion = () => {
  //   // Premium feature check
  //   if (subscriptionPlan === "free") {
  //     setShowSubscriptionModal(true)
  //     return
  //   }
  //   sessionStorage.setItem("chatMessages", JSON.stringify(messages))
  //   router.push("/conclusion")
  // }

  const handleSubscriptionChoice = (plan: "free" | "premium") => {
    setSubscriptionPlan(plan);
    localStorage.setItem("subscriptionPlan", plan);
    localStorage.setItem("hasSeenSubscriptionModal", "true");
    setShowSubscriptionModal(false);
  };

  // const loadChatSession = (session: ChatSession) => {
  //   setMessages(session.messages)
  //   setCurrentSessionId(session.id)
  //   setSidebarOpen(false)
  // }

  const startNewChat = () => {
    setMessages([]);
    setCurrentSessionId(Date.now().toString());
    setShowConclusionButton(false);
    setSidebarOpen(false);
    setMessageCount(0);
  };

  const deletePrompt = (promptId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPromptHistory((prev) => {
      const updated = prev.filter((prompt) => prompt.id !== promptId);
      localStorage.setItem("promptHistory", JSON.stringify(updated));
      return updated;
    });
  };

  const reusePrompt = (prompt: UserPrompt) => {
    // Allow up to 5 questions for free users
    if (subscriptionPlan === "free" && messageCount >= 5) {
      setShowSubscriptionModal(true);
      return;
    }
    handleSubmit({} as MockEvent, { data: { message: prompt.content } });
    setSidebarOpen(false);
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
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

      <div className="relative w-full px-0 pt-20 pb-8 min-h-screen">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
          <header className="w-full px-2 sm:px-4 py-3 flex items-center justify-between gap-2">
            {/* Sidebar Prompt Button - paling ujung kiri */}
            <div className="flex-shrink-0 flex items-center justify-start w-auto">
              <Button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                variant="ghost"
                className="text-white hover:bg-white/10 rounded-xl p-2 ml-0"
                style={{ marginLeft: 0 }}
              >
                <User className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
            </div>
            {/* Logo and Title - tengah, responsive */}
            <div className="flex-1 flex items-center justify-center min-w-0">
              <div className="inline-flex items-center gap-2 min-w-0">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-ping"></div>
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent text-center truncate">
                    Biznify AI
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm text-center truncate">
                    asisten digital bisnis Anda
                  </p>
                </div>
              </div>
            </div>
            {/* Plan Badge & Upgrade Button - paling kanan */}
            <div className="flex items-center gap-2 flex-shrink-0 justify-end w-auto">
              <Badge
                className={`${
                  subscriptionPlan === "premium"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500"
                    : "bg-slate-600"
                } text-white border-0 px-3 py-1`}
              >
                {subscriptionPlan === "premium" ? (
                  <>
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </>
                ) : messageCount >= 5 ? (
                  <>Limit Reached</>
                ) : (
                  <>Free ({5 - messageCount} remaining)</>
                )}
              </Badge>
              {subscriptionPlan === "free" && (
                <Button
                  onClick={() => setShowSubscriptionModal(true)}
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-lg px-3 py-1 text-xs"
                >
                  Upgrade
                </Button>
              )}
            </div>
          </header>
        </div>

        {/* Subscription Modal */}
        {showSubscriptionModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl max-w-md sm:max-w-2xl md:max-w-4xl w-full relative overflow-y-auto max-h-[90vh]">
              {/* Close Button */}
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="absolute top-4 right-4 text-white bg-black/30 hover:bg-black/50 rounded-full p-2 z-10"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <CardHeader className="text-center pb-4 sm:pb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-white mb-2">
                  Choose Your Business Plan
                </CardTitle>
                <p className="text-slate-300 text-lg">
                  Get expert business consulting advice tailored to your needs
                </p>
              </CardHeader>
              <CardContent className="p-4 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Free Plan */}
                  <Card className="bg-white/5 border-white/20 hover:bg-white/10 transition-all duration-300 relative">
                    <CardContent className="p-4 sm:p-6">
                      <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          Free Access
                        </h3>
                        <div className="text-4xl font-bold text-white mb-1">
                          Rp 0
                        </div>
                        <p className="text-slate-400">Limited Access</p>
                      </div>

                      <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          <span className="text-slate-200">
                            5 questions per session
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          <span className="text-slate-200">
                            Basic business advice
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <X className="w-5 h-5 text-slate-500 flex-shrink-0" />
                          <span className="text-slate-400 line-through">
                            Consultation summaries
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <X className="w-5 h-5 text-slate-500 flex-shrink-0" />
                          <span className="text-slate-400 line-through">
                            Unlimited conversations
                          </span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleSubscriptionChoice("free")}
                        variant="outline"
                        className="w-full bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 rounded-xl py-3 font-medium"
                      >
                        Start Free
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Premium Plan */}
                  <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/30 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                    <CardContent className="p-4 sm:p-6">
                      <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Crown className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          Premium Access
                        </h3>
                        <div className="text-4xl font-bold text-white mb-1">
                          Rp 50,000
                        </div>
                        <p className="text-purple-200">Unlimited Access</p>
                      </div>

                      <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          <span className="text-white font-medium">
                            Unlimited questions
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          <span className="text-white font-medium">
                            Advanced business strategies
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          <span className="text-white font-medium">
                            Consultation summaries
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          <span className="text-white font-medium">
                            Priority support
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          <span className="text-white font-medium">
                            Export chat history
                          </span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleSubscriptionChoice("premium")}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Upgrade to Premium
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center mt-4 sm:mt-8">
                  <p className="text-slate-400 text-sm">
                    You can upgrade or change your plan anytime in settings
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Sidebar - Prompt History */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-80 bg-black/80 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <History className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Prompt History
                  </h2>
                </div>
                <Button
                  onClick={() => setSidebarOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <Button
                onClick={startNewChat}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </div>

            {/* Prompt History List */}
            <div className="flex-1 p-4 overflow-y-auto max-h-screen">
              <div className="space-y-3">
                {promptHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">No prompts yet</p>
                    <p className="text-slate-500 text-xs">
                      Your questions will appear here
                    </p>
                  </div>
                ) : (
                  promptHistory.map((prompt) => (
                    <div
                      key={prompt.id}
                      onClick={() => reusePrompt(prompt)}
                      className="group p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/10 bg-white/5 border border-white/10 hover:border-white/20"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-3 h-3 text-white" />
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Clock className="w-3 h-3" />
                            {formatTimestamp(prompt.timestamp)}
                          </div>
                        </div>
                        <Button
                          onClick={(e) => deletePrompt(prompt.id, e)}
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 p-1 h-auto"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-white text-sm leading-relaxed">
                        {truncateText(prompt.content, 120)}
                      </p>
                      <div className="mt-2 text-xs text-slate-500">
                        Click to reuse this prompt
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Profile Section */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {"User Name"}
                  </p>
                  <p className="text-slate-400 text-xs truncate">
                    {"user@example.com"}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/30 rounded-xl transition-all duration-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            style={{ top: "56px" }} // header height
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content - Adjusts based on sidebar state */}
        <div
          className={`flex-1 relative z-10 transition-all duration-300 ${
            sidebarOpen ? "lg:ml-80" : "ml-0"
          } pt-2`}
        >
          <div className="w-full px-0 py-8">
            {/* Header */}
            <div className="text-center mb-8">
              {/* ...existing code... */}

              {messages.length === 0 && (
                <>
                  <p className="text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed backdrop-blur-sm bg-black/20 rounded-lg p-4">
                    Chatbot pintar berbasis AI yang dirancang khusus untuk
                    membantu pelaku Usaha Mikro, Kecil, dan Menengah (UMKM)
                    dalam mengembangkan strategi bisnis yang lebih efisien,
                    tepat sasaran, dan berkelanjutan.
                  </p>

                  {/* Business Areas */}
                  <div className="mx-auto w-full max-w-6xl px-2">
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
            <div className="backdrop-blur-sm bg-black/20 rounded-lg p-2 mx-auto w-full max-w-6xl px-2">
              <ChatInput />
            </div>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-slate-500 text-xs">
                © {new Date().getFullYear()} | Biznify
              </p>
            </div>
          </div>
        </div>
        {/* End Main Content */}
      </div>
    </div>
  );
}
