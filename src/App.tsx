import { useState } from "react";
import { useMachine } from "@xstate/react";
import { chatMachine } from "./machines/chatMachine";
import { Layout } from "./components/Layout";
import { QuestionCard } from "./components/QuestionCard";
import { ChatInterface } from "./components/ChatInterface";
import { questions } from "./data/questions";
import { MessageCircle } from "lucide-react";
import { Button } from "./uikits";

function App() {
  const [snapshot, send] = useMachine(chatMachine);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  const currentQuestion = questions[0];

  return (
    <Layout>
      <div className="flex h-full">
        <div className="flex-1 h-full overflow-hidden p-4">
          <QuestionCard question={currentQuestion} className="h-full" />
        </div>

        <div className="hidden md:block w-[400px] h-full z-20">
          <ChatInterface
            messages={snapshot.context.messages}
            isThinking={snapshot.context.isThinking}
            onSendMessage={(text) =>
              send({ type: "SEND_MESSAGE", content: text })
            }
            onAskHint={() => send({ type: "ASK_HINT" })}
            onRevealSteps={() => send({ type: "REVEAL_STEPS" })}
            className="h-full"
          />
        </div>

        <Button
          onClick={() => setIsMobileChatOpen(true)}
          className="flex items-center gap-2 h-fit absolute top-8 right-8 md:hidden"
        >
          <span>Ask Jojo</span>
          <MessageCircle size={24} />
        </Button>

        <div
          className={`fixed inset-0 z-50 bg-white md:hidden transition-transform duration-300 ease-in-out ${
            isMobileChatOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <ChatInterface
            messages={snapshot.context.messages}
            isThinking={snapshot.context.isThinking}
            onSendMessage={(text) =>
              send({ type: "SEND_MESSAGE", content: text })
            }
            onAskHint={() => send({ type: "ASK_HINT" })}
            onRevealSteps={() => send({ type: "REVEAL_STEPS" })}
            className="h-full"
            onClose={() => setIsMobileChatOpen(false)}
          />
        </div>
      </div>
    </Layout>
  );
}

export default App;
