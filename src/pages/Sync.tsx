import { useState, useContext, useEffect } from "react";
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
  Tooltip,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
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
import { useResponsiveDisplay } from "../hooks/useResponsiveDisplay";

type SyncStatus = {
  message: string;
  severity: "info" | "success" | "error" | "warning";
};

//TODO: add settings (excluding appBadge, voice, voiceVolume) and other data () to sync data

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

  const isMobile = useResponsiveDisplay();

  useEffect(() => {
    document.title = "Todo App - Sync Data";
  }, []);

  const setStatus = (message: string, severity: SyncStatus["severity"] = "info") => {
    setSyncStatus({ message, severity });
  };

  // HOST SETUP
  const startHost = () => {
    setStatus("Starting Peer...");
    const p = new Peer();

    p.on("open", (id) => {
      setHostPeerId(id);
      setStatus("Waiting for device to connect...");
    });

    p.on("connection", (connection) => {
      setConn(connection);
      setStatus("Device connected, exchanging data...");

      connection.on("data", (rawData) => {
        try {
          const receivedData = decompressSyncData(rawData as string);
          if (!receivedData) {
            throw new Error("Failed to decompress received data");
          }

          setStatus("Received device data, merging data...");

          // merge all data from both devices
          const compressedDataForMerge = compressSyncData(receivedData);
          const mergedData = mergeSyncData(
            user.tasks,
            user.deletedTasks,
            user.categories,
            user.deletedCategories,
            user.favoriteCategories,
            compressedDataForMerge,
          );

          setUser((prevUser) => ({
            ...prevUser,
            tasks: mergedData.tasks,
            deletedTasks: mergedData.deletedTasks,
            categories: mergedData.categories,
            deletedCategories: mergedData.deletedCategories,
            favoriteCategories: mergedData.favoriteCategories,
            lastSyncedAt: new Date(),
          }));

          // send back the merged data to guest
          const mergedSyncData = prepareSyncData(
            mergedData.tasks,
            mergedData.deletedTasks,
            mergedData.categories,
            mergedData.deletedCategories,
            mergedData.favoriteCategories,
          );
          const compressedData = compressSyncData(mergedSyncData);
          connection.send(compressedData);

          // clear deleted items after successful sync since they're no longer needed
          setTimeout(() => {
            setUser((prevUser) => ({
              ...prevUser,
              deletedTasks: [],
              deletedCategories: [],
            }));
          }, 1000);

          setStatus("Data synchronized successfully!", "success");
          showToast("Data synchronized successfully!");
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
      setStatus("Peer error.", "error");
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
        setStatus("Connected, sending your data...");

        // send initial sync data
        const syncData = prepareSyncData(
          user.tasks,
          user.deletedTasks,
          user.categories,
          user.deletedCategories,
          user.favoriteCategories,
        );
        const compressedData = compressSyncData(syncData);
        connection.send(compressedData);

        connection.on("data", (rawData) => {
          try {
            const receivedData = decompressSyncData(rawData as string);
            if (!receivedData) {
              throw new Error("Failed to decompress received data");
            }

            // use the final merged data from host
            const compressedDataForMerge = compressSyncData(receivedData);
            const mergedData = mergeSyncData(
              user.tasks,
              user.deletedTasks,
              user.categories,
              user.deletedCategories,
              user.favoriteCategories,
              compressedDataForMerge,
            );

            setUser((prevUser) => ({
              ...prevUser,
              tasks: mergedData.tasks,
              deletedTasks: mergedData.deletedTasks,
              categories: mergedData.categories,
              deletedCategories: mergedData.deletedCategories,
              favoriteCategories: mergedData.favoriteCategories,
              lastSyncedAt: new Date(),
            }));

            // clear deleted items after successful sync
            setTimeout(() => {
              setUser((prevUser) => ({
                ...prevUser,
                deletedTasks: [],
                deletedCategories: [],
              }));
            }, 1000);

            setStatus("Data synchronized successfully!", "success");
            showToast("Data synchronized successfully!");
          } catch (err) {
            console.warn("Failed to process host data:", err);
            showToast("Failed to sync data", { type: "error" });
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
      setStatus("Peer error.", "error");
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
      showToast("Failed to scan QR Code", { type: "error" });
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

  return (
    <>
      <TopBar title="Sync Data" />
      <MainContainer>
        {!mode && (
          <>
            <FeatureDescription>
              <CloudSyncRounded
                sx={{ fontSize: 40, color: (theme) => theme.palette.primary.main }}
              />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Sync Data Between Devices
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                Securely transfer your tasks and categories between devices with a QR Code scan
                using peer-to-peer connection. No data is stored on external servers.
              </Typography>
              {user.lastSyncedAt && (
                <Tooltip
                  title={new Intl.DateTimeFormat(navigator.language, {
                    dateStyle: "long",
                    timeStyle: "medium",
                  }).format(new Date(user.lastSyncedAt))}
                  placement="top"
                >
                  <LastSyncedText>
                    <AccessTimeRounded /> &nbsp; Last synced {timeAgo(new Date(user.lastSyncedAt))}
                  </LastSyncedText>
                </Tooltip>
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
                    <QRCodeLabel>Scan this QR code with another device to sync data</QRCodeLabel>
                    <FormControl>
                      <StyledFormLabel id="sync-radio-buttons-group-label">
                        Sync App Settings & Other Data
                      </StyledFormLabel>
                      <RadioGroup
                        row={!isMobile}
                        aria-labelledby="sync-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                      >
                        <StyledFormControlLabel
                          value="this_device"
                          control={<Radio />}
                          label="This Device"
                        />
                        <StyledFormControlLabel
                          value="other_device"
                          control={<Radio />}
                          label="Other Device"
                        />
                        <StyledFormControlLabel
                          value="no_sync"
                          control={<Radio />}
                          label="Don't Sync"
                        />
                      </RadioGroup>
                    </FormControl>
                    <Typography sx={{ opacity: 0.8 }}>
                      Tasks and categories will be synced automatically.
                    </Typography>
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
                <LoadingText>Initializing...</LoadingText>
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
                syncStatus.message === "Connected, sending your data...") && (
                <LoadingContainer>
                  <CircularProgress size={24} />
                  <LoadingText>Connecting to host...</LoadingText>
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

const LoadingText = styled(Typography)`
  color: ${({ theme }) => (theme.darkmode ? "#ffffff" : "#000000")};
`;

const StyledFormLabel = styled(FormLabel)`
  color: ${({ theme }) => (theme.darkmode ? "#ffffff" : "#000000")};
  opacity: 0.8;
  &.Mui-focused {
    color: ${({ theme }) => (theme.darkmode ? "#ffffff" : "#000000")};
  }
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  color: ${({ theme }) => (theme.darkmode ? "#ffffff" : "#000000")};
`;
