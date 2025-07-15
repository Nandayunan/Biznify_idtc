import { ChatProvider } from "../chat-context";
import ChatConversation from "./chat-conversation";
import ChatInput from "./chat-input";
import SummarySection from "./summary-section";

export default function ProjectPage() {
  return (
    <ChatProvider>
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
    </ChatProvider>
  );
}
