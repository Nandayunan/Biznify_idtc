"use client";

import {
  AIInput,
  AIInputButton,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@/components/ui/kibo-ui/ai/input";
import { PlusIcon } from "lucide-react";
import { useChatContext } from "../chat-context";

export default function ChatInput() {
  const { input, handleInputChange, handleSubmit, status } = useChatContext();

  return (
    <AIInput onSubmit={handleSubmit}>
      <AIInputTextarea onChange={handleInputChange} value={input} />
      <AIInputToolbar>
        <AIInputTools>
          <AIInputButton>
            <PlusIcon size={16} />
          </AIInputButton>
        </AIInputTools>
        <AIInputSubmit
          disabled={!input && status !== "ready"}
          status={status}
        />
      </AIInputToolbar>
    </AIInput>
  );
}
