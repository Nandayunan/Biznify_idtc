"use client";

import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@/components/ui/kibo-ui/ai/conversation";
import {
  AIMessage,
  AIMessageContent,
} from "@/components/ui/kibo-ui/ai/message";
import { useChatContext } from "@/app/chat-context";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, Lightbulb } from "lucide-react";

export default function ChatConversation() {
  const { messages, append } = useChatContext();

  return (
    <AIConversation className="relative size-full rounded-xl border-white/10 bg-white/5 backdrop-blur-sm">
      <AIConversationContent className="p-4 space-y-4">
        {messages.map((message) => (
          <AIMessage
            from={message.role === "user" ? "user" : "assistant"}
            key={message.id}
          >
            <AIMessageContent
              className={cn(
                "backdrop-blur-sm border rounded-xl p-4 shadow-lg text-white",
                message.role === "user"
                  ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30"
                  : "bg-white/10 border-white/20"
              )}
            >
              {message.parts.map((part, index) => {
                if (part.type === "step-start") {
                  return null;
                }

                if (part.type === "text") {
                  return (
                    <React.Fragment key={`${message.id}-${index}`}>
                      <div className="text-white/90 whitespace-pre-wrap">
                        {part.text}
                      </div>
                    </React.Fragment>
                  );
                }

                if (part.type === "tool-invocation") {
                  if (
                    part.toolInvocation.toolName === "generateQuestion" &&
                    part.toolInvocation.state === "result"
                  ) {
                    return (
                      <div
                        key={`${message.id}-${index}`}
                        className="space-y-3 mt-4"
                      >
                        <p className="text-sm font-medium text-white bg-white/10 rounded-lg p-3 border border-white/20">
                          {part.toolInvocation.args.question}
                        </p>
                        <div className="flex flex-col gap-2">
                          {part.toolInvocation.args.options.map(
                            (option: string) => (
                              <Button
                                key={`${message.id}-${index}-${option}`}
                                className="w-full flex-wrap bg-white/15 hover:bg-white/25 text-white border border-white/30 hover:border-white/40 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                                variant="outline"
                                onClick={() => {
                                  append({
                                    role: "user",
                                    content: option,
                                  });
                                }}
                              >
                                {option}
                              </Button>
                            )
                          )}
                        </div>
                      </div>
                    );
                  }

                  if (part.toolInvocation.toolName === "generateConclusion") {
                    return (
                      <div key={`${message.id}-${index}`}>
                        <div className="flex items-center gap-2 mt-1">
                          <FileText className="h-5 w-5 text-white" />
                          <span className="text-sm font-semibold text-white">
                            Membuat kesimpulan
                          </span>
                        </div>
                      </div>
                    );
                  }

                  if (part.toolInvocation.toolName === "generateKeyInsight") {
                    return (
                      <div key={`${message.id}-${index}`}>
                        <div className="flex items-center gap-2 mt-1">
                          <Lightbulb className="h-5 w-5 text-white" />
                          <span className="text-sm font-semibold text-white">
                            Membuat key insight
                          </span>
                        </div>
                      </div>
                    );
                  }
                }

                return (
                  <React.Fragment key={`${message.id}-${index}`}>
                    <div className="bg-white/10 rounded-lg p-3 border border-white/20 text-white/80 font-mono text-sm">
                      {JSON.stringify(part, null, 2)}
                    </div>
                  </React.Fragment>
                );
              })}
            </AIMessageContent>
          </AIMessage>
        ))}
      </AIConversationContent>
      <AIConversationScrollButton />
    </AIConversation>
  );
}
