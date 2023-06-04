import { Task, UserProps } from "../types/user";
import { useState } from "react";

import styled from "@emotion/styled";
import {
  calculateDateDifference,
  formatDate,
  getFontColorFromHex,
} from "../utils";
import {
  Alarm,
  ContentCopy,
  Delete,
  Done,
  Edit,
  MoreVert,
  PushPin,
} from "@mui/icons-material";
import {
  Avatar,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Emoji } from "emoji-picker-react";
import { EditTask } from "./EditTask";
import { DialogBtn, fadeIn } from "../styles";

export const Tasks = ({ user, setUser }: UserProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const open = Boolean(anchorEl);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Handler for clicking the more options button in a task
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    taskId: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(taskId);
  };

  const handleCloseMoreMenu = () => {
    setAnchorEl(null);
  };
  const reorderTasks = (tasks: Task[]): Task[] => {
    // Reorders tasks by moving pinned tasks to the top
    const pinnedTasks = tasks.filter((task) => task.pinned);
    const unpinnedTasks = tasks.filter((task) => !task.pinned);
    return [...pinnedTasks, ...unpinnedTasks];
  };
  const handleMarkAsDone = () => {
    // Toggles the "done" property of the selected task
    if (selectedTaskId) {
      const updatedTasks = user.tasks.map((task) => {
        if (task.id === selectedTaskId) {
          return { ...task, done: !task.done };
        }
        return task;
      });
      setUser({ ...user, tasks: updatedTasks });
    }
  };
  const handlePin = () => {
    // Toggles the "pinned" property of the selected task
    if (selectedTaskId) {
      const updatedTasks = user.tasks.map((task) => {
        if (task.id === selectedTaskId) {
          return { ...task, pinned: !task.pinned };
        }
        return task;
      });
      setUser({ ...user, tasks: updatedTasks });
    }
  };

  const handleDeleteTask = () => {
    // Opens the delete task dialog
    if (selectedTaskId) {
      setDeleteDialogOpen(true);
    }
  };
  const confirmDeleteTask = () => {
    // Deletes the selected task
    if (selectedTaskId) {
      const updatedTasks = user.tasks.filter(
        (task) => task.id !== selectedTaskId
      );
      setUser({ ...user, tasks: updatedTasks });
      setDeleteDialogOpen(false);
    }
  };
  const cancelDeleteTask = () => {
    // Cancels the delete task operation
    setDeleteDialogOpen(false);
  };
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleEditTask = (
    taskId: number,
    newName: string,
    newColor: string,
    newEmoji?: string,
    newDescription?: string,
    newDeadline?: Date,
    newCategory?: any
  ) => {
    // Update the selected task with the new values
    const updatedTasks = user.tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          name: newName,
          color: newColor,
          emoji: newEmoji,
          description: newDescription,
          deadline: newDeadline,
          category: newCategory,
        };
      }
      return task;
    });
    // Update the user object with the updated tasks
    setUser({ ...user, tasks: updatedTasks });
  };
  const handleDuplicateTask = () => {
    if (selectedTaskId) {
      // Close the menu
      setAnchorEl(null);
      // Find the selected task
      const selectedTask = user.tasks.find(
        (task) => task.id === selectedTaskId
      );
      if (selectedTask) {
        // Create a duplicated task with a new ID and current date
        const duplicatedTask = {
          ...selectedTask,
          id: new Date().getTime() + Math.random(),
          date: new Date(),
        };
        // Add the duplicated task to the existing tasks
        const updatedTasks = [...user.tasks, duplicatedTask];
        // Update the user object with the updated tasks
        setUser({ ...user, tasks: updatedTasks });
      }
    }
  };

  return (
    <>
      <Container>
        {user.tasks.length !== 0 ? (
          reorderTasks(user.tasks).map((task) => (
            <TaskContainer
              key={task.id}
              backgroundColor={task.color}
              color={getFontColorFromHex(task.color)}
              done={task.done}
            >
              {task.emoji || task.done ? (
                <EmojiContainer color={getFontColorFromHex(task.color)}>
                  {task.done ? (
                    <Done fontSize="large" />
                  ) : (
                    <Emoji
                      size={46}
                      unified={task.emoji || ""}
                      emojiStyle={user.emojisStyle}
                    />
                  )}
                </EmojiContainer>
              ) : null}
              <TaskInfo done={task.done}>
                {task.pinned && (
                  <Pinned>
                    <PushPin fontSize="small" /> &nbsp; Pinned
                  </Pinned>
                )}
                <TaskName>
                  {task.name}

                  <TaskDate>
                    {/* {new Date(task.date).toLocaleDateString()}
                    {" • "}
                    {new Date(task.date).toLocaleTimeString()} */}
                    {formatDate(new Date(task.date))}
                  </TaskDate>
                </TaskName>
                <TaskDescription>{task.description}</TaskDescription>

                {task.deadline && (
                  <TimeLeft
                    done={task.done}
                    timeUp={new Date() > new Date(task.deadline)}
                  >
                    <Alarm fontSize="small" /> &nbsp;
                    {new Date(task.deadline).toLocaleDateString()} {" • "}
                    {new Date(task.deadline).toLocaleTimeString()}
                    {!task.done && (
                      <>
                        {" • "}
                        {calculateDateDifference(new Date(task.deadline))}
                      </>
                    )}
                  </TimeLeft>
                )}
                {task.category &&
                  user.enableCategories &&
                  task.category.map((category) => (
                    <div key={category.id}>
                      <Chip
                        label={category.name}
                        size="medium"
                        style={{
                          backgroundColor: category.color,
                          color: getFontColorFromHex(category.color),
                          boxShadow: `0 0 8px 0 ${category.color}`,
                          fontWeight: "bold",
                          fontSize: "14px",
                          border: `2px solid ${getFontColorFromHex(
                            task.color
                          )}`,
                          margin: "6px 0 0 0",
                          padding: "8px",
                          opacity: 0.9,
                        }}
                        avatar={
                          <Avatar
                            alt={category.name}
                            sx={{ background: "transparent" }}
                          >
                            {category.emoji && (
                              <Emoji
                                size={20}
                                unified={category.emoji}
                                emojiStyle={user.emojisStyle}
                              />
                            )}
                          </Avatar>
                        }
                      />
                    </div>
                  ))}
              </TaskInfo>
              <IconButton
                aria-label="Task Menu"
                aria-controls={open ? "task-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={(event) => handleClick(event, task.id)}
                sx={{
                  color: getFontColorFromHex(task.color),
                  margin: "4px",
                }}
              >
                <MoreVert />
              </IconButton>

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
                    padding: "2px 4px",
                    // background: "#ffffffa9",
                    // backdropFilter: "blur(4px)",
                  },
                }}
                MenuListProps={{
                  "aria-labelledby": "more-button",
                }}
              >
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
                  <PushPin /> &nbsp;{" "}
                  {user.tasks.find((task) => task.id === selectedTaskId)?.pinned
                    ? "Unpin"
                    : "Pin"}
                </StyledMenuItem>

                <Divider />
                <StyledMenuItem
                  onClick={() => {
                    handleCloseMoreMenu();
                    setEditModalOpen(true);
                  }}
                >
                  <Edit /> &nbsp; Edit
                </StyledMenuItem>
                <StyledMenuItem onClick={handleDuplicateTask}>
                  <ContentCopy /> &nbsp; Duplicate
                </StyledMenuItem>
                <Divider />
                <StyledMenuItem
                  sx={{
                    color: "#ff4040",
                  }}
                  onClick={() => {
                    handleCloseMoreMenu();
                    handleDeleteTask();
                  }}
                >
                  <Delete /> &nbsp; Delete
                </StyledMenuItem>
              </Menu>
            </TaskContainer>
          ))
        ) : (
          <NoTasks>
            <b>You don't have any tasks yet</b>
            <br />
            Click on the <b>+</b> button to add one <br />
          </NoTasks>
        )}

        <EditTask
          open={editModalOpen}
          task={user.tasks.find((task) => task.id === selectedTaskId)}
          onClose={() => setEditModalOpen(false)}
          user={user}
          onSave={(editedTask) => {
            handleEditTask(
              editedTask.id,
              editedTask.name,
              editedTask.color,
              editedTask.emoji || undefined,
              editedTask.description || undefined,
              editedTask.deadline || undefined,
              editedTask.category || undefined
            );
            setEditModalOpen(false);
          }}
        />
      </Container>
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDeleteTask}
        PaperProps={{
          style: {
            borderRadius: "28px",
            padding: "10px",
            // border: `6px solid ${
            //   user.tasks.find((task) => task.id === selectedTaskId)?.color
            // }`,
            // boxShadow: `0 0 8px 0 ${
            //   user.tasks.find((task) => task.id === selectedTaskId)?.color
            // }`,
          },
        }}
      >
        <DialogTitle>Are you sure you want to delete the task?</DialogTitle>
        <DialogContent>
          <p
            style={{
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <b>Emoji:</b>{" "}
            <Emoji
              size={28}
              unified={
                user.tasks.find((task) => task.id === selectedTaskId)?.emoji ||
                ""
              }
            />
          </p>
          <p>
            <b>Task Name:</b>{" "}
            {user.tasks.find((task) => task.id === selectedTaskId)?.name}
          </p>
          <p>
            <b>Task Description:</b>{" "}
            {user.tasks.find((task) => task.id === selectedTaskId)?.description}
          </p>
        </DialogContent>
        <DialogActions>
          <DialogBtn onClick={cancelDeleteTask} color="primary">
            Cancel
          </DialogBtn>
          <DialogBtn onClick={confirmDeleteTask} color="error">
            Delete
          </DialogBtn>
        </DialogActions>
      </Dialog>
      <div style={{ paddingTop: "100px" }} />
    </>
  );
};

