import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Peer, { DataConnection } from "peerjs";
import type { User } from "../types/user";
import type { OtherDataSyncOption, SyncMode, SyncStatus } from "../types/sync";
import {
  compressSyncData,
  decompressSyncData,
  extractOtherData,
  mergeSyncData,
  prepareSyncData,
} from "../utils/syncUtils";
import { saveProfilePictureInDB, showToast } from "../utils";
import { UserContext } from "../contexts/UserContext";
import toast from "react-hot-toast";
import { TaskContext } from "../contexts/TaskContext";

// status messages for sync steps
const STATUS: Record<string, SyncStatus> = {
  startingPeer: { message: "Starting Peer...", severity: "info" },
  waitingForDevice: { message: "Waiting for device to connect...", severity: "info" },
  deviceConnected: { message: "Device connected, exchanging data...", severity: "info" },
  receivedData: { message: "Received device data, merging data...", severity: "info" },
  connectingToHost: { message: "Connecting to host...", severity: "info" },
  connectedSending: { message: "Connected, sending your data...", severity: "info" },
  syncSuccess: { message: "Data synchronized successfully!", severity: "success" },
  connectionClosed: { message: "Connection closed.", severity: "warning" },
  connectionError: { message: "Connection error.", severity: "error" },
  peerError: { message: "Peer error.", severity: "error" },
  decompressError: { message: "Failed to decompress received data", severity: "error" },
  syncError: { message: "Failed to sync data", severity: "error" },
};

function mergeUserData(
  prevUser: User,
  mergedData: ReturnType<typeof mergeSyncData>,
  syncOption: OtherDataSyncOption | "other_device",
): User {
  const updatedUser: User = {
    ...prevUser,
    tasks: mergedData.tasks,
    deletedTasks: mergedData.deletedTasks,
    categories: mergedData.categories,
    deletedCategories: mergedData.deletedCategories,
    favoriteCategories: mergedData.favoriteCategories,
  };

  const otherData = mergedData.otherData;

  if (syncOption === "other_device" && otherData) {
    const profilePicture = otherData.profilePicture;
    const profilePictureData = (otherData as { profilePictureData?: string }).profilePictureData;
    // handle saving or deleting profile picture based on new data
    if (profilePicture && profilePicture.startsWith("LOCAL_FILE") && profilePictureData) {
      saveProfilePictureInDB(profilePictureData).then(() => {});
      updatedUser.profilePicture = profilePicture;
    } else {
      // if previous was LOCAL_FILE and new is not delete from IndexedDB
      if (prevUser.profilePicture && prevUser.profilePicture.startsWith("LOCAL_FILE")) {
        import("../utils/profilePictureStorage").then(({ deleteProfilePictureFromDB }) => {
          deleteProfilePictureFromDB();
        });
      }
      updatedUser.profilePicture = profilePicture ?? null;
    }
    // merge remaining otherData fields
    Object.entries(otherData).forEach(([key, value]) => {
      if (
        key !== "tasks" &&
        key !== "deletedTasks" &&
        key !== "categories" &&
        key !== "deletedCategories" &&
        key !== "favoriteCategories" &&
        key !== "profilePicture" &&
        key !== "profilePictureData"
      ) {
        if (key === "settings" && value && typeof value === "object") {
          updatedUser.settings = {
            ...updatedUser.settings,
            ...value,
          };
        } else {
          // @ts-expect-error: dynamic assignment of partial user fields from mergedData.otherData
          updatedUser[key] = value;
        }
      }
    });
  }
  return updatedUser;
}

/**
 * Main hook that handles sync via PeerJS
 */
