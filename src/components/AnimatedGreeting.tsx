import { useState, useEffect, ReactNode, useCallback, memo, useContext, useRef } from "react";
import { Emoji } from "emoji-picker-react";
import { fadeInLeft } from "../styles";
import { UserContext } from "../contexts/UserContext";
import styled from "@emotion/styled";
import { getRandomGreeting } from "../utils";

export const AnimatedGreeting = memo(() => {
  const [randomGreeting, setRandomGreeting] = useState<string>("");
  const [greetingKey, setGreetingKey] = useState<number>(0);
  const { user } = useContext(UserContext);
  const { emojisStyle } = user;

  // use refs to avoid recreating the animation frame on each render
  const animationFrameIdRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  // Cache the rendered greeting
  const renderedGreetingRef = useRef<ReactNode[]>([]);

  const replaceEmojiCodes = useCallback(
    (text: string): ReactNode[] => {
      const emojiRegex = /\*\*(.*?)\*\*/g;
      const parts = text.split(emojiRegex);

      return parts.map((part, index) => {
        if (index % 2 === 1) {
          // It's an emoji code, render Emoji component
          const emojiCode = part.trim();
          return <Emoji key={index} size={20} unified={emojiCode} emojiStyle={emojisStyle} />;
        } else {
          // It's regular text
          return part;
        }
      });
    },
    [emojisStyle],
  );

  useEffect(() => {
    const initialGreeting = getRandomGreeting();
    setRandomGreeting(initialGreeting);
    renderedGreetingRef.current = replaceEmojiCodes(initialGreeting);

    const updateInterval = 6000;

    const updateGreeting = (timestamp: number) => {
      if (timestamp - lastUpdateTimeRef.current >= updateInterval) {
        lastUpdateTimeRef.current = timestamp;
        const newGreeting = getRandomGreeting();
        setRandomGreeting(newGreeting);
        renderedGreetingRef.current = replaceEmojiCodes(newGreeting);
        setGreetingKey((prev) => prev + 1);
      }

      animationFrameIdRef.current = requestAnimationFrame(updateGreeting);
    };

    animationFrameIdRef.current = requestAnimationFrame(updateGreeting);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [replaceEmojiCodes]);

  return (
    <GreetingText key={greetingKey} className="animated-greeting">
      {typeof randomGreeting === "string" ? replaceEmojiCodes(randomGreeting) : randomGreeting}
    </GreetingText>
  );
});

const GreetingText = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  margin-top: 4px;
  margin-left: 8px;
  font-style: italic;
  will-change: transform, opacity;
  animation: ${fadeInLeft} 0.5s ease-in-out;
`;
