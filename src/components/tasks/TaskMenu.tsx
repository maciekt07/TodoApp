import styled from "@emotion/styled";
import {
  Cancel,
  Close,
  ContentCopy,
  DeleteRounded,
  Done,
  EditRounded,
  LaunchRounded,
  LinkRounded,
  MoveUpRounded,
  Pause,
  PlayArrow,
  PushPinRounded,
  RadioButtonChecked,
  RecordVoiceOver,
  RecordVoiceOverRounded,
} from "@mui/icons-material";
import { Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { JSX, useContext, useMemo, useState } from "react";
import Marquee from "react-fast-marquee";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import { TaskIcon, TaskItem } from "..";
import { UserContext } from "../../contexts/UserContext";
import { useResponsiveDisplay } from "../../hooks/useResponsiveDisplay";
import { Task } from "../../types/user";
import { calculateDateDifference, generateUUID, showToast } from "../../utils";
import { useTheme } from "@emotion/react";
import { TaskContext } from "../../contexts/TaskContext";
import { ColorPalette } from "../../theme/themeConfig";
import { ShareDialog } from "./ShareDialog";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

export const TaskMenu = () => {
  const { user, setUser } = useContext(UserContext);
  const { tasks, settings } = user;
  const {
    selectedTaskId,
    anchorEl,
    anchorPosition,
    multipleSelectedTasks,
    handleSelectTask,
    setEditModalOpen,
    handleDeleteTask,
    handleCloseMoreMenu,
    moveMode,
    setMoveMode,
    setSearch,
  } = useContext(TaskContext);
  const [showShareDialog, setShowShareDialog] = useState<boolean>(false);

  const isMobile = useResponsiveDisplay();
  const n = useNavigate();
  const theme = useTheme();
  const prefersReducedMotion = usePrefersReducedMotion(user.settings.reduceMotion);

  const selectedTask = useMemo(() => {
    return tasks.find((task) => task.id === selectedTaskId) || ({} as Task);
  }, [selectedTaskId, tasks]);

  const redirectToTaskDetails = () => {
    const taskId = selectedTask?.id.toString().replace(".", "");
    n(`/task/${taskId}`);
  };

  const handleMarkAsDone = () => {
    // Toggles the "done" property of the selected task
    if (selectedTaskId) {
      handleCloseMoreMenu();
      const updatedTasks = tasks.map((task) => {
        if (task.id === selectedTaskId) {
          return { ...task, done: !task.done, lastSave: new Date() };
        }
        return task;
      });
      setUser((prevUser) => ({
        ...prevUser,
        tasks: updatedTasks,
      }));

      const allTasksDone = updatedTasks.every((task) => task.done);

      if (allTasksDone) {
        showToast(
          <div>
            <b>All tasks done</b>
            <br />
            <span>You've checked off all your todos. Well done!</span>
          </div>,
          {
            icon: (
              <div style={{ margin: "-6px 4px -6px -6px" }}>
                <TaskIcon variant="success" scale={0.18} />
              </div>
            ),
          },
        );
      }
    }
  };

  const handlePin = () => {
    // Toggles the "pinned" property of the selected task
    if (selectedTaskId) {
      handleCloseMoreMenu();
      const updatedTasks = tasks.map((task) => {
        if (task.id === selectedTaskId) {
          return { ...task, pinned: !task.pinned, lastSave: new Date() };
        }
        return task;
      });
      setUser((prevUser) => ({
        ...prevUser,
        tasks: updatedTasks,
      }));
    }
  };

  const handleDuplicateTask = () => {
    handleCloseMoreMenu();
    if (selectedTaskId) {
      if (selectedTask) {
        // Create a duplicated task with a new ID and current date
        const duplicatedTask: Task = {
          ...selectedTask,
          id: generateUUID(),
          date: new Date(),
          lastSave: undefined,
        };
        // Add the duplicated task to the existing tasks
        const updatedTasks = [...tasks, duplicatedTask];
        // Update the user object with the updated tasks
        setUser((prevUser) => ({
          ...prevUser,
          tasks: updatedTasks,
        }));
      }
    }
  };

  //https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
  const handleReadAloud = () => {
    const voices = window.speechSynthesis.getVoices() ?? [];
    const voice = voices.find((voice) => voice.name === settings.voice.split("::")[0]);
    const voiceVolume = settings.voiceVolume;
    const taskName = selectedTask.name ? selectedTask.name + ". " : "";
    const taskDescription = selectedTask?.description
      ? selectedTask?.description?.replace(/((?:https?):\/\/[^\s/$.?#].[^\s]*)/gi, "") + ". "
      : ""; // remove links from description
    // Read task date in voice language
    const taskDate = new Intl.DateTimeFormat(voice ? voice.lang : navigator.language, {
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date(selectedTask?.date || ""));

    const taskDeadline = selectedTask?.deadline
      ? `. Task Deadline: ${calculateDateDifference(
          new Date(selectedTask.deadline),
          voice ? voice.lang : navigator.language,
        )}`
      : "";

    const textToRead = `${taskName}${taskDescription}Date: ${taskDate}${taskDeadline}`;

    const utterThis: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(textToRead);

    if (voice) {
      utterThis.voice = voice;
    }

    if (voiceVolume) {
      utterThis.volume = voiceVolume;
    }

    handleCloseMoreMenu();

    const pauseSpeech = () => {
      window.speechSynthesis.pause();
    };

    const resumeSpeech = () => {
      window.speechSynthesis.resume();
    };

    const cancelSpeech = () => {
      window.speechSynthesis.cancel();
      toast.dismiss(SpeechToastId);
      handleCloseMoreMenu();
    };

    const SpeechToastId = toast(
      () => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [isPlaying, setIsPlaying] = useState<boolean>(true);
        return (
          <ReadAloudContainer>
            <ReadAloudHeader translate="yes">
              <RecordVoiceOver /> Read aloud: <span translate="no">{selectedTask?.name}</span>
            </ReadAloudHeader>
            <span translate="yes" style={{ marginTop: "8px", fontSize: "16px" }}>
              Voice: <span translate="no">{utterThis.voice?.name || "Default"}</span>
            </span>
            <div translate="no">
              <Marquee delay={0.6} play={isPlaying}>
                <p style={{ margin: "6px 0" }}>{utterThis.text} &nbsp;</p>
              </Marquee>
            </div>
            <ReadAloudControls>
              {isPlaying ? (
                <IconButton
                  onClick={() => {
                    pauseSpeech();
                    setIsPlaying(!isPlaying);
                  }}
                >
                  <Pause fontSize="large" />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => {
                    resumeSpeech();
                    setIsPlaying(!isPlaying);
                  }}
                >
                  <PlayArrow fontSize="large" />
                </IconButton>
              )}
              <IconButton onClick={cancelSpeech}>
                <Cancel fontSize="large" />
              </IconButton>
            </ReadAloudControls>
          </ReadAloudContainer>
        );
      },
      {
        duration: Infinity,
        style: {
          border: `1px solid ${theme.darkmode ? "#1b1d4eb7" : "#ededf7b0"} `,
          WebkitBackdropFilter: `blur(${theme.darkmode ? "10" : "14"}px)`,
          backdropFilter: `blur(${theme.darkmode ? "10" : "14"}px)`,
        },
      },
    );

    // Set up event listener for the end of speech
    utterThis.onend = () => {
      // Close the menu
      handleCloseMoreMenu();
      // Hide the toast when speech ends
      toast.dismiss(SpeechToastId);
    };

    if (voiceVolume > 0) {
      window.speechSynthesis.speak(utterThis);
    }
  };

  const menuItems: JSX.Element[] = [
    <StyledMenuItem key="done" onClick={handleMarkAsDone}>
      {selectedTask.done ? <Close /> : <Done />}
      &nbsp; {selectedTask.done ? "Mark as not done" : "Mark as done"}
    </StyledMenuItem>,

    <StyledMenuItem key="pin" onClick={handlePin}>
      <PushPinRounded sx={{ textDecoration: "line-through" }} />
      &nbsp; {selectedTask.pinned ? "Unpin" : "Pin"}
    </StyledMenuItem>,

    ...(multipleSelectedTasks.length === 0
      ? [
          <StyledMenuItem
            key="select"
            onClick={() => handleSelectTask(selectedTaskId || generateUUID())}
            disabled={moveMode}
          >
            <RadioButtonChecked /> &nbsp; Select
          </StyledMenuItem>,
        ]
      : []),

    ...(!moveMode
      ? [
          <StyledMenuItem
            key="move"
            disabled={multipleSelectedTasks.length > 0}
            onClick={() => {
              setMoveMode(true);
              setSearch("");
              handleCloseMoreMenu();
              if (user.settings.sortOption !== "custom") {
                showToast("Changed sort option to: Custom", { type: "blank" }); //TODO: add info type
              }
              setUser((prevUser) => ({
                ...prevUser,
                settings: {
                  ...prevUser.settings,
                  sortOption: "custom",
                },
              }));
            }}
          >
            <MoveUpRounded /> &nbsp; Move
          </StyledMenuItem>,
        ]
      : []),

    <StyledMenuItem key="details" onClick={redirectToTaskDetails}>
      <LaunchRounded /> &nbsp; Task details
    </StyledMenuItem>,

    ...(settings.enableReadAloud && "speechSynthesis" in window
      ? [
          <StyledMenuItem
            key="read-aloud"
            onClick={handleReadAloud}
            disabled={
              window.speechSynthesis &&
              (window.speechSynthesis.speaking || window.speechSynthesis.pending)
            }
          >
            <RecordVoiceOverRounded /> &nbsp; Read Aloud
          </StyledMenuItem>,
        ]
      : []),

    <StyledMenuItem
      key="share"
      onClick={() => {
        setShowShareDialog(true);
        handleCloseMoreMenu();
      }}
    >
      <LinkRounded /> &nbsp; Share
    </StyledMenuItem>,

    <Divider key="divider-1" />,

    <StyledMenuItem
      key="edit"
      onClick={() => {
        setEditModalOpen(true);
        handleCloseMoreMenu();
      }}
    >
      <EditRounded /> &nbsp; Edit
    </StyledMenuItem>,

    <StyledMenuItem key="duplicate" onClick={handleDuplicateTask}>
      <ContentCopy /> &nbsp; Duplicate
    </StyledMenuItem>,

    <Divider key="divider-2" />,

    <StyledMenuItem
      key="delete"
      clr={ColorPalette.red}
      onClick={() => {
        handleDeleteTask();
        handleCloseMoreMenu();
      }}
    >
      <DeleteRounded /> &nbsp; Delete
    </StyledMenuItem>,
  ];

  const sheet = (
    <BottomSheet
      open={prefersReducedMotion ? true : Boolean(anchorEl)}
      onDismiss={handleCloseMoreMenu}
      snapPoints={({ minHeight, maxHeight }) => [minHeight, maxHeight]}
      expandOnContentDrag
      header={
        <div
          style={{
            textAlign: "left",
            backdropFilter: "blur(8px)",
          }}
        >
          <TaskItem task={selectedTask} features={{ enableGlow: false }} />
          <Divider sx={{ mt: "20px", mb: "-20px" }} />
        </div>
      }
    >
      <SheetContent>{menuItems}</SheetContent>
      <div style={{ marginBottom: "48px" }} />
    </BottomSheet>
  );

  return (
    <>
      {/* close sheet instantly if motion is reduced */}
      {isMobile && (prefersReducedMotion ? Boolean(anchorEl) && sheet : sheet)}

      {!isMobile && (
        <Menu
          id="task-menu"
          anchorEl={anchorEl}
          anchorPosition={anchorPosition ? anchorPosition : undefined}
          anchorReference={anchorPosition ? "anchorPosition" : undefined}
          open={Boolean(anchorEl)}
          onClose={handleCloseMoreMenu}
          sx={{
            "& .MuiPaper-root": {
              borderRadius: "18px",
              minWidth: "200px",
              boxShadow: "none",
              padding: "6px 4px",
            },
          }}
          slotProps={{
            list: {
              "aria-labelledby": "more-button",
            },
          }}
        >
          {menuItems}
        </Menu>
      )}
      <ShareDialog
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        selectedTask={selectedTask}
      />
    </>
  );
};

const SheetContent = styled.div`
  color: ${({ theme }) => (theme.darkmode ? ColorPalette.fontLight : ColorPalette.fontDark)};
  margin: 20px 10px;
  & .MuiMenuItem-root {
    font-size: 16px;
    padding: 16px;
    &::before {
      content: "";
      display: inline-block;
      margin-right: 10px;
    }
  }
`;
const StyledMenuItem = styled(MenuItem)<{ clr?: string }>`
  margin: 0 6px;
  padding: 10px;
  border-radius: 12px;
  box-shadow: none;
  gap: 2px;
  color: ${({ clr }) => clr || "unset"};
`;

const ReadAloudContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const ReadAloudHeader = styled.div`
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  gap: 6px;
`;

const ReadAloudControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  gap: 8px;
`;
