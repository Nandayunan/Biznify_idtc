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

export default function ChatConversation() {
  const { messages, append, status } = useChatContext();

  return (
    <AIConversation className="relative size-full rounded-lg border">
      <AIConversationContent>
        {messages.map((message) => (
          <AIMessage
            from={message.role === "user" ? "user" : "assistant"}
            key={message.id}
          >
            <AIMessageContent>
              {status === "submitted" && <>Loading...</>}
              {message.parts.map((part, index) => {
                if (part.type === "step-start") {
                  return null;
                }

                if (part.type === "text") {
                  return (
                    <React.Fragment key={`${message.id}-${index}`}>
                      {part.text}
                    </React.Fragment>
                  );
                }

                if (part.type === "tool-invocation") {
                  if (
                    part.toolInvocation.toolName === "generateQuestion" &&
                    part.toolInvocation.state === "result"
                  ) {
                    return (
                      <div key={`${message.id}-${index}`}>
                        <p className="text-sm font-medium">
                          {part.toolInvocation.args.question}
                        </p>
                        <div className="flex flex-col gap-2">
                          {part.toolInvocation.args.options.map(
                            (option: string) => (
                              <Button
                                key={`${message.id}-${index}-${option}`}
                                className="w-full flex-wrap p-2"
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
                }

                return (
                  <React.Fragment key={`${message.id}-${index}`}>
                    {JSON.stringify(part, null, 2)}
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
