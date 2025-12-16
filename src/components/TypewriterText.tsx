import { useEffect, useState } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export function TypewriterText({
  text,
  speed = 20,
  onComplete,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    setDisplayedText("");

    const startTimeout = setTimeout(() => {
      const intervalId = setInterval(() => {
        if (index < text.length) {
          setDisplayedText((prev) => prev + text.charAt(index));
          index++;
        } else {
          clearInterval(intervalId);
          onComplete?.();
        }
      }, speed);

      return () => clearInterval(intervalId);
    }, 100);

    return () => clearTimeout(startTimeout);
  }, [text, speed, onComplete]);

  return <span>{displayedText}</span>;
}
