import { useContext, useState } from "react";
import type { Task, UUID } from "../../types/user";
import { UserContext } from "../../contexts/UserContext";
import { saveQRCode, showToast, systemInfo, getFontColor } from "../../utils";
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { CustomDialogTitle } from "../DialogTitle";
import {
  ContentCopyRounded,
  DownloadRounded,
  IosShare,
  LinkRounded,
  QrCode2Rounded,
} from "@mui/icons-material";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { DialogBtn } from "../../styles";
import styled from "@emotion/styled";
import QRCode from "react-qr-code";

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  selectedTaskId: UUID | null;
  selectedTask: Task;
}

export const ShareDialog = ({ open, onClose, selectedTaskId, selectedTask }: ShareDialogProps) => {
  const { user } = useContext(UserContext);
  const { tasks, settings, name, emojisStyle } = user;

  const [shareTabVal, setShareTabVal] = useState<number>(0);

  const generateShareableLink = (taskId: UUID | null, userName: string): string => {
    const task = tasks.find((task) => task.id === taskId);
    // This removes id property from link as a new identifier is generated on the share page.
    interface TaskToShare extends Omit<Task, "id"> {
      id: undefined;
    }

    if (task) {
      const taskToShare: TaskToShare = {
        ...task,
        sharedBy: undefined,
        id: undefined,
        category: settings.enableCategories ? task.category : undefined,
      };
      const encodedTask = encodeURIComponent(JSON.stringify(taskToShare));
      const encodedUserName = encodeURIComponent(userName);
      return `${window.location.href}share?task=${encodedTask}&userName=${encodedUserName}`;
    }
    return "";
  };

  const handleCopyToClipboard = async (): Promise<void> => {
    const linkToCopy = generateShareableLink(selectedTaskId, name || "User");
    try {
      await navigator.clipboard.writeText(linkToCopy);
      showToast("Copied link to clipboard.");
    } catch (error) {
      console.error("Error copying link to clipboard:", error);
      showToast("Error copying link to clipboard", { type: "error" });
    }
  };

  const handleShare = async (): Promise<void> => {
    const linkToShare = generateShareableLink(selectedTaskId, name || "User");
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Share Task",
          text: `Check out this task: ${selectedTask.name}`,
          url: linkToShare,
        });
      } catch (error) {
        console.error("Error sharing link:", error);
        showToast("Error sharing link", { type: "error" });
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: "28px",
          padding: "10px",
          width: "560px",
        },
      }}
    >
      <CustomDialogTitle
        title="Share Task"
        subTitle="Share your task with others."
        onClose={onClose}
        icon={<IosShare />}
      />
      <DialogContent>
        <ShareTaskChip
          translate="no"
          label={selectedTask.name}
          clr={selectedTask.color}
          avatar={
            selectedTask.emoji ? (
              <Avatar sx={{ background: "transparent", borderRadius: "0" }}>
                <Emoji
                  unified={selectedTask.emoji || ""}
                  emojiStyle={emojisStyle}
                  size={
                    emojisStyle === EmojiStyle.NATIVE
                      ? systemInfo.os === "iOS" || systemInfo.os === "macOS"
                        ? 24
                        : 18
                      : 24
                  }
                />
              </Avatar>
            ) : undefined
          }
        />
        <Tabs
          value={shareTabVal}
          onChange={(_event, newValue) => setShareTabVal(newValue)}
          sx={{ m: "8px 0" }}
        >
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
              startAdornment: (
                <InputAdornment position="start">
                  <LinkRounded sx={{ ml: "8px" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    onClick={handleCopyToClipboard}
                    sx={{ p: "12px", borderRadius: "14px", mr: "4px" }}
                  >
                    <ContentCopyRounded /> &nbsp; Copy
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </CustomTabPanel>
        <CustomTabPanel value={shareTabVal} index={1}>
          <QRCodeContainer>
            <QRCode
              id="QRCodeShare"
              value={generateShareableLink(selectedTaskId, name || "User")}
              size={400}
            />
          </QRCodeContainer>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DownloadQrCodeBtn
              variant="outlined"
              onClick={() => saveQRCode(selectedTask.name || "")}
            >
              <DownloadRounded /> &nbsp; Download QR Code
            </DownloadQrCodeBtn>
          </Box>
        </CustomTabPanel>
        <Alert severity="info" sx={{ mt: "20px" }}>
          <AlertTitle>Share Your Task</AlertTitle>
          Copy the link to share manually or use the share button to send it via other apps.
        </Alert>
      </DialogContent>
      <DialogActions>
        <DialogBtn onClick={onClose}>Close</DialogBtn>
        <DialogBtn onClick={handleShare}>
          <IosShare sx={{ mb: "4px" }} /> &nbsp; Share
        </DialogBtn>
      </DialogActions>
    </Dialog>
  );
};
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const CustomTabPanel = ({ children, value, index }: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`share-tabpanel-${index}`}
      aria-labelledby={`share-tab-${index}`}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};
const ShareTaskChip = styled(Chip)<{ clr: string }>`
  background: ${({ clr }) => clr};
  color: ${({ clr }) => getFontColor(clr)};
  font-size: 14px;
  padding: 18px 8px;
  border-radius: 50px;
  font-weight: 500;
  margin-left: 6px;
  @media (max-width: 768px) {
    font-size: 16px;
    padding: 20px 10px;
  }
`;

const DownloadQrCodeBtn = styled(Button)`
  padding: 12px 24px;
  border-radius: 14px;
  margin-top: 16px;
  @media (max-width: 520px) {
    margin-top: -2px;
  }
`;

const QRCodeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 22px;
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
const ShareField = styled(TextField)`
  margin-top: 22px;
  .MuiOutlinedInput-root {
    border-radius: 14px;
    padding: 2px;
    transition: 0.3s all;
  }
`;
