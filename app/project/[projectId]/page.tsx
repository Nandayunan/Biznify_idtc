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
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="w-screen h-screen flex gap-4 p-4">
      <div className="w-[400px] h-full grid grid-rows-[1fr_auto] gap-4">
        <div className="overflow-y-auto max-h-full">
          <ChatConversation />
        </div>
        <div>
          <ChatInput />
        </div>
      </div>
      <div className="flex-1 max-h-full overflow-y-auto max-w-full">
        <SummarySection />
      </div>
    </div>
  );
}