export function usePeerSync() {
  const { user, setUser } = useContext(UserContext);
  const { updateCategory } = useContext(TaskContext);
  const [mode, setMode] = useState<SyncMode | null>(null);
  const [hostPeerId, setHostPeerId] = useState<string>("");
  const [peer, setPeer] = useState<Peer | null>(null);
  const [conn, setConn] = useState<DataConnection | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({ message: "", severity: "info" });

  const [otherDataSyncOption, setOtherDataSyncOption] =
    useState<OtherDataSyncOption>("this_device");
  const otherDataSyncOptionRef = useRef(otherDataSyncOption);

  const [otherDataSource, setOtherDataSource] = useState<OtherDataSyncOption | null>(null);

  useEffect(() => {
    otherDataSyncOptionRef.current = otherDataSyncOption;
  }, [otherDataSyncOption]);

  const setStatus = useCallback((message: string, severity: SyncStatus["severity"] = "info") => {
    setSyncStatus({ message, severity });
  }, []);

  // reset all sync related state
  const resetAll = useCallback(() => {
    if (conn) conn.close();
    if (peer) peer.destroy();
    setConn(null);
    setPeer(null);
    setHostPeerId("");
    setStatus("", "info");
    setMode(null);
    setOtherDataSyncOption("this_device");
    setOtherDataSource(null);
    toast.dismiss();
  }, [conn, peer, setStatus]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => resetAll(), []);

  // shared handler for incoming data
  const handleIncomingData = useCallback(
    async (
      rawData: string,
      syncOption: OtherDataSyncOption | "other_device",
      sendBack?: (data: string) => void,
    ) => {
      try {
        const receivedData = decompressSyncData(rawData);
        if (!receivedData) throw new Error(STATUS.decompressError.message);
        setStatus(STATUS.receivedData.message, STATUS.receivedData.severity);
        const compressedDataForMerge = compressSyncData(receivedData);
        let localOtherData: Partial<User> | undefined = undefined;
        if (syncOption === "this_device") {
          localOtherData = await extractOtherData(user);
        } else if (syncOption === "other_device" && receivedData.otherData) {
          localOtherData = receivedData.otherData;
        }
        const mergedData = mergeSyncData(
          user.tasks,
          user.deletedTasks,
          user.categories,
          user.deletedCategories,
          user.favoriteCategories,
          compressedDataForMerge,
          syncOption,
          localOtherData,
        );
        setUser((prevUser) => mergeUserData(prevUser, mergedData, syncOption));
        mergedData.categories.forEach((cat) => {
          updateCategory({
            id: cat.id,
            name: cat.name,
            emoji: cat.emoji,
            color: cat.color,
            lastSave: cat.lastSave,
          });
        });

        if (sendBack) {
          const mergedSyncData = {
            ...prepareSyncData(
              mergedData.tasks,
              mergedData.deletedTasks,
              mergedData.categories,
              mergedData.deletedCategories,
              mergedData.favoriteCategories,
              syncOption === "this_device" ? mergedData.otherData : undefined,
            ),
            otherDataSource: syncOption,
          };
          sendBack(compressSyncData(mergedSyncData));
          setOtherDataSource(syncOption);
        } else if (receivedData.otherDataSource) {
          setOtherDataSource(receivedData.otherDataSource);
        } else {
          setOtherDataSource(null);
        }
        // clear deleted items after successful sync since they are no longer needed
        setTimeout(() => {
          setUser((prevUser) => ({ ...prevUser, deletedTasks: [], deletedCategories: [] }));
        }, 1000);
        setStatus(STATUS.syncSuccess.message, STATUS.syncSuccess.severity);
        setUser((u) => ({ ...u, lastSyncedAt: new Date() }));
        showToast(STATUS.syncSuccess.message);
      } catch {
        setStatus(STATUS.syncError.message, STATUS.syncError.severity);
        showToast(STATUS.syncError.message, { type: "error" });
      }
    },
    [setStatus, setUser, updateCategory, user],
  );

  // HOST SETUP
  const startHost = useCallback(() => {
    setStatus(STATUS.startingPeer.message, STATUS.startingPeer.severity);
    const p = new Peer();
    setPeer(p);
    p.on("open", (id) => {
      setHostPeerId(id);
      setStatus(STATUS.waitingForDevice.message, STATUS.waitingForDevice.severity);
    });
    p.on("connection", (connection) => {
      setConn(connection);
      setStatus(STATUS.deviceConnected.message, STATUS.deviceConnected.severity);
      connection.on("data", (rawData) => {
        handleIncomingData(rawData as string, otherDataSyncOptionRef.current, (data) => {
          connection.send(data);
        });
      });
      connection.on("close", () => {
        setStatus(STATUS.connectionClosed.message, STATUS.connectionClosed.severity);
        resetAll();
      });
      connection.on("error", () => {
        setStatus(STATUS.connectionError.message, STATUS.connectionError.severity);
      });
    });
    p.on("error", () => {
      setStatus(STATUS.peerError.message, STATUS.peerError.severity);
    });
  }, [setStatus, handleIncomingData, resetAll]);

  // CONNECT TO HOST
  const connectToHost = useCallback(
    (hostId: string) => {
      setStatus(STATUS.startingPeer.message, STATUS.startingPeer.severity);
      const p = new Peer();
      setPeer(p);
      p.on("open", () => {
        setStatus(STATUS.connectingToHost.message, STATUS.connectingToHost.severity);
        const connection = p.connect(hostId);
        connection.on("open", async () => {
          setConn(connection);
          setStatus(STATUS.connectedSending.message, STATUS.connectedSending.severity);
          const otherData = await extractOtherData(user);
          const syncData = prepareSyncData(
            user.tasks,
            user.deletedTasks,
            user.categories,
            user.deletedCategories,
            user.favoriteCategories,
            otherData,
          );
          const compressedData = compressSyncData(syncData);
          connection.send(compressedData);
          connection.on("data", (rawData) => {
            handleIncomingData(rawData as string, "other_device");
          });
          connection.on("close", () => {
            setStatus(STATUS.connectionClosed.message, STATUS.connectionClosed.severity);
            resetAll();
          });
          connection.on("error", () => {
            setStatus(STATUS.connectionError.message, STATUS.connectionError.severity);
          });
        });
        connection.on("error", () => {
          setStatus(STATUS.connectionError.message, STATUS.connectionError.severity);
        });
      });
      p.on("error", () => {
        setStatus(STATUS.peerError.message, STATUS.peerError.severity);
      });
    },
    [setStatus, user, handleIncomingData, resetAll],
  );

  return {
    mode,
    setMode,
    hostPeerId,
    syncStatus,
    setStatus,
    startHost,
    connectToHost,
    otherDataSyncOption,
    setOtherDataSyncOption,
    otherDataSource,
    resetAll,
  };
}
