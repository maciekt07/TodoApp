import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { TopBar } from "../components";
import { Category, Task, UUID } from "../types/user";
import Typography from "@mui/material/Typography";
import { Emoji } from "emoji-picker-react";
import {
  FileDownload,
  FileUpload,
  IntegrationInstructionsRounded,
  Link as LinkIcon,
  PhonelinkRounded,
  QrCodeScannerRounded,
} from "@mui/icons-material";
import { exportTasksToJson, isHexColor, showToast, systemInfo } from "../utils";
import { Tooltip } from "@mui/material";
import {
  CATEGORY_NAME_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  TASK_NAME_MAX_LENGTH,
} from "../constants";
import { UserContext } from "../contexts/UserContext";
import { useStorageState } from "../hooks/useStorageState";
import {
  DropZone,
  ListContent,
  ManagementButton,
  ManagementButtonsContainer,
  ManagementContainer,
  ManagementHeader,
  TaskManagementContainer,
  VisuallyHiddenInput,
} from "../styles";
import { Link, useNavigate } from "react-router-dom";
import QRCodeScannerDialog from "../components/QRCodeScannerDialog";
const Transfer = () => {
  const { user, setUser } = useContext(UserContext);
  const [selectedTasks, setSelectedTasks] = useStorageState<UUID[]>(
    [],
    "tasksToExport",
    "sessionStorage",
  ); // Array of selected task IDs
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const n = useNavigate();

  useEffect(() => {
    document.title = "Todo App - Transfer tasks";
  }, []);

  // clear file input after logout
  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [user.createdAt]);

  const handleTaskClick = (taskId: UUID) => {
    setSelectedTasks((prevSelectedTasks) => {
      if (prevSelectedTasks.includes(taskId)) {
        return prevSelectedTasks.filter((id) => id !== taskId);
      } else {
        return [...prevSelectedTasks, taskId];
      }
    });
  };

  const handleExport = () => {
    const tasksToExport = user.tasks.filter((task) => selectedTasks.includes(task.id));
    exportTasksToJson(tasksToExport);
    showToast(
      <div>
        Exported tasks:{" "}
        <ul>
          {tasksToExport.map((task) => (
            <li key={task.id}>
              <ListContent>
                <Emoji unified={task.emoji || ""} size={20} emojiStyle={user.emojisStyle} />
                <span translate="no">{task.name}</span>
              </ListContent>
            </li>
          ))}
        </ul>
      </div>,
      { dismissButton: true, type: "blank" },
    );
  };

  const handleExportAll = () => {
    if (user.tasks.length === 0) {
      showToast("No tasks to export", { type: "error" });
      return;
    }
    exportTasksToJson(user.tasks);
    showToast(`Exported all tasks (${user.tasks.length})`);
  };

  const handleImport = useCallback(
    (taskFile: File) => {
      const file = taskFile;

      if (file) {
        if (file.type !== "application/json") {
          showToast(
            <div>
              Incorrect file type {file.type !== "" && <span translate="no">{file.type}</span>}.
              Please select a JSON file.
            </div>,
            { type: "error" },
          );
          return;
        }

        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
          try {
            const importedTasks = JSON.parse(e.target?.result as string) as Task[];

            if (!Array.isArray(importedTasks)) {
              showToast("Imported file has an invalid structure.", { type: "error" });
              return;
            }

            /**
             * TODO: write separate util function to check if task is not invalid
             */

            // Check if any imported task property exceeds the maximum length
            const invalidTasks = importedTasks.filter((task) => {
              const isInvalid =
                (task.name && task.name.length > TASK_NAME_MAX_LENGTH) ||
                (task.description && task.description.length > DESCRIPTION_MAX_LENGTH) ||
                (task.category &&
                  task.category.some((cat) => cat.name.length > CATEGORY_NAME_MAX_LENGTH));

              return isInvalid;
            });

            if (invalidTasks.length > 0) {
              const invalidTaskNames = invalidTasks.map((task) => task.name).join(", ");
              console.error(
                `These tasks cannot be imported due to exceeding maximum character lengths: ${invalidTaskNames}`,
              );
              showToast(
                `These tasks cannot be imported due to exceeding maximum character lengths: ${invalidTaskNames}`,
                { type: "error" },
              );
              return;
            }

            const isCategoryColorValid = (category: Category) =>
              category.color && isHexColor(category.color);

            const hasInvalidColors = importedTasks.some((task) => {
              return (
                (task.color && !isHexColor(task.color)) ||
                (task.category && !task.category.every((cat) => isCategoryColorValid(cat)))
              );
            });

            if (hasInvalidColors) {
              showToast("Imported file contains tasks with invalid color formats.", {
                type: "error",
              });
              return;
            }

            const maxFileSize = 6 * 1024 * 1024; //MB
            if (file.size > maxFileSize) {
              const formatMB = new Intl.NumberFormat("en-US", {
                style: "unit",
                unit: "megabyte",
                maximumFractionDigits: 2,
              });

              const fileSizeMB = file.size / (1024 * 1024);
              const maxSizeMB = maxFileSize / (1024 * 1024);

              showToast(
                `File size is too large (${formatMB.format(fileSizeMB)}/${formatMB.format(maxSizeMB)})`,
                { type: "error" },
              );
              return;
            }

            // Update user.categories if imported categories don't exist
            const updatedCategories = user.categories.slice(); // Create a copy of the existing categories

            importedTasks.forEach((task) => {
              if (task.category) {
                task.category.forEach((importedCat) => {
                  const existingCategory = updatedCategories.find(
                    (cat) => cat.id === importedCat.id,
                  );

                  if (!existingCategory) {
                    updatedCategories.push(importedCat);
                  } else {
                    // Replace the existing category with the imported one if the ID matches
                    Object.assign(existingCategory, importedCat);
                  }
                });
              }
            });

            setUser((prevUser) => ({
              ...prevUser,
              categories: updatedCategories,
            }));

            const mergedTasks = [...user.tasks, ...importedTasks];
            const uniqueTasks = mergedTasks.reduce((acc, task) => {
              const existingTask = acc.find((t) => t.id === task.id);
              if (existingTask) {
                return acc.map((t) => (t.id === task.id ? task : t));
              } else {
                return [...acc, task];
              }
            }, [] as Task[]);

            setUser((prevUser) => ({ ...prevUser, tasks: uniqueTasks }));

            // Prepare the list of imported task names
            const importedTaskNames = importedTasks.map((task) => task.name).join(", ");

            // Display the alert with the list of imported task names
            console.log(`Imported Tasks: ${importedTaskNames}`);

            showToast(
              <div>
                Tasks Successfully Imported from <br />
                <i translate="no" style={{ wordBreak: "break-all" }}>
                  {file.name}
                </i>
                <ul>
                  {importedTasks.map((task) => (
                    <li key={task.id}>
                      <ListContent>
                        <Emoji unified={task.emoji || ""} size={20} emojiStyle={user.emojisStyle} />
                        <span translate="no">{task.name}</span>
                      </ListContent>
                    </li>
                  ))}
                </ul>
              </div>,
              { dismissButton: true, type: "blank" },
            );

            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          } catch (error) {
            console.error(`Error parsing the imported file ${file.name}:`, error);
            showToast(
              <div style={{ wordBreak: "break-all" }}>
                Error parsing the imported file: <br /> <i>{file.name}</i>
              </div>,
              { type: "error" },
            );
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }
        };

        reader.readAsText(file);
      }
    },
    [user.categories, user.emojisStyle, user.tasks, setUser],
  );

  const handleImportFromLink = async (): Promise<void> => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.startsWith(`${location.protocol}//${location.hostname}`)) {
        window.open(text, "_self");
      } else {
        showToast(
          <div>
            Failed to import task from the provided link. Please ensure that the link is copied
            correctly.
          </div>,
          { type: "error" },
        );
      }
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  const handleImportFromQRCode = (qrCodeData: string) => {
    try {
      if (qrCodeData.startsWith(`${location.protocol}//${location.hostname}`)) {
        const url = new URL(qrCodeData);
        const path = url.pathname + url.search + url.hash;
        n(path);
      } else {
        showToast(<div>Failed to import task from the provided QR Code.</div>, { type: "error" });
      }
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  const handleImportFromClipboard = async (): Promise<void> => {
    try {
      const text = await navigator.clipboard.readText();
      const file = new File([text], "Clipboard", { type: "application/json" });
      handleImport(file);
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    console.log(file);
    if (file.size === 0 || file.type === "") {
      showToast(
        <div>
          Unknown file type{" "}
          <i translate="no" style={{ wordBreak: "break-all" }}>
            {file.name}
          </i>
        </div>,
        { type: "error" },
      );
      return;
    }
    handleImport(file);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      handleImport(file);
    }
  };

  // Experimental feature that allows the PWA to open JSON files directly from the file system
  // and import tasks from the file when the app is launched with a JSON file.
  useEffect(() => {
    if (window.launchQueue && "setConsumer" in window.launchQueue) {
      window.launchQueue.setConsumer((launchParams) => {
        if (!launchParams.files?.length) return;

        for (const fileHandle of launchParams.files) {
          fileHandle.getFile().then((file) => {
            handleImport(file);
          });
        }
      });
    }
  }, [handleImport]);

  return (
    <>
      <TopBar title="Transfer" />
      <ManagementHeader>Sync All Data</ManagementHeader>
      <ManagementButtonsContainer>
        <Link to="/sync" tabIndex={-1}>
          <ManagementButton variant="contained" size="large" sx={{ mb: 1 }}>
            <PhonelinkRounded /> &nbsp; Sync With Other Device
          </ManagementButton>
        </Link>
      </ManagementButtonsContainer>
      <ManagementHeader>Export Tasks to JSON</ManagementHeader>
      <ManagementContainer>
        {user.tasks.length > 0 ? (
          user.tasks.map((task: Task) => (
            <TaskManagementContainer
              key={task.id}
              backgroundClr={task.color}
              onClick={() => handleTaskClick(task.id)}
              selected={selectedTasks.includes(task.id)}
              translate="no"
            >
              <Checkbox color="primary" size="medium" checked={selectedTasks.includes(task.id)} />
              <Typography
                variant="body1"
                component="span"
                sx={{ display: "flex", alignItems: "center", gap: "6px", wordBreak: "break-word" }}
              >
                <Emoji size={24} unified={task.emoji || ""} emojiStyle={user.emojisStyle} />{" "}
                {task.name}
              </Typography>
            </TaskManagementContainer>
          ))
        ) : (
          <h3 style={{ opacity: 0.8, fontStyle: "italic" }}>You don't have any tasks to export</h3>
        )}
      </ManagementContainer>

      <ManagementButtonsContainer>
        <Tooltip
          title={
            selectedTasks.length > 0
              ? `Selected tasks: ${new Intl.ListFormat("en", {
                  style: "long",
                  type: "conjunction",
                }).format(
                  selectedTasks.map((taskId) => {
                    const selectedTask = user.tasks.find((task) => task.id === taskId);
                    return selectedTask ? selectedTask.name : "";
                  }),
                )}`
              : undefined
          }
        >
          <ManagementButton onClick={handleExport} disabled={selectedTasks.length === 0}>
            <FileDownload /> &nbsp; Export Selected to JSON{" "}
            {selectedTasks.length > 0 && `[${selectedTasks.length}]`}
          </ManagementButton>
        </Tooltip>
        <ManagementButton onClick={handleExportAll} disabled={user.tasks.length === 0}>
          <FileDownload /> &nbsp; Export All Tasks to JSON
        </ManagementButton>

        <h2 style={{ textAlign: "center" }}>Import Tasks From JSON</h2>

        {systemInfo.os !== "Android" && systemInfo.os !== "iOS" && (
          <div style={{ width: "300px" }}>
            <DropZone
              onDragOver={handleDragOver}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              isDragging={isDragging}
            >
              <FileUpload fontSize="large" color="primary" />
              <div>Drop JSON file here to import tasks </div>
            </DropZone>
          </div>
        )}

        <Button
          component="label"
          role={undefined}
          tabIndex={-1}
          variant="outlined"
          sx={{
            p: "12px 20px",
            borderRadius: "14px",
            width: "300px",
          }}
        >
          <FileUpload /> &nbsp; Select JSON File
          <VisuallyHiddenInput
            accept=".json"
            type="file"
            ref={fileInputRef}
            onChange={handleSelectChange}
          />
        </Button>

        <ManagementButton onClick={handleImportFromClipboard}>
          <IntegrationInstructionsRounded /> &nbsp; Import JSON from clipboard
        </ManagementButton>
        <h2 style={{ textAlign: "center" }}>Import Task From a Link</h2>
        <ManagementButton onClick={() => setIsScannerOpen(true)}>
          <QrCodeScannerRounded /> &nbsp; Scan QR Code
        </ManagementButton>
        {/* Solution for PWA on iOS: */}
        <ManagementButton onClick={handleImportFromLink}>
          <LinkIcon /> &nbsp; Paste Link
        </ManagementButton>
      </ManagementButtonsContainer>
      <QRCodeScannerDialog
        subTitle="Import task by scanning a QR code"
        open={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={(result) => {
          showToast("QR Code scanned successfully!");
          setIsScannerOpen(false);
          if (result[0].rawValue) {
            handleImportFromQRCode(result[0].rawValue);
          }
        }}
      />
    </>
  );
};

export default Transfer;
