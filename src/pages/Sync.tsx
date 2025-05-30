import { useState, useContext } from "react";
import QRCode from "react-qr-code";
import Peer, { DataConnection } from "peerjs";
import {
  Button,
  CircularProgress,
  Typography,
  Container,
  Stack,
  Alert,
  AlertTitle,
} from "@mui/material";
import QRCodeScannerDialog from "../components/QRCodeScannerDialog";
import { UserContext } from "../contexts/UserContext";
import { TopBar } from "../components";
import styled from "@emotion/styled";
import {
  QrCodeScannerRounded,
  CloudSyncRounded,
  QrCodeRounded,
  AccessTimeRounded,
  RestartAltRounded,
} from "@mui/icons-material";
import { getFontColor, showToast, timeAgo } from "../utils";
import {
  prepareSyncData,
  compressSyncData,
  decompressSyncData,
  mergeSyncData,
} from "../utils/syncUtils";

type SyncStatus = {
  message: string;
  severity: "info" | "success" | "error" | "warning";
};

//TODO: add categories and settings to sync data

export default function Sync() {
  const { user, setUser } = useContext(UserContext);

  const [mode, setMode] = useState<"display" | "scan" | null>(null);
  const [hostPeerId, setHostPeerId] = useState<string>("");
  const [peer, setPeer] = useState<Peer | null>(null);
  const [conn, setConn] = useState<DataConnection | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    message: "",
    severity: "info",
  });

  const setStatus = (message: string, severity: SyncStatus["severity"] = "info") => {
    setSyncStatus({ message, severity });
  };

  // HOST SETUP
  const startHost = () => {
    setStatus("Starting Peer...");
    const p = new Peer();

    p.on("open", (id) => {
      setHostPeerId(id);
      setStatus("Waiting for device to connect...", "info");
    });

    p.on("connection", (connection) => {
      setConn(connection);
      setStatus("Device connected, exchanging data...", "info");

      connection.on("data", (rawData) => {
        try {
          const receivedData = decompressSyncData(rawData as string);
          if (!receivedData) {
            throw new Error("Failed to decompress received data");
          }

          setStatus("Received device data, merging tasks...");

          // merge task data from both devices
          const { tasks, deletedTasks, lastSyncedAt } = mergeSyncData(
            user.tasks,
            user.deletedTasks,
            receivedData,
          );

          setUser((prevUser) => ({
            ...prevUser,
            tasks,
            deletedTasks,
            lastSyncedAt,
          }));

          // send back the merged data to guest
          const mergedSyncData = prepareSyncData(tasks, deletedTasks);
          const compressedData = compressSyncData(mergedSyncData);
          connection.send(compressedData);

          // clear deletedTasks after successful sync since they're no longer needed
          setTimeout(() => {
            setUser((prevUser) => ({
              ...prevUser,
              deletedTasks: [],
            }));
          }, 1000);

          setStatus("Tasks synchronized successfully!", "success");
          showToast("Tasks synchronized successfully!");
        } catch (err) {
          console.warn("Failed to process incoming data:", err);
          showToast("Failed to sync tasks", { type: "error" });
        }
      });

      connection.on("close", () => {
        setStatus("Connection closed.", "warning");
        resetAll();
      });

      connection.on("error", (err) => {
        console.error("Connection error:", err);
        setStatus("Connection error.", "error");
      });
    });

    p.on("error", (err) => {
      console.error("Peer error:", err);
      setStatus("Peer error.");
    });

    setPeer(p);
  };

  // SCAN SETUP:
  const connectToHost = (hostId: string) => {
    setStatus("Starting Peer...");
    const p = new Peer();
    setPeer(p);

    p.on("open", () => {
      setStatus("Connecting to host...");
      const connection = p.connect(hostId);

      connection.on("open", () => {
        setConn(connection);
        setStatus("Connected, sending your task data...");

        // send initial sync data
        const syncData = prepareSyncData(user.tasks, user.deletedTasks);
        const compressedData = compressSyncData(syncData);
        connection.send(compressedData);

        connection.on("data", (rawData) => {
          try {
            const receivedData = decompressSyncData(rawData as string);
            if (!receivedData) {
              throw new Error("Failed to decompress received data");
            }

            // use the final merged data from host
            const { tasks, deletedTasks, lastSyncedAt } = mergeSyncData(
              user.tasks,
              user.deletedTasks,
              receivedData,
            );

            setUser((prevUser) => ({
              ...prevUser,
              tasks,
              deletedTasks,
              lastSyncedAt,
            }));

            setTimeout(() => {
              setUser((prevUser) => ({
                ...prevUser,
                deletedTasks: [],
              }));
            }, 1000);

            setStatus("Tasks synchronized successfully!", "success");
            showToast("Tasks synchronized successfully!");
          } catch (err) {
            console.warn("Failed to process host data:", err);
            showToast("Failed to sync tasks", { type: "error" });
          }
        });

        connection.on("close", () => {
          setStatus("Connection closed.");
          resetAll();
        });

        connection.on("error", (err) => {
          console.error("Connection error:", err);
          setStatus("Connection error.");
        });
      });

      connection.on("error", (err) => {
        console.error("Connection error:", err);
        setStatus("Connection error.");
      });
    });

    p.on("error", (err) => {
      console.error("Peer error:", err);
      setStatus("Peer error.");
    });
  };

  const handleScan = (text: string | null) => {
    if (!text) return;
    setScannerOpen(false);
    try {
      const scannedId = text.trim();
      setMode("scan");
      connectToHost(scannedId);
    } catch (err) {
      showToast("Invalid QR code", { type: "error" });
      console.error("Error scaning QR Code:", err);
    }
  };

  const resetAll = () => {
    conn?.close();
    peer?.destroy();
    setConn(null);
    setPeer(null);
    setHostPeerId("");
    setStatus("");
    setMode(null);
  };

  // const handleCopyPeerId = async (): Promise<void> => {
  //   try {
  //     await navigator.clipboard.writeText(hostPeerId);
  //     showToast("Copied Peer ID to clipboard.", {
  //       preventDuplicate: true,
  //       id: "copy-sharable-link",
  //       visibleToasts: toasts,
  //     });
  //   } catch (error) {
  //     console.error("Error copying id to clipboard:", error);
  //     showToast("Error copying id to clipboard", { type: "error" });
  //   }
  // };

  return (
    <>
      <TopBar title="Sync Tasks" />
      <MainContainer>
        {!mode && (
          <>
            <FeatureDescription>
              <CloudSyncRounded
                sx={{ fontSize: 40, color: (theme) => theme.palette.primary.main }}
              />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Sync Tasks Between Devices
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                Securely transfer your tasks between devices with a QR Code scan using peer-to-peer
                connection. No data is stored on external servers.
              </Typography>
              {user.lastSyncedAt && (
                <LastSyncedText>
                  <AccessTimeRounded /> &nbsp; Last synced {timeAgo(new Date(user.lastSyncedAt))}
                </LastSyncedText>
              )}
            </FeatureDescription>
            <ModeSelectionContainer>
              <SyncButton
                variant="contained"
                onClick={() => {
                  setMode("display");
                  startHost();
                }}
                startIcon={<QrCodeRounded />}
              >
                Display QR Code
              </SyncButton>
              <SyncButton
                variant="outlined"
                onClick={() => {
                  setScannerOpen(true);
                }}
                startIcon={<QrCodeScannerRounded />}
              >
                Scan QR Code
              </SyncButton>
            </ModeSelectionContainer>
          </>
        )}

        {mode === "display" && (
          <StyledPaper>
            <ModeHeader>Host Mode</ModeHeader>
            {hostPeerId ? (
              <Stack spacing={2} alignItems="center">
                {syncStatus.severity !== "success" && (
                  <>
                    <QRCodeWrapper>
                      <QRCode value={hostPeerId} size={300} />
                    </QRCodeWrapper>

                    <QRCodeLabel>Scan this QR code with another device to sync tasks</QRCodeLabel>

                    {/* <ShareField
                      value={hostPeerId}
                      variant="outlined"
                      label="Your Peer ID"
                      slotProps={{
                        input: {
                          readOnly: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button
                                onClick={handleCopyPeerId}
                                sx={{ p: "12px", borderRadius: "14px", mr: "4px" }}
                              >
                                <ContentCopyRounded /> &nbsp; Copy
                              </Button>
                            </InputAdornment>
                          ),
                        },
                      }}
                    /> */}
                  </>
                )}

                <StyledAlert severity={syncStatus.severity}>
                  <AlertTitle>
                    {syncStatus.severity === "success"
                      ? "Sync Complete"
                      : syncStatus.severity === "error"
                        ? "Error"
                        : "Status"}
                  </AlertTitle>
                  {syncStatus.message || "Idle"}
                </StyledAlert>

                {/* <FormControl>
                  <FormLabel id="sync-row-radio-buttons-group-label">
                    Sync App Settings & Other Data
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="sync-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel value="this_device" control={<Radio />} label="This Device" />
                    <FormControlLabel
                      value="other_device"
                      control={<Radio />}
                      label="Other Device"
                    />
                    <FormControlLabel value="no_sync" control={<Radio />} label="Don't Sync" />
                  </RadioGroup>
                </FormControl> */}

                <SyncButton
                  variant="outlined"
                  onClick={resetAll}
                  color={syncStatus.severity === "success" ? "success" : "primary"}
                >
                  {syncStatus.severity === "success" ? (
                    "Done"
                  ) : (
                    <>
                      <RestartAltRounded /> &nbsp; Reset
                    </>
                  )}
                </SyncButton>
              </Stack>
            ) : (
              <LoadingContainer>
                <CircularProgress size={24} />
                <Typography>Initializing...</Typography>
              </LoadingContainer>
            )}
          </StyledPaper>
        )}

        {mode === "scan" && (
          <StyledPaper>
            <ModeHeader>Scan Mode</ModeHeader>
            <Stack spacing={3} alignItems="center">
              <StyledAlert severity={syncStatus.severity}>
                <AlertTitle>
                  {syncStatus.severity === "success"
                    ? "Sync Complete"
                    : syncStatus.severity === "error"
                      ? "Error"
                      : "Status"}
                </AlertTitle>
                {syncStatus.message || "Idle"}
              </StyledAlert>

              {(syncStatus.message === "Connecting to host..." ||
                syncStatus.message === "Connected, sending your task data...") && (
                <LoadingContainer>
                  <CircularProgress size={24} />
                  <Typography>Connecting to host...</Typography>
                </LoadingContainer>
              )}

              <SyncButton
                variant="outlined"
                onClick={resetAll}
                color={
                  syncStatus.severity === "success"
                    ? "success"
                    : syncStatus.severity === "error"
                      ? "error"
                      : "primary"
                }
              >
                {syncStatus.severity === "success" ? (
                  "Done"
                ) : syncStatus.severity === "error" ? (
                  "Try Again"
                ) : (
                  <>
                    <RestartAltRounded /> &nbsp; Reset
                  </>
                )}
              </SyncButton>
            </Stack>
          </StyledPaper>
        )}

        <QRCodeScannerDialog
          subTitle="Scan a QR code on another device to sync"
          open={scannerOpen}
          onClose={() => setScannerOpen(false)}
          onScan={(result) => {
            if (result && result[0]?.rawValue) handleScan(result[0].rawValue);
          }}
          onError={(err) => {
            console.error("QR scan error:", err);
            showToast("Error scanning QR.", { type: "error" });
            setScannerOpen(false);
          }}
        />
      </MainContainer>
    </>
  );
}

const MainContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  padding: 20px;
  max-width: 600px !important;
`;

const FeatureDescription = styled.div`
  text-align: center;
  margin-bottom: 16px;
`;

const ModeHeader = styled.h5`
  color: ${({ theme }) => (theme.darkmode ? "#ffffff" : "#000000")};
  font-weight: 600;
  font-size: 1.4rem;
  text-align: center;
  margin: 0;
  margin-bottom: 18px;
`;

const LastSyncedText = styled(Typography)`
  color: ${({ theme }) => getFontColor(theme.secondary)};
  opacity: 0.9;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModeSelectionContainer = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
`;

const StyledPaper = styled.div`
  padding: 24px;
  border-radius: 24px;
  background: ${({ theme }) => (theme.darkmode ? "#1f1f1f" : "#ffffff")};
  width: 100%;
  text-align: center;
`;

const QRCodeWrapper = styled.div`
  background: white;
  padding: 12px;
  border-radius: 12px;
  display: inline-block;
`;

const QRCodeLabel = styled(Typography)`
  font-weight: 600;
  max-width: 310px;
  margin: 0;
  color: ${({ theme }) => (theme.darkmode ? "#ffffff" : "#000000")};
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin: 20px 0;
`;

const SyncButton = styled(Button)`
  padding: 12px 24px;
  border-radius: 14px;
  font-weight: 600;
  min-width: 180px;
`;

const StyledAlert = styled(Alert)`
  width: 100%;
  max-width: 400px;
  text-align: left;
  & .MuiAlert-message {
    width: 100%;
  }
  @media (max-width: 768px) {
    max-width: 350px;
  }
`;

// const ShareField = styled(TextField)`
//   margin-top: 22px;

//   .MuiOutlinedInput-root {
//     width: 336px;
//     border-radius: 14px;
//     padding: 2px;
//     transition: 0.3s all;
//   }
// `;
