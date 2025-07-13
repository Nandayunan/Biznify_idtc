"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useChatContext } from "./chat-context";
import { Bot, User } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

export default function ChatMessages() {
  const { messages, status, append } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-6 shadow-2xl">
      <CardContent className="p-0">
        <div className="h-[60vh] overflow-y-auto p-6 space-y-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Avatar
                className={`w-10 h-10 shadow-lg ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500"
                    : "bg-gradient-to-r from-emerald-500 to-cyan-500"
                }`}
              >
                <AvatarFallback className="text-white">
                  {message.role === "user" ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <Bot className="w-5 h-5" />
                  )}
                </AvatarFallback>
              </Avatar>

              <div
                className={`flex-1 max-w-[80%] ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-4 rounded-2xl shadow-lg ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      : "bg-white/10 backdrop-blur-sm text-white border border-white/20"
                  }`}
                >
                  <div className="prose prose-invert max-w-none">
                    {message.parts
                      .filter((part) => part.type === "text")
                      .flatMap((part) => part.text.split("\n"))
                      .map((line, i) => (
                        <p
                          key={i}
                          className={`${i === 0 ? "" : "mt-2"} ${
                            line.trim() === "" ? "h-2" : ""
                          }`}
                        >
                          {line}
                        </p>
                      ))}
                  </div>

                  {message.parts
                    .filter((part) => part.type === "tool-invocation")
                    .filter(
                      (tool) =>
                        tool.toolInvocation.toolName === "generateQuestion"
                    )
                    .map((tool, index) => {
                      if (tool.toolInvocation.state === "result") {
                        return (
                          <div
                            key={`${tool.toolInvocation.toolCallId}-${index}`}
                            className="mt-2"
                          >
                            <p className="text-xl font-bold text-white border border-white/20 rounded-lg p-2">
                              {tool.toolInvocation.result.question}
                            </p>
                            <div className="mt-2 flex gap-2 flex-wrap">
                              {tool.toolInvocation.result.options.map(
                                (option: string) => (
                                  <Button
                                    key={option}
                                    className="bg-transparent text-white border border-white/20 hover:bg-white hover:text-black"
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
                      return (
                        <div key={`${tool.toolInvocation.toolCallId}-${index}`}>
                          Loading...
                        </div>
                      );
                    })}
                </div>
                <p className="text-xs text-slate-400 mt-2 px-2">
                  {message.role === "user" ? "You" : "BizConsult AI"}
                </p>
              </div>
            </div>
          ))}

          {status === "submitted" && (
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
  );
}
