import {
  Cancel,
  ContentCopy,
  DeleteRounded,
  Done,
  EditRounded,
  IosShare,
  LaunchRounded,
  LinkRounded,
  Pause,
  PlayArrow,
  PushPinRounded,
  QrCode2Rounded,
  RadioButtonChecked,
  RecordVoiceOver,
  RecordVoiceOverRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { BottomSheet } from "react-spring-bottom-sheet";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import styled from "@emotion/styled";
import "react-spring-bottom-sheet/dist/style.css";
import { useResponsiveDisplay } from "../hooks/useResponsiveDisplay";
import { ColorPalette, DialogBtn } from "../styles";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../contexts/UserContext";
import QRCode from "react-qr-code";
import { Task } from "../types/user";
import { calculateDateDifference, formatDate } from "../utils";
import Marquee from "react-fast-marquee";

//TODO: Move all functions to TasksMenu component

interface TaskMenuProps {
  selectedTaskId: number | null;
  selectedTasks: number[];
  setEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  anchorEl: null | HTMLElement;
  handleDeleteTask: () => void;
  handleCloseMoreMenu: () => void;
  handleSelectTask: (taskId: number) => void;
}

export const TaskMenu: React.FC<TaskMenuProps> = ({
  selectedTaskId,
  selectedTasks,
  setEditModalOpen,
  anchorEl,
  handleDeleteTask,
  handleCloseMoreMenu,
  handleSelectTask,
}) => {
  const { user, setUser } = useContext(UserContext);
  const { tasks, name, settings, emojisStyle } = user;
  const [showShareDialog, setShowShareDialog] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [shareTabVal, setShareTabVal] = useState<number>(0);
  const isMobile = useResponsiveDisplay();
  const n = useNavigate();

  const redirectToTaskDetails = () => {
    const selectedTask = tasks.find((task) => task.id === selectedTaskId);
    const taskId = selectedTask?.id.toString().replace(".", "");
    n(`/task/${taskId}`);
  };
  //TODO: add bitly api
  const generateShareableLink = (taskId: number | null, userName: string): string => {
    const task = tasks.find((task) => task.id === taskId);
    if (task) {
      const encodedTask = encodeURIComponent(JSON.stringify(task));
      const encodedUserName = encodeURIComponent(userName);
      return `${window.location.href}share?task=${encodedTask}&userName=${encodedUserName}`;
    }
    return "";
  };

  const handleCopyToClipboard = () => {
    const linkToCopy = generateShareableLink(selectedTaskId, name || "User");

    navigator.clipboard
      .writeText(linkToCopy)
      .then(() => {
        toast.success((t) => (
          <div onClick={() => toast.dismiss(t.id)}>Copied link to clipboard</div>
        ));
      })

      .catch((error) => {
        console.error("Error copying link to clipboard:", error);
        toast.error("Error copying link to clipboard");
      });
  };

  const handleShare = () => {
    const linkToShare = generateShareableLink(selectedTaskId, name || "User");
    if (navigator.share) {
      navigator
        .share({
          title: "Share Task",
          text: `Check out this task: ${tasks.find((task) => task.id === selectedTaskId)?.name}`,
          url: linkToShare,
        })
        .then(() => {
          console.log("Link shared successfully");
        })
        .catch((error) => {
          console.error("Error sharing link:", error);
          // toast.error("Error sharing link");
        });
    }
  };

  const handleMarkAsDone = () => {
    // Toggles the "done" property of the selected task
    if (selectedTaskId) {
      const updatedTasks = tasks.map((task) => {
        if (task.id === selectedTaskId) {
          return { ...task, done: !task.done };
        }
        return task;
      });
      setUser((prevUser) => ({
        ...prevUser,
        tasks: updatedTasks,
      }));

      const allTasksDone = updatedTasks.every((task) => task.done);

      if (allTasksDone) {
        toast.success(
          (t) => (
            <div onClick={() => toast.dismiss(t.id)}>
              <b>All tasks done</b>
              <br />
              <span>You've checked off all your todos. Well done!</span>
            </div>
          ),
          {
            icon: <Emoji unified="1f60e" emojiStyle={emojisStyle} />,
          }
        );
      }
    }
  };

  const handlePin = () => {
    // Toggles the "pinned" property of the selected task
    if (selectedTaskId) {
      const updatedTasks = tasks.map((task) => {
        if (task.id === selectedTaskId) {
          return { ...task, pinned: !task.pinned };
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
    if (selectedTaskId) {
      // Close the menu
      handleCloseMoreMenu();
      // Find the selected task
      const selectedTask = tasks.find((task) => task.id === selectedTaskId);
      if (selectedTask) {
        // Create a duplicated task with a new ID and current date
        const duplicatedTask: Task = {
          ...selectedTask,
          id: new Date().getTime() + Math.floor(Math.random() * 1000),
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

  const handleReadAloud = () => {
    const selectedTask = tasks.find((task) => task.id === selectedTaskId);
    const voices = window.speechSynthesis.getVoices();
    const voiceName = voices.find((voice) => voice.name === settings[0].voice);
    const voiceVolume = settings[0].voiceVolume;
    const taskName = selectedTask?.name || "";
    const taskDescription = selectedTask?.description || "";
    const taskDate = formatDate(new Date(selectedTask?.date || ""));
    const taskDeadline = selectedTask?.deadline
      ? ". Task Deadline: " + calculateDateDifference(new Date(selectedTask.deadline) || "")
      : "";

    const textToRead = `${taskName}. ${taskDescription}. Date: ${taskDate}${taskDeadline}`;

    const utterThis: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(textToRead);

    if (voiceName) {
      utterThis.voice = voiceName;
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
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              touchAction: "none",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontWeight: 600,
              }}
            >
              <RecordVoiceOver /> &nbsp; Speaking: {selectedTask?.name}
            </span>
            <span style={{ marginTop: "10px", fontSize: "16px" }}>
              Voice: {utterThis.voice?.name || "Default"}
            </span>
            <div>
              <Marquee delay={0.6} play={isPlaying}>
                <p style={{ margin: "6px 0" }}>{utterThis.text} &nbsp;</p>
              </Marquee>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "16px",
                gap: "8px",
              }}
            >
              {isPlaying ? (
                <IconButton
                  sx={{ color: "white" }}
                  onClick={() => {
                    pauseSpeech();
                    setIsPlaying(!isPlaying);
                  }}
                >
                  <Pause fontSize="large" />
                </IconButton>
              ) : (
                <IconButton
                  sx={{ color: "white" }}
                  onClick={() => {
                    resumeSpeech();
                    setIsPlaying(!isPlaying);
                  }}
                >
                  <PlayArrow fontSize="large" />
                </IconButton>
              )}

              <IconButton sx={{ color: "white" }} onClick={cancelSpeech}>
                <Cancel fontSize="large" />
              </IconButton>
            </div>
          </div>
        );
      },
      {
        duration: 999999999,
        style: {
          border: "1px solid #1b1d4eb7",
          WebkitBackdropFilter: "blur(10px)",
          backdropFilter: "blur(10px)",
        },
      }
    );

    // Set up event listener for the end of speech
    utterThis.onend = () => {
      // Close the menu
      handleCloseMoreMenu();
      // Hide the toast when speech ends
      toast.dismiss(SpeechToastId);
    };
    console.log(utterThis);
    if (voiceVolume > 0) {
      window.speechSynthesis.speak(utterThis);
    }
  };

  const menuItems: JSX.Element = (
    <div>
      <StyledMenuItem
        onClick={() => {
          handleCloseMoreMenu();
          handleMarkAsDone();
        }}
      >
        <Done /> &nbsp;{" "}
        {tasks.find((task) => task.id === selectedTaskId)?.done
          ? "Mark as not done"
          : "Mark as done"}
      </StyledMenuItem>
      <StyledMenuItem
        onClick={() => {
          handleCloseMoreMenu();
          handlePin();
        }}
      >
        {/* <Badge
          anchorOrigin={{
            horizontal: "right",
            vertical: "bottom",
          }}
          badgeContent={
            tasks.find((task) => task.id === selectedTaskId)?.pinned ? (
              <Cancel sx={{ mb: "3px", mr: "3px", fontSize: "16px" }} />
            ) : undefined
          }
        > */}
        <PushPinRounded sx={{ textDecoration: "line-through" }} />
        {/* </Badge> */}
        &nbsp; {tasks.find((task) => task.id === selectedTaskId)?.pinned ? "Unpin" : "Pin"}
      </StyledMenuItem>

      {selectedTasks.length === 0 && (
        <StyledMenuItem onClick={() => handleSelectTask(selectedTaskId || 0)}>
          <RadioButtonChecked /> &nbsp; Select
        </StyledMenuItem>
      )}

      <StyledMenuItem onClick={redirectToTaskDetails}>
        <LaunchRounded /> &nbsp; Task details
      </StyledMenuItem>

      {settings[0].enableReadAloud && (
        <StyledMenuItem
          onClick={handleReadAloud}
          disabled={window.speechSynthesis.speaking || window.speechSynthesis.pending}
        >
          <RecordVoiceOverRounded /> &nbsp; Read Aloud
        </StyledMenuItem>
      )}

      <StyledMenuItem
        onClick={() => {
          handleCloseMoreMenu();
          setShowShareDialog(true);
        }}
      >
        <LinkRounded /> &nbsp; Share
      </StyledMenuItem>

      <Divider />
      <StyledMenuItem
        onClick={() => {
          handleCloseMoreMenu();
          setEditModalOpen(true);
        }}
      >
        <EditRounded /> &nbsp; Edit
      </StyledMenuItem>
      <StyledMenuItem onClick={handleDuplicateTask}>
        <ContentCopy /> &nbsp; Duplicate
      </StyledMenuItem>
      <Divider />
      <StyledMenuItem
        clr={ColorPalette.red}
        onClick={() => {
          handleCloseMoreMenu();
          handleDeleteTask();
        }}
      >
        <DeleteRounded /> &nbsp; Delete
      </StyledMenuItem>
    </div>
  );

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setShareTabVal(newValue);
  };
  return (
    <>
      {isMobile ? (
        <BottomSheet
          open={Boolean(anchorEl)}
          onDismiss={handleCloseMoreMenu}
          snapPoints={({ minHeight, maxHeight }) => [minHeight, maxHeight]}
          expandOnContentDrag
          header={
            <SheetHeader>
              <Emoji
                emojiStyle={emojisStyle}
                size={32}
                unified={tasks.find((task) => task.id === selectedTaskId)?.emoji || ""}
              />{" "}
              {emojisStyle === EmojiStyle.NATIVE && "\u00A0 "}
              {tasks.find((task) => task.id === selectedTaskId)?.name}
            </SheetHeader>
          }
        >
          <SheetContent>{menuItems}</SheetContent>
        </BottomSheet>
      ) : (
        <Menu
          id="task-menu"
          anchorEl={anchorEl}
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
          MenuListProps={{
            "aria-labelledby": "more-button",
          }}
        >
          {menuItems}
        </Menu>
      )}
      <Dialog
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        PaperProps={{
          style: {
            borderRadius: "28px",
            padding: "10px",
            width: "560px",
          },
        }}
      >
        <DialogTitle>Share Task</DialogTitle>
        <DialogContent>
          <span>
            Share Task: <b>{tasks.find((task) => task.id === selectedTaskId)?.name}</b>
          </span>
          <Tabs value={shareTabVal} onChange={handleTabChange} sx={{ m: "8px 0" }}>
            <StyledTab label="Link" icon={<LinkRounded />} />
            <StyledTab label="QR Code" icon={<QrCode2Rounded />} />
          </Tabs>
          <CustomTabPanel value={shareTabVal} index={0}>
            <ShareField
              value={generateShareableLink(selectedTaskId, name || "User")}
              fullWidth
              variant="outlined"
              label="Shareable Link"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={() => {
                        handleCopyToClipboard();
                      }}
                      sx={{ padding: "8px 12px", borderRadius: "12px" }}
                    >
                      <ContentCopy /> &nbsp; Copy
                    </Button>
                  </InputAdornment>
                ),
              }}
              sx={{
                mt: 3,
              }}
            />
          </CustomTabPanel>
          <CustomTabPanel value={shareTabVal} index={1}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
                marginTop: "22px",
              }}
            >
              <QRCode value={generateShareableLink(selectedTaskId, name || "User")} size={384} />
            </Box>
          </CustomTabPanel>
        </DialogContent>
        <DialogActions>
          <DialogBtn onClick={() => setShowShareDialog(false)}>Close</DialogBtn>
          <DialogBtn onClick={handleShare}>
            <IosShare sx={{ mb: "4px" }} /> &nbsp; Share
          </DialogBtn>
        </DialogActions>
      </Dialog>
    </>
  );
};
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`share-tabpanel-${index}`}
      aria-labelledby={`share-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
const SheetHeader = styled.h3`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  color: ${ColorPalette.fontDark};
  margin: 10px;
  font-size: 20px;
`;

const SheetContent = styled.div`
  color: ${ColorPalette.fontDark};
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
  padding: 12px;
  border-radius: 12px;
  box-shadow: none;
  gap: 2px;
  color: ${({ clr }) => clr || ColorPalette.fontDark};

  &:hover {
    background-color: #f0f0f0;
  }
`;

const ShareField = styled(TextField)`
  margin-top: 22px;
  .MuiOutlinedInput-root {
    border-radius: 14px;
    transition: 0.3s all;
  }
`;

const StyledTab = styled(Tab)`
  border-radius: 12px 12px 0 0;
  width: 50%;
  .MuiTabs-indicator {
    border-radius: 24px;
  }
`;
StyledTab.defaultProps = {
  iconPosition: "start",
};
