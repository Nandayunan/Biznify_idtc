"use client";

import { useParams } from "next/navigation";
import ChatConversation from "./chat-conversation";
import ChatInput from "./chat-input";
import SummarySection from "./summary-section";
import { trpc } from "@/lib/trpc";
import { useChatContext } from "@/app/chat-context";
import { useEffect } from "react";

export default function ProjectPage() {
  const params = useParams();
  const projectId = params?.projectId as string | undefined;

  const { append } = useChatContext();

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
    }
  );

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
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-screen h-screen flex gap-4 p-4">
        <div className="w-[400px] h-full grid grid-rows-[1fr_auto] gap-4">
          <div className="overflow-y-auto max-h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
            <ChatConversation />
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
            <ChatInput />
          </div>
        </div>
        <div className="flex-1 max-h-full overflow-y-auto max-w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
          <SummarySection />
        </div>
      </div>
    </div>
  );
}
