import {
  ContentCopy,
  DeleteRounded,
  Done,
  EditRounded,
  IosShare,
  LaunchRounded,
  LinkRounded,
  PushPinRounded,
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

//TODO: Move all functions to TasksMenu component

interface TaskMenuProps {
  selectedTaskId: number | null;
  setEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  anchorEl: null | HTMLElement;
  handleMarkAsDone: () => void;
  handlePin: () => void;
  handleDeleteTask: () => void;
  handleDuplicateTask: () => void;
  handleCloseMoreMenu: () => void;
  handleReadAloud: () => void;
}

export const TaskMenu = ({
  selectedTaskId,
  setEditModalOpen,
  anchorEl,
  handleMarkAsDone,
  handlePin,
  handleDeleteTask,
  handleDuplicateTask,
  handleCloseMoreMenu,
  handleReadAloud,
}: TaskMenuProps) => {
  const { user } = useContext(UserContext);
  const [showShareDialog, setShowShareDialog] = useState<boolean>(false);
  const n = useNavigate();

  const redirectToTaskDetails = () => {
    const selectedTask = user.tasks.find((task) => task.id === selectedTaskId);
    const taskId = selectedTask?.id.toString().replace(".", "");
    n(`/task/${taskId}`);
  };
  //TODO: make links shorter
  const generateShareableLink = (taskId: number | null, userName: string) => {
    const task = user.tasks.find((task) => task.id === taskId);
    if (task) {
      const encodedTask = encodeURIComponent(JSON.stringify(task));
      const encodedUserName = encodeURIComponent(userName);
      return `${window.location.href}share?task=${encodedTask}&userName=${encodedUserName}`;
    }
    return "";
  };
  const handleCopyToClipboard = () => {
    const linkToCopy = generateShareableLink(selectedTaskId, user.name || "User");

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
    const linkToShare = generateShareableLink(selectedTaskId, user.name || "User");
    if (navigator.share) {
      navigator
        .share({
          title: "Share Task",
          text: `Check out this task: ${
            user.tasks.find((task) => task.id === selectedTaskId)?.name
          }`,
          url: linkToShare,
        })
        .then(() => {
          console.log("Link shared successfully");
        })
        .catch((error) => {
          console.error("Error sharing link:", error);
          toast.error("Error sharing link");
        });
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
        {user.tasks.find((task) => task.id === selectedTaskId)?.done
          ? "Mark as not done"
          : "Mark as done"}
      </StyledMenuItem>
      <StyledMenuItem
        onClick={() => {
          handleCloseMoreMenu();
          handlePin();
        }}
      >
        <PushPinRounded /> &nbsp;{" "}
        {user.tasks.find((task) => task.id === selectedTaskId)?.pinned ? "Unpin" : "Pin"}
      </StyledMenuItem>
      <StyledMenuItem onClick={redirectToTaskDetails}>
        <LaunchRounded /> &nbsp; Task details
      </StyledMenuItem>
      {user.settings[0].enableReadAloud && (
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
          // const shareableLink = generateShareableLink(selectedTaskId, user.name || "User");
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
  const isMobile = useResponsiveDisplay();

  const [shareTabVal, setShareTabVal] = useState<number>(0);
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
                emojiStyle={user.emojisStyle}
                size={32}
                unified={user.tasks.find((task) => task.id === selectedTaskId)?.emoji || ""}
              />{" "}
              {user.emojisStyle === EmojiStyle.NATIVE && "\u00A0 "}
              {user.tasks.find((task) => task.id === selectedTaskId)?.name}
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
            width: "600px !important",
          },
        }}
      >
        <DialogTitle>Share Task</DialogTitle>
        <DialogContent>
          <span>
            Share Task <b>{user.tasks.find((task) => task.id === selectedTaskId)?.name}</b>
          </span>
          <Tabs value={shareTabVal} onChange={handleTabChange} sx={{ m: "8px 0" }}>
            <StyledTab label="Link" />
            <StyledTab label="QR Code" />
          </Tabs>
          <CustomTabPanel value={shareTabVal} index={0}>
            <ShareField
              value={generateShareableLink(selectedTaskId, user.name || "User")}
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
                margin: "8px 0",
              }}
            >
              <QRCode
                value={generateShareableLink(selectedTaskId, user.name || "User")}
                size={300}
              />
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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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
  border-radius: 8px;
`;
