"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MarkdownSummaryProps {
  title: string;
  content: string;
  defaultExpanded?: boolean;
  badge?: string;
  className?: string;
}

export default function MarkdownSummary({
  title,
  content,
  defaultExpanded = false,
  badge,
  className = "",
}: MarkdownSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <Card
      className={`w-full bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl rounded-xl ${className}`}
    >
      <CardHeader className="pb-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left hover:bg-white/10 rounded-xl p-3 -m-3 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-white" />
            ) : (
              <ChevronRight className="h-5 w-5 text-white" />
            )}
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {badge && (
              <Badge
                variant="secondary"
                className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0"
              >
                {badge}
              </Badge>
            )}
          </div>
        </button>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="prose prose-sm max-w-none prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeString = String(children).replace(/\n$/, "");

                  if (match) {
                    return (
                      <div className="relative group">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                          onClick={() => copyToClipboard(codeString)}
                        >
                          {copiedCode === codeString ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                        <SyntaxHighlighter
                          language={match[1]}
                          PreTag="div"
                          className="rounded-xl bg-slate-800/50 border border-white/10"
                          customStyle={{
                            background: "rgba(30, 41, 59, 0.5)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "0.75rem",
                          }}
                        >
                          {codeString}
                        </SyntaxHighlighter>
                      </div>
                    );
                  }

                  return (
                    <code
                      className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono text-white border border-white/20"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold mb-4 text-white border-b border-white/20 pb-2">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-semibold mb-3 text-white">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-medium mb-2 text-white">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 text-slate-300 leading-relaxed">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-4 space-y-1 text-slate-300">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-4 space-y-1 text-slate-300">
                    {children}
                  </ol>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-purple-400 pl-4 italic my-4 text-slate-300 bg-white/5 rounded-r-xl p-3">
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-purple-400 hover:text-purple-300 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="min-w-full border-collapse border border-white/20 rounded-xl overflow-hidden">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-white/20 bg-white/10 px-4 py-2 text-left font-medium text-white">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-white/20 px-4 py-2 text-slate-300">
                    {children}
                  </td>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