const TaskContainer = styled.div<{
  backgroundColor: string;
  color: string;
  done: boolean;
}>`
  display: flex;
  align-items: center;
  margin-top: 16px;
  transition: 0.3s all;
  background-color: ${(props) => props.backgroundColor};
  opacity: ${(props) => (props.done ? 0.7 : 1)};
  color: ${(props) => props.color};
  border-left: ${(props) =>
    props.done ? "6px solid #00ff0d" : "6px solid transparent"};
  padding: 16px;
  border-radius: 20px;
  animation: ${fadeIn} 0.5s ease;
`;

const EmojiContainer = styled.span<{ color: string }>`
  text-decoration: none;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.color === "#1A1A1A" ? "#4b4b4b6e" : "#dddddd9d"};
  font-size: 32px;
  padding: 12px;
  width: 42px;
  height: 42px;
  border-radius: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TaskInfo = styled.div<{ done: boolean }>`
  text-decoration: ${(props) => (props.done ? "line-through" : "none")};
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const TaskName = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  font-size: 20px;
  /* @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  } */
`;

const TaskDate = styled.p`
  margin: 0 6px;
  text-align: right;
  margin-left: auto;
  font-size: 14px;
  font-style: italic;
  font-weight: 300;
  opacity: 0.9;
  /* @media (max-width: 600px) {
    margin-left: 0;
    margin-top: 4px;
    text-align: left;
  } */
`;

const TaskDescription = styled.p`
  margin: 0;
  font-size: 18px;
`;

const NoTasks = styled.div`
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 100vw;
  opacity: 0.9;
  font-size: 18px;
  /* @media (max-width: 1024px) {
    font-size: 16px;
  } */
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  max-width: 700px;
  margin: 0 auto;
  flex-direction: column;
`;

const TimeLeft = styled.span<{ timeUp: boolean; done: boolean }>`
  color: ${(props) => props.timeUp && !props.done && "#ff2a23d5"};
  text-shadow: ${(props) =>
    props.timeUp && !props.done ? "0 0 8px #ff2a23d5" : "none"};
  transition: 0.3s all;
  font-size: 14px;
  margin: 6px 0;
  font-weight: 500;
  font-style: italic;
  display: flex;
  opacity: ${(props) => (props.timeUp ? 1 : 0.9)};
`;

const Pinned = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  opacity: 0.8;
  font-size: 16px;
`;
const StyledMenuItem = styled(MenuItem)`
  margin: 6px;
  padding: 10px;
  border-radius: 12px;
  box-shadow: none;

  &:hover {
    background-color: #f0f0f0;
  }
`;
