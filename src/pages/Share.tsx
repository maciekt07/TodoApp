import { Alert, AlertTitle, Dialog, DialogActions, DialogContent, Tooltip } from "@mui/material";
import {
  DescriptionLink,
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
} from "../components/tasks/tasks.styled";
import { DialogBtn } from "../styles";
import { useLocation, useNavigate } from "react-router-dom";
import { JSX, useContext, useEffect, useState } from "react";
import type { Task } from "../types/user";
import {
  calculateDateDifference,
  formatDate,
  generateUUID,
  getFontColor,
  isHexColor,
  showToast,
  systemInfo,
} from "../utils";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { UserContext } from "../contexts/UserContext";
import {
  AddTaskRounded,
  DoNotDisturbAltRounded,
  DoneRounded,
  ErrorRounded,
  LinkOff,
  PushPinRounded,
} from "@mui/icons-material";
import { URL_REGEX, USER_NAME_MAX_LENGTH } from "../constants";
import { CategoryBadge, CustomDialogTitle } from "../components";
import Home from "./Home";
import LZString from "lz-string";
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

  useEffect(() => {
    const handleTaskData = (decodedTask: string) => {
      const task: Task = { ...(JSON.parse(decodedTask) as Task), id: generateUUID() };

      if (
        !isHexColor(task.color) ||
        (task.category && task.category.some((cat) => !isHexColor(cat.color)))
      ) {
        setError(true);
        setErrorDetails("Invalid task or category color format.");
        return;
      }

      setTaskData(task);
    };

    if (taskParam) {
      try {
        let decodedTask = decodeURIComponent(taskParam);

        if (decodedTask.startsWith("{") || decodedTask.startsWith("[")) {
          // old JSON format
          handleTaskData(decodedTask);
        } else {
          // new compressed format
          decodedTask = LZString.decompressFromEncodedURIComponent(decodedTask);
          if (!decodedTask) throw new Error("Decompression failed.");
          handleTaskData(decodedTask);
        }
      } catch (error) {
        console.error("Error decoding task data:", error);
        setError(true);
        setErrorDetails("Failed to decode task data. The link may be corrupted. " + error);
      }
    } else {
      setError(true);
      setErrorDetails("No task data found in the link.");
    }

    if (userNameParam) {
      const decodedUserName = decodeURIComponent(userNameParam);
      if (decodedUserName.length > USER_NAME_MAX_LENGTH) {
        setError(true);
        setErrorDetails("User name is too long.");
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
            (cat) => cat.id === taskCategory.id,
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
            id: generateUUID(),
            sharedBy: userName,
          },
        ],
      }));

      n("/");
      showToast(
        <div>
          Added shared task - <b translate="no">{taskData.name}</b>
        </div>,
        {
          icon: <AddTaskRounded />,
        },
      );
    }
  };

  // Renders the task description with optional hyperlink parsing and text highlighting.
  const renderTaskDescription = (task: Task): JSX.Element | null => {
    if (!task || !task.description) {
      return null;
    }

    const { description, color } = task;

    const parts = description.split(URL_REGEX);

    const descriptionWithLinks = parts.map((part, index) => {
      if (index % 2 === 0) {
        return part;
      } else {
        // Store link part in state
        const url = new URL(part);
        return (
          <Tooltip title={part} key={index}>
            <DescriptionLink clr={color} disabled>
              <div>
                <LinkOff sx={{ fontSize: "24px" }} /> {url.hostname}
              </div>
            </DescriptionLink>
          </Tooltip>
        );
      }
    });

    return <div>{descriptionWithLinks}</div>;
  };

  return (
    <>
      <Home />
      <Dialog
        open
        fullWidth
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
            <CustomDialogTitle
              title="Recieved Task"
              subTitle="You can now include it in your list."
              icon={<AddTaskRounded />}
            />
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
                          size={systemInfo.os === "iOS" ? 48 : 36}
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
                  <TaskDescription done={taskData.done}>
                    {renderTaskDescription(taskData)}
                  </TaskDescription>
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
              {taskData && taskData.description && taskData.description.match(URL_REGEX) ? (
                <Alert sx={{ mt: "20px" }} severity="warning">
                  <AlertTitle>This task contains the following links:</AlertTitle>{" "}
                  {(() => {
                    const links = taskData.description.match(URL_REGEX)?.map((link) => link);
                    if (links) {
                      const listFormatter = new Intl.ListFormat("en-US", {
                        style: "long",
                        type: "conjunction",
                      });
                      return (
                        <span style={{ wordBreak: "break-all" }}>
                          {listFormatter.format(links)}
                        </span>
                      );
                    }
                    return null;
                  })()}
                </Alert>
              ) : null}
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
            <CustomDialogTitle
              title="Failed to recieve Task"
              subTitle="This Task could not be processed."
              onClose={() => n("/")}
              icon={<ErrorRounded />}
            />
            <DialogContent>
              <Alert severity="error">
                <AlertTitle>Error: failed to process the task</AlertTitle>
                {errorDetails}
              </Alert>
            </DialogContent>
            <DialogActions>
              <DialogBtn onClick={() => n("/")}>Close</DialogBtn>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default SharePage;
