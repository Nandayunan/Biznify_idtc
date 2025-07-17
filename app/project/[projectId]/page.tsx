"use client";

import type React from "react";
import { useParams } from "next/navigation";
import ChatConversation from "./chat-conversation";
import ChatInput from "./chat-input";
import SummarySection from "./summary-section";
import { trpc } from "@/lib/trpc";
import { useChatContext } from "@/app/chat-context";
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  User,
  Bot,
  Crown,
  History,
  X,
  MessageSquare,
  Clock,
  Trash2,
  Menu,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import Swal from "sweetalert2";

interface UserPrompt {
  id: string;
  content: string;
  timestamp: Date;
  sessionId: string;
}

interface MockEvent {
  preventDefault?: () => void;
}

export default function ProjectPage() {
  const params = useParams();
  const projectId = params?.projectId as string | undefined;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subscriptionPlan] = useState<"free" | "premium">("free");
  const [messageCount, setMessageCount] = useState(0);
  const { append } = useChatContext();
  const { handleSubmit, setMessages } = useChatContext();
  const [promptHistory, setPromptHistory] = useState<UserPrompt[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  void currentSessionId;
  void showSubscriptionModal;

  // Resizable panel states
  const [summaryWidth, setSummaryWidth] = useState(1350); // Default width in pixels
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Min and max widths for summary section
  const MIN_SUMMARY_WIDTH = 300;
  const MAX_SUMMARY_WIDTH = 1350;

  const {
    data: project,
    isLoading,
    isError,
  } = trpc.project.getById.useQuery(
    {
      id: projectId ?? "",
    },
    {
      enabled: !!projectId,
      refetchOnWindowFocus: false,
    }
  );

  const router = useRouter();

  // Resizing handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
      setStartX(e.clientX);
      setStartWidth(summaryWidth);
    },
    [summaryWidth]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaX = startX - e.clientX; // Reversed because we're resizing from the left
      const newWidth = Math.min(
        Math.max(startWidth + deltaX, MIN_SUMMARY_WIDTH),
        MAX_SUMMARY_WIDTH
      );
      setSummaryWidth(newWidth);
    },
    [isResizing, startX, startWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Add event listeners for mouse move and up
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const startNewChat = () => {
    setMessages([]);
    setCurrentSessionId(Date.now().toString());
    setSidebarOpen(false);
    setMessageCount(0);
    router.push("/");
  };

  const reusePrompt = (prompt: UserPrompt) => {
    if (subscriptionPlan === "free" && messageCount >= 20) {
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

  const deletePrompt = (promptId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPromptHistory((prev) => {
      const updated = prev.filter((prompt) => prompt.id !== promptId);
      localStorage.setItem("promptHistory", JSON.stringify(updated));
      return updated;
    });
  };

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
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

  const { data: session } = useSession();

  useEffect(() => {
    if (project) {
      append({
        role: "user",
        content: project.title,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading project...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
        <div className="text-white text-center">
          <p>Error loading project</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
        <div className="text-white text-center">
          <p>Project not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Header - Hanya tergeser di desktop, tidak di mobile */}
      <div
        className={`fixed top-0 right-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-white/10 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "lg:left-64 lg:sm:left-80" : "left-0"
        }`}
      >
        <header className="w-full px-2 sm:px-4 py-3 flex items-center justify-between gap-2">
          {/* Sidebar Toggle Button */}
          <div className="flex-shrink-0 flex items-center justify-start w-auto">
            <Button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              variant="ghost"
              className="text-white hover:bg-white/10 rounded-xl p-2"
            >
              <Menu className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Profile</span>
            </Button>
          </div>

          {/* Logo and Title - responsive */}
          <div className="flex-1 flex items-center justify-center min-w-0">
            <div className="inline-flex items-center gap-2 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300">
                  <Bot className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-ping"></div>
              </div>
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent text-center truncate">
                  Biznify AI
                </h1>
                {/* Hide subtitle on mobile */}
                <p className="hidden md:block text-slate-400 text-xs sm:text-sm text-center truncate">
                  asisten digital bisnis Anda
                </p>
              </div>
            </div>
          </div>

          {/* Plan Badge & Upgrade Button */}
          <div className="flex items-center gap-2 flex-shrink-0 justify-end w-auto">
            <Badge
              className={`${
                subscriptionPlan === "premium"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500"
                  : "bg-slate-600"
              } text-white border-0 px-2 md:px-3 py-1 text-xs`}
            >
              {subscriptionPlan === "premium" ? (
                <>
                  <Crown className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Premium</span>
                </>
              ) : messageCount >= 20 ? (
                <>Limit</>
              ) : (
                <>
                  <span className="hidden sm:inline">Free </span>(
                  {20 - messageCount})
                </>
              )}
            </Badge>
            {subscriptionPlan === "free" && (
              <Button
                onClick={() => setShowSubscriptionModal(true)}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-lg px-2 md:px-3 py-1 text-xs"
              >
                Upgrade
              </Button>
            )}
          </div>
        </header>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Main Content Area - Hanya margin di desktop */}
      <div
        className={`relative z-10 pt-16 h-screen transition-all duration-300 ease-in-out ${
          sidebarOpen ? "lg:ml-64 lg:sm:ml-80" : "ml-0"
        }`}
      >
        <div className="h-full p-4 mt-2">
          {/* Desktop Layout with Resizable Panels */}
          <div className="hidden lg:flex gap-4 h-full" ref={containerRef}>
            {/* Chat Section - Dynamic width */}
            <div
              className="h-full grid grid-rows-[1fr_auto] gap-4 transition-all duration-200"
              style={{ width: `calc(100% - ${summaryWidth}px - 1rem)` }}
            >
              <div className="overflow-y-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                <ChatConversation />
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                <ChatInput />
              </div>
            </div>

            {/* Resizable Summary Section */}
            <div
              className="relative h-full overflow-y-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl transition-all duration-200"
              style={{ width: `${summaryWidth}px` }}
            >
              {/* Resize Handle */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-purple-500/50 transition-colors duration-200 ${
                  isResizing ? "bg-purple-500" : "bg-transparent"
                } group`}
                onMouseDown={handleMouseDown}
              >
                {/* Visual indicator */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-white/20 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </div>

              {/* Summary Content */}
              <div className="pl-2">
                <SummarySection />
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Layout - ChatConversation 70%, SummarySection 30% */}
          <div className="lg:hidden h-full flex flex-col gap-4">
            {/* ChatConversation - 70% dari tinggi layar */}
            <div className="flex-[0.7] overflow-y-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
              <ChatConversation />
            </div>
            {/* ChatInput - Fixed height */}
            <div className="flex-shrink-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
              <ChatInput />
            </div>
            {/* SummarySection - Remaining space, scrollable */}
            <div className="flex-1 overflow-y-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
              <SummarySection />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Fixed position */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-80 bg-black/90 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-in-out ${
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
                <h2 className="text-xl font-bold text-white">History</h2>
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
          <div className="flex-1 p-4 overflow-y-auto">
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
                  {session?.user?.name || "User Name"}
                </p>
                <p className="text-slate-400 text-xs truncate">
                  {session?.user?.email || "user@example.com"}
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

      {/* Sidebar Overlay untuk mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Resizing overlay */}
      {isResizing && <div className="fixed inset-0 z-50 cursor-ew-resize" />}
    </div>
  );
}
