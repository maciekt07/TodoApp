import { useState, useEffect, ReactNode } from "react";
import { AddTaskBtn, Tasks } from "../components";
import {
  ColorPalette,
  GreetingHeader,
  GreetingText,
  Offline,
  ProgressPercentageContainer,
  StyledProgress,
  TaskCompletionText,
  TaskCountHeader,
  TaskCountTextContainer,
  TasksCount,
  TasksCountContainer,
} from "../styles";
import { UserProps } from "../types/user";
import { displayGreeting, getRandomGreeting, getTaskCompletionText } from "../utils";
import { Emoji } from "emoji-picker-react";
import { Box, Typography } from "@mui/material";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { WifiOff } from "@mui/icons-material";

export const Home = ({ user, setUser }: UserProps) => {
  const [randomGreeting, setRandomGreeting] = useState<string | ReactNode>("");
  const [greetingKey, setGreetingKey] = useState<number>(0);
  const [completedTasksCount, setCompletedTasksCount] = useState<number>(0);
  const [tasksWithDeadlineTodayCount, setTasksWithDeadlineTodayCount] = useState<number>(0);

  const completedTaskPercentage = (completedTasksCount / user.tasks.length) * 100;

  const isOnline = useOnlineStatus();

  useEffect(() => {
    setRandomGreeting(getRandomGreeting());
    document.title = "Todo App";

    const interval = setInterval(() => {
      setRandomGreeting(getRandomGreeting());
      setGreetingKey((prevKey) => prevKey + 1); // Update the key on each interval
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const completedCount = user.tasks.filter((task) => task.done).length;
    setCompletedTasksCount(completedCount);

    const today = new Date().setHours(0, 0, 0, 0);

    const count = user.tasks.filter((task) => {
      if (task.deadline) {
        const taskDeadline = new Date(task.deadline).setHours(0, 0, 0, 0);
        return taskDeadline === today && !task.done;
      }
      return false;
    }).length;

    setTasksWithDeadlineTodayCount(count);
  }, [user.tasks]);

  const replaceEmojiCodes = (text: string): ReactNode[] => {
    const emojiRegex = /\*\*(.*?)\*\*/g;
    const parts = text.split(emojiRegex);

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // It's an emoji code, render Emoji component
        const emojiCode = part.trim();
        return <Emoji key={index} size={20} unified={emojiCode} emojiStyle={user.emojisStyle} />;
      } else {
        // It's regular text
        return part;
      }
    });
  };

  const renderGreetingWithEmojis = (text: string | ReactNode) => {
    if (typeof text === "string") {
      return replaceEmojiCodes(text);
    } else {
      // It's already a ReactNode, no need to process
      return text;
    }
  };

  return (
    <>
      <GreetingHeader>
        <Emoji unified="1f44b" emojiStyle={user.emojisStyle} /> &nbsp; {displayGreeting()}
        {user.name && ", " + user.name}
      </GreetingHeader>
      <GreetingText key={greetingKey}>{renderGreetingWithEmojis(randomGreeting)}</GreetingText>
      {!isOnline && (
        <Offline>
          <WifiOff /> You're offline but you can use the app!
        </Offline>
      )}
      {user.tasks.length > 0 && (
        <TasksCountContainer>
          <TasksCount glow={user.settings[0].enableGlow}>
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <StyledProgress
                variant="determinate"
                value={completedTaskPercentage}
                size={64}
                thickness={5}
                style={{
                  filter: user.settings[0].enableGlow
                    ? `drop-shadow(0 0 6px ${ColorPalette.purple})`
                    : "none",
                }}
              />

              <ProgressPercentageContainer>
                <Typography
                  variant="caption"
                  component="div"
                  color="white"
                  sx={{ fontSize: "16px", fontWeight: 500 }}
                >{`${Math.round(completedTaskPercentage)}%`}</Typography>
              </ProgressPercentageContainer>
            </Box>
            <TaskCountTextContainer>
              <TaskCountHeader>
                You have {user.tasks.length - completedTasksCount} unfinished tasks{" "}
                {completedTasksCount > 0 && `and ${completedTasksCount} done`}
              </TaskCountHeader>
              <TaskCompletionText>
                {getTaskCompletionText(completedTaskPercentage)}
              </TaskCompletionText>
              {tasksWithDeadlineTodayCount > 0 && (
                <span>Tasks due today: {tasksWithDeadlineTodayCount}</span>
              )}
            </TaskCountTextContainer>
          </TasksCount>
        </TasksCountContainer>
      )}

      <Tasks user={user} setUser={setUser} />

      <AddTaskBtn animate={user.tasks.length === 0} user={user} />
    </>
  );
};
