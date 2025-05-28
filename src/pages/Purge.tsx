import { useContext, useEffect, useState } from "react";
import { CustomDialogTitle, TopBar } from "../components";
import {
  DialogBtn,
  ManagementButton,
  ManagementButtonsContainer,
  ManagementContainer,
  ManagementHeader,
  TaskManagementContainer,
} from "../styles";
import { UserContext } from "../contexts/UserContext";
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Tooltip,
  Typography,
} from "@mui/material";
import { Emoji } from "emoji-picker-react";
import { Task, UUID } from "../types/user";
import { useStorageState } from "../hooks/useStorageState";
import { DeleteForeverRounded, DeleteSweepRounded, DoneAllRounded } from "@mui/icons-material";
import { showToast } from "../utils";

const Purge = () => {
  const { user, setUser } = useContext(UserContext);
  const { tasks } = user;

  const [selectedTasks, setSelectedTasks] = useStorageState<UUID[]>(
    [],
    "tasksToPurge",
    "sessionStorage",
  ); // Array of selected task IDs

  const [deleteAllDialog, setDeleteAllDialog] = useState<boolean>(false);

  useEffect(() => {
    document.title = "Todo App - Purge tasks";
  }, []);

  const doneTasks = tasks.filter((task) => task.done);
  const notDoneTasks = tasks.filter((task) => !task.done);

  const selectedNamesList = new Intl.ListFormat("en", {
    style: "long",
    type: "conjunction",
  }).format(
    selectedTasks.map((taskId) => {
      const selectedTask = user.tasks.find((task) => task.id === taskId);
      return selectedTask ? selectedTask.name : "";
    }),
  );

  const handleTaskClick = (taskId: UUID) => {
    setSelectedTasks((prevSelectedTasks) => {
      if (prevSelectedTasks.includes(taskId)) {
        return prevSelectedTasks.filter((id) => id !== taskId);
      } else {
        return [...prevSelectedTasks, taskId];
      }
    });
  };

  const purgeTasks = (tasks: Task[]) => {
    const updatedTasks = user.tasks.filter(
      (task) => !tasks.some((purgeTask) => purgeTask === task),
    );

    const purgedTaskIds = tasks.map((task) => task.id);

    setSelectedTasks([]);
    setUser((prevUser) => ({
      ...prevUser,
      tasks: updatedTasks,
      deletedTasks: [
        ...(prevUser.deletedTasks || []),
        ...purgedTaskIds.filter((id) => !prevUser.deletedTasks?.includes(id)),
      ],
    }));
  };

  const handlePurgeSelected = () => {
    const tasksToPurge = tasks.filter((task: Task) => selectedTasks.includes(task.id));
    purgeTasks(tasksToPurge);
    showToast(
      <div>
        Purged selectedTasks tasks: <b translate="no">{selectedNamesList}</b>
      </div>,
    );
  };

  const handlePurgeDone = () => {
    purgeTasks(doneTasks);
    showToast("Purged all done tasks.");
  };

  const handlePurgeAll = () => {
    setDeleteAllDialog(true);
  };

  const renderTasks = (tasks: Task[], title: string) => {
    return (
      <>
        <Divider sx={{ fontWeight: 500, my: "4px" }}>{title}</Divider>
        {tasks.map((task) => (
          <TaskManagementContainer
            key={task.id}
            backgroundClr={task.color}
            onClick={() => handleTaskClick(task.id)}
            selected={selectedTasks.includes(task.id)}
            translate="no"
          >
            <Checkbox size="medium" checked={selectedTasks.includes(task.id)} />
            <Typography
              variant="body1"
              component="span"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                wordBreak: "break-word",
              }}
            >
              <Emoji size={24} unified={task.emoji || ""} emojiStyle={user.emojisStyle} />{" "}
              {task.name}
            </Typography>
          </TaskManagementContainer>
        ))}
      </>
    );
  };

  return (
    <>
      <TopBar title="Purge Tasks" />
      <ManagementHeader>Select Tasks To Purge</ManagementHeader>
      <ManagementContainer>
        {doneTasks.length > 0 && renderTasks(doneTasks, "Done Tasks")}
        {notDoneTasks.length > 0 && renderTasks(notDoneTasks, "Not Done Tasks")}
        {tasks.length === 0 && (
          <h3 style={{ opacity: 0.8, fontStyle: "italic" }}>You don't have any tasks to purge</h3>
        )}
      </ManagementContainer>
      <ManagementButtonsContainer>
        <Tooltip
          title={
            selectedTasks.length > 0 ? (
              <div>
                <span>Selected Tasks: </span>
                <span translate="no">{selectedNamesList}</span>
              </div>
            ) : undefined
          }
        >
          <ManagementButton onClick={handlePurgeSelected} disabled={selectedTasks.length === 0}>
            <DeleteSweepRounded /> &nbsp; Purge Selected{" "}
            {selectedTasks.length > 0 && `[${selectedTasks.length}]`}
          </ManagementButton>
        </Tooltip>
        <ManagementButton onClick={handlePurgeDone} disabled={doneTasks.length === 0}>
          <DoneAllRounded /> &nbsp; Purge Done
        </ManagementButton>
        <ManagementButton color="error" onClick={handlePurgeAll} disabled={tasks.length === 0}>
          <DeleteForeverRounded /> &nbsp; Purge All Tasks
        </ManagementButton>
      </ManagementButtonsContainer>
      <Dialog open={deleteAllDialog} onClose={() => setDeleteAllDialog(false)}>
        <CustomDialogTitle
          title="Purge All Tasks"
          subTitle="Confirm that you want to purge all tasks"
          onClose={() => setDeleteAllDialog(false)}
          icon={<DeleteForeverRounded />}
        />
        <DialogContent>
          This action cannot be undone. Are you sure you want to proceed?
        </DialogContent>
        <DialogActions>
          <DialogBtn onClick={() => setDeleteAllDialog(false)}>Cancel</DialogBtn>
          <DialogBtn
            color="error"
            onClick={() => {
              purgeTasks(tasks);
              setDeleteAllDialog(false);
              showToast("Purged all tasks");
            }}
          >
            <DeleteForeverRounded /> &nbsp; Purge
          </DialogBtn>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Purge;
