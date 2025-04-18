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
  TabProps,
  Tabs,
  TextField,
} from "@mui/material";
import { CustomDialogTitle } from "../DialogTitle";
import {
  Apple,
  CalendarTodayRounded,
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
import LZString from "lz-string";
import { TabGroupProvider, TabPanel } from "..";

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

  const tabs: { label: string; icon: React.ReactElement; disabled?: boolean }[] = [
    { label: "Link", icon: <LinkRounded /> },
    { label: "QR Code", icon: <QrCode2Rounded /> },
    ...(systemInfo.isAppleDevice ? [{ label: "Calendar", icon: <CalendarTodayRounded /> }] : []),
  ];

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

      // Compress the task JSON
      const compressedTask = LZString.compressToEncodedURIComponent(JSON.stringify(taskToShare));
      const encodedUserName = encodeURIComponent(userName);

      return `${window.location.href}share?task=${compressedTask}&userName=${encodedUserName}`;
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

  const formatICSDate = (date: Date) => date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const handleAddToAppleCalendar = () => {
    if (!selectedTask) return;

    const deadline = formatICSDate(
      selectedTask.deadline ? new Date(selectedTask.deadline) : new Date(),
    );

    let { description = "" } = selectedTask;
    const urlMatch = description.match(/(https?:\/\/[^\s]+)/);
    const eventUrl = urlMatch?.[0] || ""; // extract the first url from description
    description = description.replace(urlMatch?.[0] || "", "").trim();

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `SUMMARY:${selectedTask.name}`,
      `DESCRIPTION:${description}`,
      `DTSTART:${deadline}`,
      `DTEND:${deadline}`,
      eventUrl ? `URL:${eventUrl}` : "",
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .filter(Boolean) // remove empty lines
      .join("\n");

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "event.ics";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          style: {
            borderRadius: "28px",
            padding: "10px",
            width: "560px",
          },
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
          {tabs.map((tab) => (
            <StyledTab
              key={tab.label}
              label={tab.label}
              icon={tab.icon}
              disabled={tab.disabled}
              totaltabs={tabs.length}
            />
          ))}
        </Tabs>
        <TabGroupProvider name="share">
          <TabPanel value={shareTabVal} index={0}>
            <ShareField
              value={generateShareableLink(selectedTaskId, name || "User")}
              fullWidth
              variant="outlined"
              label="Shareable Link"
              slotProps={{
                input: {
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
                },
              }}
            />
          </TabPanel>
          <TabPanel value={shareTabVal} index={1}>
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
          </TabPanel>
          {systemInfo.isAppleDevice && (
            <TabPanel value={shareTabVal} index={2}>
              <Box
                sx={{
                  mt: "22px",
                  display: "flex",
                  justigyContent: "center",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Button variant="contained" color="inherit" onClick={handleAddToAppleCalendar}>
                  <Apple /> &nbsp; Add to Apple Calendar
                </Button>
              </Box>
            </TabPanel>
          )}
        </TabGroupProvider>
        {shareTabVal !== 2 && (
          <Alert severity="info" sx={{ mt: "20px" }}>
            <AlertTitle>Share Your Task</AlertTitle>
            Copy the link to share manually or use the share button to send it via other apps.
          </Alert>
        )}
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

const UnstyledTab = ({ ...props }: TabProps) => <Tab iconPosition="start" {...props} />;

const StyledTab = styled(UnstyledTab)<{ totaltabs: number }>`
  border-radius: 12px 12px 0 0;
  flex: 1 1 calc(100% / ${(props) => props.totaltabs});
  max-width: calc(100% / ${(props) => props.totaltabs});
`;

const ShareField = styled(TextField)`
  margin-top: 22px;
  .MuiOutlinedInput-root {
    border-radius: 14px;
    padding: 2px;
    transition: 0.3s all;
  }
`;
