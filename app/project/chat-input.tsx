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
import { type FormEventHandler, useState } from "react";

export default function ChatInput() {
  const [text, setText] = useState<string>("");
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!text) {
      return;
    }
    setStatus("submitted");
    setTimeout(() => {
      setStatus("streaming");
    }, 200);
    setTimeout(() => {
      setStatus("ready");
    }, 2000);
  };

  return (
    <AIInput onSubmit={handleSubmit}>
      <AIInputTextarea
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setText(e.target.value)
        }
        value={text}
      />
      <AIInputToolbar>
        <AIInputTools>
          <AIInputButton>
            <PlusIcon size={16} />
          </AIInputButton>
        </AIInputTools>
        <AIInputSubmit disabled={!text} status={status} />
      </AIInputToolbar>
    </AIInput>
  );
}
