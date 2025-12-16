# Smart Tutor

A frontend implementation of an **Exam Mode** interface with a simulated AI helper (**Ask Jojo**), built with React, Vite, and XState.

## Project Preview

https://github.com/user-attachments/assets/preview.mp4
[Watch Preview Video](public/preview.mp4)

## Setup Instructions

1.  **Install Dependencies**

    ```bash
    bun install
    ```

2.  **Run Development Server**

    ```bash
    bun dev
    ```

3.  **Open Application**
    Navigate to `http://localhost:5173` in your browser.

## Implementation Details

- **Mock Data**: The questions are hardcoded in `src/data/questions.ts`.
- **Simulated AI**: The AI responses are simulated using `setTimeout` within the XState machine (`src/machines/chatMachine.ts`) to mimic network latency.
- **Styling**: The project uses Tailwind CSS v4 for styling.
- **Math Rendering**: LaTeX content is rendered using `katex` and `react-katex`.
- **Mobile First**: The layout is responsive, with a specific drawer implementation for chat on mobile devices.

## Wiring to a Real LLM

To connect this UI to a real LLM API in production:

1.  **Backend Endpoint**: You would set up a backend endpoint (e.g., `/api/chat`) to handle the LLM requests securely (hiding API keys).

2.  **Payload Structure**: When sending a request, construct a JSON payload that includes the conversation history and the current context (question data and user action). For example:

    ```json
    {
      "messages": [
        {
          "role": "system",
          "content": "You are a helpful math tutor. Guide the student without giving away the answer immediately."
        },
        { "role": "user", "content": "Please give me a hint." }
      ],
      "context": {
        "questionId": "q_spm_99",
        "questionContent": "Convert number 0.00... to standard form...",
        "intent": "HINT" // or "STEPS" or "GENERAL_CHAT"
      }
    }
    ```

3.  **Integration**:
    Modify the `chatMachine.ts` file. In the `generateReply` actor, replace the mock delay and hardcoded responses with a `fetch` call:

    ```typescript
    generateReply: fromPromise(async ({ input }) => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          body: JSON.stringify({
            messages: input.history,
            context: {
              intent: input.type,
              // ...other context
            },
          }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        return data.reply;
      } catch (error) {
        return "Sorry, I'm having trouble connecting to the server.";
      }
    });
    ```
