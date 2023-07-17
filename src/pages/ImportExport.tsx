import { useState } from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { TopBar } from "../components";
import { Task, UserProps } from "../types/user";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { Emoji } from "emoji-picker-react";
import { FileDownload, FileUpload } from "@mui/icons-material";

export const ImportExport = ({ user, setUser }: UserProps) => {
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]); // Array of selected task IDs

  const handleTaskClick = (taskId: number) => {
    setSelectedTasks((prevSelectedTasks) =>
      prevSelectedTasks.includes(taskId)
        ? prevSelectedTasks.filter((id) => id !== taskId)
        : [...prevSelectedTasks, taskId]
    );
  };
  const exportTasksToJson = (selectedTasks: Task[]) => {
    const dataStr = JSON.stringify(selectedTasks, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `exported_tasks${new Date().getTime()}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleExport = () => {
    const tasksToExport = user.tasks.filter((task: Task) =>
      selectedTasks.includes(task.id)
    );
    exportTasksToJson(tasksToExport);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const importedTasks = JSON.parse(
            e.target?.result as string
          ) as Task[];

          // Merge the imported tasks with the existing tasks
          const mergedTasks = [...user.tasks, ...importedTasks];

          // Remove duplicates based on task IDs (if any)
          const uniqueTasks = Array.from(
            new Set(mergedTasks.map((task) => task.id))
          )
            .map((id) => mergedTasks.find((task) => task.id === id))
            .filter(Boolean) as Task[]; // Remove any 'undefined' values

          setUser((prevUser) => ({ ...prevUser, tasks: uniqueTasks }));

          // Prepare the list of imported task names
          const importedTaskNames = importedTasks
            .map((task) => task.name)
            .join(", ");

          // Display the alert with the list of imported task names
          alert(`Imported Tasks: ${importedTaskNames}`);
        } catch (error) {
          console.error("Error parsing the imported file:", error);
          alert("Error parsing the imported file");
        }
      };

      reader.readAsText(file);
    }
  };

  return (
    <>
      <TopBar title="Import/Export" />
      <h3 style={{ textAlign: "center" }}>Select Tasks To Export</h3>
      <Container>
        {user.tasks.map((task: Task) => (
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
              <Emoji size={24} unified={task.emoji || ""} /> {task.name}
            </Typography>
          </TaskContainer>
        ))}
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
        <h3 style={{ textAlign: "center" }}>Import Tasks From JSON</h3>
        <input
          accept=".json"
          id="import-file"
          type="file"
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
  border-radius: 12px;
  background: #19172b94;
  border: 2px solid ${(props) => props.backgroundclr};
  box-shadow: ${(props) =>
    props.selected && `0 0 8px 1px ${props.backgroundclr}`};
  transition: 0.3s all;
  width: 300px;
  cursor: "pointer";
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
