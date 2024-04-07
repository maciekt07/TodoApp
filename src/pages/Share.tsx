import { Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from "@mui/material";
import {
  DialogBtn,
  EmojiContainer,
  Pinned,
  RingAlarm,
  TaskContainer,
  TaskDate,
  TaskDescription,
  TaskHeader,
  TaskInfo,
  TaskName,
  TimeLeft,
} from "../styles";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import type { Task } from "../types/user";
import { calculateDateDifference, formatDate, getFontColor, iOS, showToast } from "../utils";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { UserContext } from "../contexts/UserContext";
import {
  AddTaskRounded,
  DoNotDisturbAltRounded,
  DoneRounded,
  PushPinRounded,
} from "@mui/icons-material";
import { USER_NAME_MAX_LENGTH } from "../constants";
import { CategoryBadge } from "../components";
import Home from "./Home";

//FIXME: make everything type-safe
const SharePage = () => {
  const { user, setUser } = useContext(UserContext);
  const n = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskParam = queryParams.get("task");
  const userNameParam = queryParams.get("userName");

  const [taskData, setTaskData] = useState<Task | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [errorDetails, setErrorDetails] = useState<string | undefined>();
  const isHexColor = (value: string): boolean => /^#[0-9A-Fa-f]{6}$/.test(value);

  useEffect(() => {
    if (taskParam) {
      try {
        const decodedTask = decodeURIComponent(taskParam);
        const task: Task = {
          ...(JSON.parse(decodedTask) as Task),
          id: crypto.randomUUID(),
        };
        if (!isHexColor(task.color)) {
          setError(true);
          setErrorDetails("Invalid task color format.");
          return;
        }
        if (task.category) {
          task.category.forEach((taskCategory) => {
            if (!isHexColor(taskCategory.color)) {
              setError(true);
              setErrorDetails("Invalid category color format.");
              return;
            }
          });
        }
        setTaskData(task);
      } catch (error) {
        console.error("Error decoding task data:", error);
        setErrorDetails("Error decoding task data." + error);
        setError(true);
      }
    }

    if (userNameParam) {
      const decodedUserName = decodeURIComponent(userNameParam);
      if (decodedUserName.length > USER_NAME_MAX_LENGTH) {
        setError(true);
        setErrorDetails("User name is too long.");
        console.log("User name is too long");
      }
      setUserName(decodedUserName);
    }
  }, [taskParam, userNameParam]);

  useEffect(() => {
    document.title = `Todo App - Recieved Task ${taskData ? "(" + taskData.name + ")" : ""}`;
  }, [taskData]);

  const handleAddTask = () => {
    if (taskData) {
      // Add missing categories to user.categories
      const updatedCategories = [...user.categories];

      if (taskData.category) {
        taskData.category.forEach((taskCategory) => {
          const existingCategoryIndex = updatedCategories.findIndex(
            (cat) => cat.id === taskCategory.id
          );

          if (existingCategoryIndex !== -1) {
            // If category with the same ID exists, replace it with the new category
            updatedCategories[existingCategoryIndex] = taskCategory;
          } else {
            // Otherwise, add the new category to the array
            updatedCategories.push(taskCategory);
          }
        });
      }

      setUser((prevUser) => ({
        ...prevUser,
        categories: updatedCategories,
        tasks: [
          ...prevUser.tasks.filter(Boolean),
          {
            ...taskData,
            id: crypto.randomUUID(),
            sharedBy: userName,
          },
        ],
      }));

      n("/");
      showToast(
        <div>
          Added shared task - <b translate="no">{taskData.name}</b>
        </div>
      );
    }
  };

  return (
    <div>
      <Home />
      <Dialog
        open
        PaperProps={{
          style: {
            borderRadius: "24px",
            padding: " 10px 6px",
            width: "100% !important",
          },
        }}
      >
        {!error && taskData ? (
          <>
            <DialogTitle>Recieved Task</DialogTitle>
            <DialogContent>
              <p style={{ fontSize: "16px", marginLeft: "6px" }}>
                <b translate="no">{userName}</b> shared you a task.
              </p>
              <TaskContainer
                done={taskData.done}
                backgroundColor={taskData.color}
                style={{ maxWidth: "600px", opacity: 1, padding: "16px 22px" }}
              >
                {taskData.emoji || taskData.done ? (
                  <EmojiContainer clr={getFontColor(taskData.color)}>
                    {taskData.done ? (
                      <DoneRounded fontSize="large" />
                    ) : user.emojisStyle === EmojiStyle.NATIVE ? (
                      <div>
                        <Emoji
                          size={iOS ? 48 : 36}
                          unified={taskData.emoji || ""}
                          emojiStyle={EmojiStyle.NATIVE}
                        />
                      </div>
                    ) : (
                      <Emoji
                        size={48}
                        unified={taskData.emoji || ""}
                        emojiStyle={user.emojisStyle}
                      />
                    )}
                  </EmojiContainer>
                ) : null}
                <TaskInfo translate="no" style={{ marginRight: "14px" }}>
                  {taskData.pinned && (
                    <Pinned translate="yes">
                      <PushPinRounded fontSize="small" /> &nbsp; Pinned
                    </Pinned>
                  )}
                  <TaskHeader style={{ gap: "6px" }}>
                    <TaskName done={taskData.done}>{taskData.name}</TaskName>
                    <Tooltip
                      title={new Intl.DateTimeFormat(navigator.language, {
                        dateStyle: "full",
                        timeStyle: "medium",
                      }).format(new Date(taskData.date))}
                    >
                      <TaskDate>{formatDate(new Date(taskData.date))}</TaskDate>
                    </Tooltip>
                  </TaskHeader>
                  <TaskDescription done={taskData.done}>{taskData.description}</TaskDescription>
                  {taskData.deadline && (
                    <TimeLeft done={taskData.done}>
                      <RingAlarm
                        fontSize="small"
                        animate={new Date() > new Date(taskData.deadline) && !taskData.done}
                        sx={{
                          color: `${getFontColor(taskData.color)} !important`,
                        }}
                      />
                      &nbsp;Deadline:&nbsp;
                      {new Date(taskData.deadline).toLocaleDateString()} {" • "}
                      {new Date(taskData.deadline).toLocaleTimeString()}
                      {!taskData.done && (
                        <>
                          {" • "}
                          {calculateDateDifference(new Date(taskData.deadline))}
                        </>
                      )}
                    </TimeLeft>
                  )}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "4px 6px",
                      justifyContent: "left",
                      alignItems: "center",
                    }}
                  >
                    {taskData.category &&
                      // user.settings[0].enableCategories &&
                      taskData.category.map((category) => (
                        <div key={category.id}>
                          <CategoryBadge
                            category={category}
                            borderclr={getFontColor(taskData.color)}
                          />
                        </div>
                      ))}
                  </div>
                </TaskInfo>
              </TaskContainer>
            </DialogContent>
            <DialogActions>
              <DialogBtn color="error" onClick={() => n("/")}>
                <DoNotDisturbAltRounded /> &nbsp; Decline
              </DialogBtn>
              <DialogBtn
                onClick={() => {
                  handleAddTask();
                  n("/");
                }}
              >
                <AddTaskRounded /> &nbsp; Add Task
              </DialogBtn>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>Something went wrong</DialogTitle>
            <DialogContent>
              <p>
                Oops! Something went wrong while processing the shared task.{" "}
                {errorDetails && (
                  <b>
                    <br /> {errorDetails}
                  </b>
                )}
              </p>
            </DialogContent>
            <DialogActions>
              <DialogBtn onClick={() => n("/")}>Close</DialogBtn>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default SharePage;
