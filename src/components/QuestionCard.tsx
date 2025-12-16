import "katex/dist/katex.min.css";
import { CheckCircle2, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { BlockMath, InlineMath } from "react-katex";
import ReactMarkdown from "react-markdown";
import { cn } from "../lib/utils";
import type { Question } from "../types";
import { Button } from "../uikits";

interface QuestionCardProps {
  question: Question;
  className?: string;
}

export function QuestionCard({ question, className }: QuestionCardProps) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white rounded-xl  border border-slate-200 overflow-hidden",
        className
      )}
    >
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-800">{question.title}</h2>
      </div>

      <div className="flex-1 p-6 overflow-y-auto prose prose-slate max-w-none">
        <ReactMarkdown
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              if (match?.[1] === "math") {
                return (
                  <div className="overflow-x-auto my-4">
                    <BlockMath math={String(children).replace(/\n$/, "")} />
                  </div>
                );
              }
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            p: ({ children }) => {
              return (
                <p className="mb-4 last:mb-0 leading-relaxed">
                  {React.Children.map(children, (child) => {
                    if (typeof child === "string") {
                      const parts = child.split(/(\$[^$]+\$)/g);
                      return parts.map((part, index) => {
                        if (part.startsWith("$") && part.endsWith("$")) {
                          return (
                            <InlineMath key={index} math={part.slice(1, -1)} />
                          );
                        }
                        return part;
                      });
                    }
                    return child;
                  })}
                </p>
              );
            },
          }}
        >
          {question.content}
        </ReactMarkdown>
      </div>

      <div className="p-6 border-t border-gray-100 bg-gray-50/30">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label
            htmlFor="answer"
            className="block text-sm font-medium text-gray-700"
          >
            Your Answer
          </label>
          <div className="relative">
            <textarea
              id="answer"
              rows={3}
              className="w-full rounded-lg bg-gray-50 border border-gray-200 p-2  focus-within:ring-blue-500 focus-within:border-transparent transition-all resize-none"
              placeholder="Type your solution here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={submitted}
            />
            {submitted && (
              <div className="absolute top-3 right-3 text-green-500">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={!answer || submitted}
            className="flex items-center justify-center w-full"
          >
            {submitted ? "Submitted" : "Submit Answer"}
            {!submitted && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
