import { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { TopBar } from "../components";
import { Task, UserProps } from "../types/user";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import styled from "@emotion/styled";
import { Emoji } from "emoji-picker-react";
import { FileDownload, FileUpload, Info } from "@mui/icons-material";
import { exportTasksToJson } from "../utils";
import { IconButton, Tooltip } from "@mui/material";
import {
  CATEGORY_NAME_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  TASK_NAME_MAX_LENGTH,
} from "../constants";
import toast from "react-hot-toast";

export const ImportExport = ({ user, setUser }: UserProps) => {
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]); // Array of selected task IDs
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleTaskClick = (taskId: number) => {
    setSelectedTasks((prevSelectedTasks) =>
      prevSelectedTasks.includes(taskId)
        ? prevSelectedTasks.filter((id) => id !== taskId)
        : [...prevSelectedTasks, taskId]
    );
  };

  const handleExport = () => {
    const tasksToExport = user.tasks.filter((task: Task) => selectedTasks.includes(task.id));
    exportTasksToJson(tasksToExport);
    toast(
      (t) => (
        <div>
          Exported tasks:{" "}
          <ul>
            {tasksToExport.map((task) => (
              <li key={task.id}>
                <ListContent>
                  <Emoji unified={task.emoji || ""} size={20} emojiStyle={user.emojisStyle} />
                  <span>{task.name}</span>
                </ListContent>
              </li>
            ))}
          </ul>
          <Button
            variant="outlined"
            sx={{ width: "100%", p: "12px 24px", borderRadius: "16px", fontSize: "16px" }}
            onClick={() => toast.dismiss(t.id)}
          >
            Dimiss
          </Button>
        </div>
      )
      // { icon: <FileDownload /> }
    );
  };

  const handleExportAll = () => {
    exportTasksToJson(user.tasks);
    toast.success(`Exported all tasks (${user.tasks.length})`);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const importedTasks = JSON.parse(e.target?.result as string) as Task[];

          if (!Array.isArray(importedTasks)) {
            toast.error("Imported file has an invalid structure.");
            return;
          }
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
              `These tasks cannot be imported due to exceeding maximum character lengths: ${invalidTaskNames}`
            );
            toast.error(`Some tasks cannot be imported due to exceeding maximum character lengths`);
            return;
          }
          // Update user.categories if imported categories don't exist
          const updatedCategories = [...user.categories];
          importedTasks.forEach((task) => {
            task.category !== undefined &&
              task.category.forEach((importedCat) => {
                const existingCategory = updatedCategories.find(
                  (cat) => cat.name === importedCat.name
                );

                if (!existingCategory) {
                  updatedCategories.push(importedCat);
                }
              });
          });

          setUser((prevUser) => ({
            ...prevUser,
            categories: updatedCategories,
          }));
          // Proceed with merging the imported tasks as before
          const mergedTasks = [...user.tasks, ...importedTasks];

          //FIXME: modified tasks with same IDs doesn't update 🙄

          // Remove duplicates based on task IDs (if any)
          const uniqueTasks = Array.from(new Set(mergedTasks.map((task) => task.id)))
            .map((id) => mergedTasks.find((task) => task.id === id))
            .filter(Boolean) as Task[]; // Remove any 'undefined' values

          setUser((prevUser) => ({ ...prevUser, tasks: uniqueTasks }));

          // Prepare the list of imported task names
          const importedTaskNames = importedTasks.map((task) => task.name).join(", ");

          // Display the alert with the list of imported task names
          console.log(`Imported Tasks: ${importedTaskNames}`);
          toast((t) => (
            <div>
              Successfully imported tasks from <i>{file.name}</i>
              <ul>
                {importedTasks.map((task) => (
                  <li key={task.id}>
                    <ListContent>
                      <Emoji unified={task.emoji || ""} size={20} emojiStyle={user.emojisStyle} />
                      <span>{task.name}</span>
                    </ListContent>
                  </li>
                ))}
              </ul>
              <Button
                variant="outlined"
                sx={{ width: "100%", p: "12px 24px", borderRadius: "16px", fontSize: "16px" }}
                onClick={() => toast.dismiss(t.id)}
              >
                Dimiss
              </Button>
            </div>
          ));
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } catch (error) {
          console.error(`Error parsing the imported file ${file.name}:`, error);
          toast.error(`Error parsing the imported file -  ${file.name}`);
        }
      };

      reader.readAsText(file);
    }
  };

  // clear file input after logout
  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [user.createdAt]);

  return (
    <>
      <TopBar title="Import/Export" />
      <h2
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Select Tasks To Export&nbsp;
        <Tooltip title="Duplicates will be removed during import">
          <IconButton style={{ color: "#ffffff" }}>
            <Info />
          </IconButton>
        </Tooltip>
      </h2>

      <Container>
        {user.tasks.length > 0 ? (
          user.tasks.map((task: Task) => (
            <TaskContainer
              key={task.id}
              backgroundclr={task.color}
              onClick={() => handleTaskClick(task.id)}
              selected={selectedTasks.includes(task.id)}
            >
              <Checkbox size="medium" checked={selectedTasks.includes(task.id)} />
              <Typography
                variant="body1"
                component="span"
                sx={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Emoji size={24} unified={task.emoji || ""} emojiStyle={user.emojisStyle} />{" "}
                {task.name}
              </Typography>
            </TaskContainer>
          ))
        ) : (
          <h3 style={{ opacity: 0.8, fontStyle: "italic" }}>You don't have any tasks to export</h3>
        )}
      </Container>

      <Box
        component="div"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <StyledButton
          onClick={handleExport}
          disabled={selectedTasks.length === 0}
          variant="outlined"
        >
          <FileDownload /> &nbsp; Export Selected to JSON{" "}
          {selectedTasks.length > 0 && `[${selectedTasks.length}]`}
        </StyledButton>

        <StyledButton
          onClick={handleExportAll}
          disabled={user.tasks.length === 0}
          variant="outlined"
        >
          <FileDownload /> &nbsp; Export All Tasks to JSON
        </StyledButton>

        <h2 style={{ textAlign: "center" }}>Import Tasks From JSON</h2>
        <input
          accept=".json"
          id="import-file"
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImport}
        />
        <label htmlFor="import-file">
          <Button
            component="span"
            variant="outlined"
            sx={{
              padding: "12px 18px",
              borderRadius: "14px",
              width: "300px",
            }}
          >
            <FileUpload /> &nbsp; Import JSON
          </Button>
        </label>
      </Box>
    </>
  );
};

const TaskContainer = styled(Box)<{ backgroundclr: string; selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: left;
  margin: 8px;
  padding: 10px 4px;
  border-radius: 16px;
  background: #19172b94;
  border: 2px solid ${(props) => props.backgroundclr};
  box-shadow: ${(props) => props.selected && `0 0 8px 1px ${props.backgroundclr}`};
  transition: 0.3s all;
  width: 300px;
  cursor: "pointer";
`;

const ListContent = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  gap: 6px;
`;

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  max-height: 350px;

  overflow-y: auto;

  /* Custom Scrollbar Styles */
  ::-webkit-scrollbar {
    width: 8px;
    border-radius: 4px;
    background-color: #ffffff15;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #ffffff30;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #ffffff50;
  }

  ::-webkit-scrollbar-track {
    border-radius: 4px;
    background-color: #ffffff15;
  }
`;

const StyledButton = styled(Button)`
  padding: 12px 18px;
  border-radius: 14px;
  width: 300px;

  &:disabled {
    color: #ffffff58;
    border-color: #ffffff58;
  }
`;
