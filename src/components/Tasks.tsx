import { Category, Task, UserProps } from "../types/user";
import { useEffect, useState } from "react";

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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  Tooltip,
} from "@mui/material";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { EditTask } from "./EditTask";
import {
  CategoriesListContainer,
  CategoryChip,
  DialogBtn,
  EmojiContainer,
  NoTasks,
  Pinned,
  StyledMenuItem,
  TaskContainer,
  TaskDate,
  TaskDescription,
  TaskInfo,
  TaskName,
  TasksContainer,
  TimeLeft,
} from "../styles";

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
    let unpinnedTasks = tasks.filter((task) => !task.pinned);

    // Filter tasks based on the selected category
    //FIXME: doesnt work for pins
    if (selectedCatId !== undefined) {
      unpinnedTasks = unpinnedTasks.filter((task) => {
        if (task.category) {
          return task.category.some(
            (category) => category.id === selectedCatId
          );
        }
        return false;
      });
    }

    // move done tasks to bottom
    if (user.settings[0]?.doneToBottom) {
      const doneTasks = unpinnedTasks.filter((task) => task.done);
      const notDoneTasks = unpinnedTasks.filter((task) => !task.done);
      return [...pinnedTasks, ...notDoneTasks, ...doneTasks];
    }

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
    newCategory?: Category[]
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
          lastSave: new Date(),
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
        const duplicatedTask: Task = {
          ...selectedTask,
          id: new Date().getTime() + Math.random(),
          date: new Date(),
          lastSave: undefined,
        };
        // Add the duplicated task to the existing tasks
        const updatedTasks = [...user.tasks, duplicatedTask];
        // Update the user object with the updated tasks
        setUser({ ...user, tasks: updatedTasks });
      }
    }
  };

  const [categories, setCategories] = useState<Category[] | undefined>(
    undefined
  );
  const [selectedCatId, setSelectedCatId] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    const tasks: Task[] = user.tasks;
    // Create an empty array to store unique categories
    const uniqueCategories: Category[] = [];
    // Iterate over each task
    tasks.forEach((task) => {
      // Check if the task has a category
      if (task.category) {
        // Iterate over each category of the task
        task.category.forEach((category) => {
          // Check if the category is not already in the uniqueCategories array
          if (!uniqueCategories.some((c) => c.id === category.id)) {
            // Push the unique category to the array
            uniqueCategories.push(category);
          }
        });
      }
    });
    setCategories(uniqueCategories);
  }, [user.tasks]);
  return (
    <>
      <TasksContainer>
        <CategoriesListContainer>
          {categories !== undefined &&
            categories?.length > 1 &&
            user.settings[0].enableCategories &&
            categories?.map((cat) => (
              <CategoryChip
                label={cat.name}
                borderclr="transparent"
                glow={user.settings[0].enableGlow}
                backgroundclr={cat.color}
                onClick={() => setSelectedCatId(cat.id)}
                key={cat.id}
                list
                onDelete={
                  selectedCatId === cat.id
                    ? () => setSelectedCatId(undefined)
                    : undefined
                }
                style={{
                  boxShadow:
                    selectedCatId === cat.id
                      ? `0 0 8px 0 ${cat.color}`
                      : "none",
                  display:
                    selectedCatId === undefined || selectedCatId === cat.id
                      ? "inline-flex"
                      : "none",
                  padding: "16px 12px",
                }}
                avatar={
                  cat.emoji ? (
                    <Avatar alt={cat.name} sx={{ background: "transparent" }}>
                      {cat.emoji &&
                        (user.emojisStyle === EmojiStyle.NATIVE ? (
                          <div>
                            <Emoji
                              size={18}
                              unified={cat.emoji}
                              emojiStyle={EmojiStyle.NATIVE}
                            />
                          </div>
                        ) : (
                          <Emoji
                            size={20}
                            unified={cat.emoji}
                            emojiStyle={user.emojisStyle}
                          />
                        ))}
                    </Avatar>
                  ) : (
                    <></>
                  )
                }
              />
            ))}
        </CategoriesListContainer>
        {user.tasks.length !== 0 ? (
          reorderTasks(user.tasks).map((task) => (
            <TaskContainer
              key={task.id}
              backgroundColor={task.color}
              clr={getFontColorFromHex(task.color)}
              glow={user.settings[0].enableGlow}
              done={task.done}
            >
              {task.emoji || task.done ? (
                <EmojiContainer clr={getFontColorFromHex(task.color)}>
                  {task.done ? (
                    <Done fontSize="large" />
                  ) : user.emojisStyle === EmojiStyle.NATIVE ? (
                    <div>
                      <Emoji
                        size={36}
                        unified={task.emoji || ""}
                        emojiStyle={EmojiStyle.NATIVE}
                      />
                    </div>
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

                  <Tooltip
                    title={`Created at ${new Date(
                      task.date
                    ).toLocaleDateString()} • ${new Date(
                      task.date
                    ).toLocaleTimeString()}`}
                  >
                    <TaskDate>{formatDate(new Date(task.date))}</TaskDate>
                  </Tooltip>
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
                  user.settings[0].enableCategories !== undefined &&
                  user.settings[0].enableCategories &&
                  task.category.map((category) => (
                    <div key={category.id}>
                      <CategoryChip
                        backgroundclr={category.color}
                        borderclr={getFontColorFromHex(task.color)}
                        glow={user.settings[0].enableGlow}
                        label={category.name}
                        size="medium"
                        avatar={
                          category.emoji ? (
                            <Avatar
                              alt={category.name}
                              sx={{ background: "transparent" }}
                            >
                              {category.emoji &&
                                (user.emojisStyle === EmojiStyle.NATIVE ? (
                                  <div>
                                    <Emoji
                                      size={18}
                                      unified={category.emoji}
                                      emojiStyle={EmojiStyle.NATIVE}
                                    />
                                  </div>
                                ) : (
                                  <Emoji
                                    size={20}
                                    unified={category.emoji}
                                    emojiStyle={user.emojisStyle}
                                  />
                                ))}
                            </Avatar>
                          ) : (
                            <></>
                          )
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
      </TasksContainer>
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDeleteTask}
        PaperProps={{
          style: {
            borderRadius: "28px",
            padding: "10px",
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
              emojiStyle={user.emojisStyle}
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
