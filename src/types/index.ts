export interface Question {
  id: string;
  title: string;
  content: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export type ChatAction = "HINT" | "REVEAL_STEPS";
