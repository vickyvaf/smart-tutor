import { setup, assign, fromPromise } from "xstate";
import type { Message } from "../types";

export const chatMachine = setup({
  types: {
    context: {} as {
      messages: Message[];
      isThinking: boolean;
    },
    events: {} as
      | { type: "SEND_MESSAGE"; content: string }
      | { type: "ASK_HINT" }
      | { type: "REVEAL_STEPS" }
      | { type: "RECEIVE_REPLY"; content: string },
  },
  actors: {
    generateReply: fromPromise(async () => {
      const responses = [
        "That's a great question! Have you tried breaking it down?",
        "Remember to check your variables.",
        "You're on the right track! Keep going.",
        "Let's look at the formula again.",
        "Integration can be tricky, but you're doing well.",
      ];
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return responses[Math.floor(Math.random() * responses.length)];
    }),
  },
  actions: {
    addUserMessage: assign({
      messages: ({ context, event }) => {
        if (event.type !== "SEND_MESSAGE") return context.messages;
        return [
          ...context.messages,
          {
            id: Date.now().toString(),
            role: "user" as const,
            content: event.content,
            timestamp: Date.now(),
          },
        ];
      },
      isThinking: () => true,
    }),
    addSystemMessage: assign({
      messages: ({ context, event }) => {
        if (event.type !== "RECEIVE_REPLY") return context.messages;
        return [
          ...context.messages,
          {
            id: Date.now().toString(),
            role: "assistant" as const,
            content: event.content,
            timestamp: Date.now(),
          },
        ];
      },
      isThinking: () => false,
    }),
    addHintRequest: assign({
      messages: ({ context }) => [
        ...context.messages,
        {
          id: Date.now().toString(),
          role: "user" as const,
          content: "Please give me a hint.",
          timestamp: Date.now(),
        },
      ],
      isThinking: () => true,
    }),
    addRevealRequest: assign({
      messages: ({ context }) => [
        ...context.messages,
        {
          id: Date.now().toString(),
          role: "user" as const,
          content: "Please reveal the solution steps.",
          timestamp: Date.now(),
        },
      ],
      isThinking: () => true,
    }),
  },
}).createMachine({
  id: "chat",
  initial: "idle",
  context: {
    messages: [
      {
        id: "welcome",
        role: "assistant" as const,
        content:
          "Hi! I'm Jojo, your AI tutor. I can help you solving this problem. Ask me anything or use the buttons below.",
        timestamp: Date.now(),
      },
    ],
    isThinking: false,
  },
  states: {
    idle: {
      on: {
        SEND_MESSAGE: {
          target: "thinking",
          actions: "addUserMessage",
        },
        ASK_HINT: {
          target: "thinking",
          actions: "addHintRequest",
        },
        REVEAL_STEPS: {
          target: "thinking",
          actions: "addRevealRequest",
        },
      },
    },
    thinking: {
      invoke: {
        src: "generateReply",
        onDone: {
          target: "idle",
          actions: assign({
            messages: ({ context, event }) => [
              ...context.messages,
              {
                id: Date.now().toString(),
                role: "assistant" as const,
                content: event.output,
                timestamp: Date.now(),
              },
            ],
            isThinking: () => false,
          }),
        },
      },
    },
  },
});
