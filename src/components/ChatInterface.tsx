import { BookOpen, Bot, HelpCircle, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";
import type { Message } from "../types";
import { Button } from "../uikits";
import { TypewriterText } from "./TypewriterText";

interface ChatInterfaceProps {
  messages: Message[];
  isThinking: boolean;
  onSendMessage: (text: string) => void;
  onAskHint: () => void;
  onRevealSteps: () => void;
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function ChatInterface({
  messages,
  isThinking,
  onSendMessage,
  onAskHint,
  onRevealSteps,
  className,
  onClose,
}: ChatInterfaceProps) {
  const [inputObj, setInputObj] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputObj.trim()) return;
    onSendMessage(inputObj);
    setInputObj("");
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white border-l border-gray-200",
        className
      )}
    >
      <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <Bot className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Ask Jojo</h3>
            <p className="text-xs text-gray-500">AI Study Companion</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors md:hidden"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex w-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl p-4",
                msg.role === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white border border-gray-100 text-gray-800 rounded-bl-none"
              )}
            >
              <div className="flex items-start gap-2">
                {msg.role === "assistant" && (
                  <Sparkles className="w-4 h-4 text-blue-400 mt-1 shrink-0" />
                )}
                <div className="text-sm leading-relaxed">
                  {msg.role === "assistant" ? (
                    <TypewriterText text={msg.content} />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
              <span
                className={cn(
                  "text-[10px] block mt-1 opacity-70",
                  msg.role === "user"
                    ? "text-blue-200 text-right"
                    : "text-gray-400"
                )}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex justify-start w-full animate-in fade-in">
            <div className="bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-bl-none p-4  flex items-center gap-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              </div>
              <span className="text-xs text-gray-400 ml-2">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-white border-t border-gray-100 grid grid-cols-2 gap-2">
        <Button
          onClick={onAskHint}
          disabled={isThinking}
          className="flex items-center gap-2 font-medium text-sm justify-center"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Give Hint</span>
        </Button>
        <Button
          onClick={onRevealSteps}
          disabled={isThinking}
          variant="yellow"
          className="flex items-center gap-2 font-medium text-sm justify-center"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Reveal Steps</span>
        </Button>
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <form
          onSubmit={handleSend}
          className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-full px-2 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all"
        >
          <input
            type="text"
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-3 outline-none"
            placeholder="Ask a follow-up question..."
            value={inputObj}
            onChange={(e) => setInputObj(e.target.value)}
            disabled={isThinking}
          />
          <Button
            type="submit"
            disabled={!inputObj.trim() || isThinking}
            variant="default"
            className="px-5 rounded-full mb-2"
          >
            <Send size={16} />
          </Button>
        </form>
      </div>
    </div>
  );
}
