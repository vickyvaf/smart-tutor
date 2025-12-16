import { useState } from "react";
import ReactMarkdown from "react-markdown";
import RemarkMath from "remark-math";
import RehypeKatex from "rehype-katex";
import type { Question } from "../types";
import "katex/dist/katex.min.css";
import { cn } from "../lib/utils";
import { ChevronRight, CheckCircle2 } from "lucide-react";
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
          remarkPlugins={[RemarkMath]}
          rehypePlugins={[RehypeKatex]}
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
