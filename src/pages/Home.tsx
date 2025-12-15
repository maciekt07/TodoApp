import { useContext, useMemo, lazy, Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  AddButton,
  GreetingHeader,
  Offline,
  ProgressPercentageContainer,
  StyledProgress,
  TaskCompletionText,
  TaskCountClose,
  TaskCountHeader,
  TaskCountTextContainer,
  TasksCount,
  TasksCountContainer,
} from "../styles";

import { Emoji } from "emoji-picker-react";
import { Box, Button, CircularProgress, Tooltip, Typography } from "@mui/material";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { AddRounded, CloseRounded, TodayRounded, UndoRounded, WifiOff } from "@mui/icons-material";
import { UserContext } from "../contexts/UserContext";
import { useResponsiveDisplay } from "../hooks/useResponsiveDisplay";
import { useNavigate } from "react-router-dom";
import { AnimatedGreeting } from "../components/AnimatedGreeting";
import { showToast } from "../utils";

const TasksList = lazy(() =>
  import("../components/tasks/TasksList").then((module) => ({ default: module.TasksList })),
);

const Home = () => {
  const { user, setUser } = useContext(UserContext);
  const { tasks, emojisStyle, settings, name } = user;
  const { t } = useTranslation();

  const isOnline = useOnlineStatus();
  const n = useNavigate();
  const isMobile = useResponsiveDisplay();

  useEffect(() => {
    document.title = "Todo App";
  }, []);

  // Calculate these values only when tasks change
  const taskStats = useMemo(() => {
    const completedCount = tasks.filter((task) => task.done).length;
    const completedPercentage = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

    const today = new Date().setHours(0, 0, 0, 0);
    const dueTodayTasks = tasks.filter((task) => {
      if (task.deadline) {
        const taskDeadline = new Date(task.deadline).setHours(0, 0, 0, 0);
        return taskDeadline === today && !task.done;
      }
      return false;
    });

    const taskNamesDueToday = dueTodayTasks.map((task) => task.name);

    return {
      completedTasksCount: completedCount,
      completedTaskPercentage: completedPercentage,
      tasksWithDeadlineTodayCount: dueTodayTasks.length,
      tasksDueTodayNames: taskNamesDueToday,
    };
  }, [tasks]);

  // Memoize time-based greeting
  const timeGreeting = useMemo(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12 && currentHour >= 5) {
      return t("greetings.morning");
    } else if (currentHour < 18 && currentHour > 12) {
      return t("greetings.afternoon");
    } else {
      return t("greetings.evening");
    }
  }, [t]);

  // Memoize task completion text
  const taskCompletionText = useMemo(() => {
    const percentage = taskStats.completedTaskPercentage;
    switch (true) {
      case percentage === 0:
        return t("home.completion.noTasks");
      case percentage === 100:
        return t("home.completion.allCompleted");
      case percentage >= 75:
        return t("home.completion.almostThere");
      case percentage >= 50:
        return t("home.completion.halfway");
      case percentage >= 25:
        return t("home.completion.goodProgress");
      default:
        return t("home.completion.justStarted");
    }
  }, [taskStats.completedTaskPercentage, t]);

  const updateShowProgressBar = (value: boolean) => {
    setUser((prevUser) => ({
      ...prevUser,
      settings: {
        ...prevUser.settings,
        showProgressBar: value,
      },
    }));
  };

  return (
    <>
      <GreetingHeader>
        <Emoji unified="1f44b" emojiStyle={emojisStyle} /> &nbsp; {timeGreeting}
        {name && (
          <span translate="no">
            , <span>{name}</span>
          </span>
        )}
      </GreetingHeader>

      <AnimatedGreeting />

      {!isOnline && (
        <Offline>
          <WifiOff /> {t("home.offline")}
        </Offline>
      )}
      {tasks.length > 0 && settings.showProgressBar && (
        <TasksCountContainer>
          <TasksCount glow={settings.enableGlow}>
            <TaskCountClose
              size="small"
              onClick={() => {
                updateShowProgressBar(false);
                showToast(
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {t("home.progressBarHidden")}
                    <Button
                      variant="contained"
                      sx={{ p: "12px 32px" }}
                      onClick={() => updateShowProgressBar(true)}
                      startIcon={<UndoRounded />}
                    >
                      {t("common.undo")}
                    </Button>
                  </span>,
                );
              }}
            >
              <CloseRounded />
            </TaskCountClose>
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <StyledProgress
                variant="determinate"
                value={taskStats.completedTaskPercentage}
                size={64}
                thickness={5}
                aria-label="Progress"
                glow={settings.enableGlow}
              />

              <ProgressPercentageContainer
                glow={settings.enableGlow && taskStats.completedTaskPercentage > 0}
              >
                <Typography
                  variant="caption"
                  component="div"
                  color="white"
                  sx={{ fontSize: "16px", fontWeight: 600 }}
                >{`${Math.round(taskStats.completedTaskPercentage)}%`}</Typography>
              </ProgressPercentageContainer>
            </Box>
            <TaskCountTextContainer>
              <TaskCountHeader>
                {taskStats.completedTasksCount === 0
                  ? `${t("common.tasks")}: ${tasks.length}`
                  : t("home.tasksCompletedOutOf", {
                      completed: taskStats.completedTasksCount,
                      total: tasks.length,
                    })}
              </TaskCountHeader>
              <TaskCompletionText>{taskCompletionText}</TaskCompletionText>
              {taskStats.tasksWithDeadlineTodayCount > 0 && (
                <span
                  style={{
                    opacity: 0.8,
                    display: "inline-block",
                  }}
                >
                  <TodayRounded sx={{ fontSize: "20px", verticalAlign: "middle" }} />
                  &nbsp;
                  {t("home.dueTodayTasks", { count: taskStats.tasksWithDeadlineTodayCount })}
                  :&nbsp;
                  <span translate="no">
                    {new Intl.ListFormat(user.settings.language, { style: "long" }).format(
                      taskStats.tasksDueTodayNames,
                    )}
                  </span>
                </span>
              )}
            </TaskCountTextContainer>
          </TasksCount>
        </TasksCountContainer>
      )}
      <Suspense
        fallback={
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        }
      >
        <TasksList />
      </Suspense>
      {!isMobile && (
        <Tooltip
          title={tasks.length > 0 ? t("home.addNewTask") : t("common.addTask")}
          placement="left"
        >
          <AddButton
            animate={tasks.length === 0}
            glow={settings.enableGlow}
            onClick={() => n("add")}
            aria-label={t("common.addTask")}
          >
            <AddRounded style={{ fontSize: "44px" }} />
          </AddButton>
        </Tooltip>
      )}
    </>
  );
};

export default Home;
