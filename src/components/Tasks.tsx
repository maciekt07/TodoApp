import { Category, Task, UserProps } from "../types/user";
import { useEffect, useState } from "react";
import { calculateDateDifference, formatDate, getFontColorFromHex } from "../utils";
import { Alarm, Done, MoreVert, PushPin } from "@mui/icons-material";
import {
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { EditTask } from ".";
import {
  CategoriesListContainer,
  CategoryChip,
  DialogBtn,
  EmojiContainer,
  NoTasks,
  Pinned,
  TaskContainer,
  TaskDate,
  TaskDescription,
  TaskHeader,
  TaskInfo,
  TaskName,
  TasksContainer,
  TimeLeft,
} from "../styles";

import { TaskMenu } from ".";
import toast from "react-hot-toast";
import { useResponsiveDisplay } from "../hooks/useResponsiveDisplay";

/**
 * Component to display a list of tasks.
 */

export const Tasks = ({ user, setUser }: UserProps): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const open = Boolean(anchorEl);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  const isMobile = useResponsiveDisplay();

  // Handler for clicking the more options button in a task
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, taskId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(taskId);
  };

  const handleCloseMoreMenu = () => {
    setAnchorEl(null);
    document.body.style.overflow = "visible";
  };

  const reorderTasks = (tasks: Task[]): Task[] => {
    // Reorders tasks by moving pinned tasks to the top
    let pinnedTasks = tasks.filter((task) => task.pinned);
    let unpinnedTasks = tasks.filter((task) => !task.pinned);

    // Filter tasks based on the selected category
    if (selectedCatId !== undefined) {
      unpinnedTasks = unpinnedTasks.filter((task) => {
        if (task.category) {
          return task.category.some((category) => category.id === selectedCatId);
        }
        return false;
      });
      pinnedTasks = pinnedTasks.filter((task) => {
        if (task.category) {
          return task.category.some((category) => category.id === selectedCatId);
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
      setUser((prevUser) => ({
        ...prevUser,
        tasks: updatedTasks,
      }));

      const allTasksDone = updatedTasks.every((task) => task.done);

      if (allTasksDone) {
        toast.success(
          () => (
            <div>
              <b>All tasks done</b>
              <br />
              <span>You've checked off all your todos. Well done!</span>
            </div>
          ),
          {
            icon: <Emoji unified="1f60e" emojiStyle={user.emojisStyle} />,
          }
        );
      }
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
      setUser((prevUser) => ({
        ...prevUser,
        tasks: updatedTasks,
      }));
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
      const updatedTasks = user.tasks.filter((task) => task.id !== selectedTaskId);
      setUser((prevUser) => ({
        ...prevUser,
        tasks: updatedTasks,
      }));

      setDeleteDialogOpen(false);
      toast.success(() => (
        <div>
          Deleted Task - <b>{user.tasks.find((task) => task.id === selectedTaskId)?.name}</b>
        </div>
      ));
    }
  };
  const cancelDeleteTask = () => {
    // Cancels the delete task operation
    setDeleteDialogOpen(false);
  };

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
    setUser((prevUser) => ({
      ...prevUser,
      tasks: updatedTasks,
    }));
  };
  const handleDuplicateTask = () => {
    if (selectedTaskId) {
      // Close the menu
      setAnchorEl(null);
      // Find the selected task
      const selectedTask = user.tasks.find((task) => task.id === selectedTaskId);
      if (selectedTask) {
        // Create a duplicated task with a new ID and current date
        const duplicatedTask: Task = {
          ...selectedTask,
          id: new Date().getTime() + Math.floor(Math.random() * 1000),
          date: new Date(),
          lastSave: undefined,
        };
        // Add the duplicated task to the existing tasks
        const updatedTasks = [...user.tasks, duplicatedTask];
        // Update the user object with the updated tasks
        setUser((prevUser) => ({
          ...prevUser,
          tasks: updatedTasks,
        }));
      }
    }
  };

  const [categories, setCategories] = useState<Category[] | undefined>(undefined);
  const [selectedCatId, setSelectedCatId] = useState<number | undefined>(undefined);

  const [categoryCounts, setCategoryCounts] = useState<{
    [categoryId: number]: number;
  }>({});

  useEffect(() => {
    const tasks: Task[] = user.tasks;
    const uniqueCategories: Category[] = [];

    tasks.forEach((task) => {
      if (task.category) {
        task.category.forEach((category) => {
          if (!uniqueCategories.some((c) => c.id === category.id)) {
            uniqueCategories.push(category);
          }
        });
      }
    });

    // Calculate category counts
    const counts: { [categoryId: number]: number } = {};
    uniqueCategories.forEach((category) => {
      const categoryTasks = tasks.filter((task) =>
        task.category?.some((cat) => cat.id === category.id)
      );
      counts[category.id] = categoryTasks.length;
    });

    // Sort categories based on count
    uniqueCategories.sort((a, b) => {
      const countA = counts[a.id] || 0;
      const countB = counts[b.id] || 0;
      return countB - countA;
    });

    setCategories(uniqueCategories);
    setCategoryCounts(counts);
  }, [user.tasks]);

  // const scrollContainerRef = useRef<HTMLDivElement>(null);
  // const [isDragging, setIsDragging] = useState(false);
  // const [startX, setStartX] = useState(0);
  // const [scrollLeft, setScrollLeft] = useState(0);

  // const handleMouseDown = (event: React.MouseEvent) => {
  //   if (scrollContainerRef.current) {
  //     setIsDragging(true);
  //     setStartX(event.pageX - scrollContainerRef.current.offsetLeft);
  //     setScrollLeft(scrollContainerRef.current.scrollLeft);
  //   }
  // };

  // const handleMouseMove = (event: React.MouseEvent) => {
  //   if (!isDragging || !scrollContainerRef.current) return;
  //   event.preventDefault();
  //   const x = event.pageX - scrollContainerRef.current.offsetLeft;
  //   const walk = (x - startX) * 2; // Adjust the scrolling speed as needed
  //   scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  // };

  // const handleMouseUp = () => {
  //   setIsDragging(false);
  // };

  return (
    <>
      <TaskMenu
        user={user}
        selectedTaskId={selectedTaskId}
        setEditModalOpen={setEditModalOpen}
        anchorEl={anchorEl}
        handleMarkAsDone={handleMarkAsDone}
        handlePin={handlePin}
        handleDeleteTask={handleDeleteTask}
        handleDuplicateTask={handleDuplicateTask}
        handleCloseMoreMenu={handleCloseMoreMenu}
      />
      <TasksContainer>
        {categories !== undefined &&
          categories?.length > 1 &&
          user.settings[0].enableCategories && (
            <CategoriesListContainer
            // ref={scrollContainerRef}
            // onMouseDown={handleMouseDown}
            // onMouseMove={handleMouseMove}
            // onMouseUp={handleMouseUp}
            >
              {categories?.map((cat) => (
                <CategoryChip
                  label={
                    <div>
                      <span style={{ fontWeight: "bold" }}>{cat.name}</span>
                      <span
                        style={{
                          fontSize: "14px",
                          opacity: 0.9,
                          marginLeft: "4px",
                        }}
                      >
                        ({categoryCounts[cat.id] || 0})
                      </span>
                    </div>
                  }
                  glow={user.settings[0].enableGlow}
                  backgroundclr={cat.color}
                  onClick={() =>
                    selectedCatId !== cat.id
                      ? setSelectedCatId(cat.id)
                      : setSelectedCatId(undefined)
                  }
                  key={cat.id}
                  list
                  onDelete={
                    selectedCatId === cat.id ? () => setSelectedCatId(undefined) : undefined
                  }
                  style={{
                    boxShadow: "none",
                    display:
                      selectedCatId === undefined || selectedCatId === cat.id
                        ? "inline-flex"
                        : "none",
                    padding: "20px 14px",
                    fontSize: "16px",
                  }}
                  avatar={
                    cat.emoji ? (
                      <Avatar
                        alt={cat.name}
                        sx={{
                          background: "transparent",
                          borderRadius: "0px",
                        }}
                      >
                        {cat.emoji &&
                          (user.emojisStyle === EmojiStyle.NATIVE ? (
                            <div>
                              <Emoji size={20} unified={cat.emoji} emojiStyle={EmojiStyle.NATIVE} />
                            </div>
                          ) : (
                            <Emoji size={24} unified={cat.emoji} emojiStyle={user.emojisStyle} />
                          ))}
                      </Avatar>
                    ) : (
                      <></>
                    )
                  }
                />
              ))}
            </CategoriesListContainer>
          )}

        {user.tasks.length !== 0 ? (
          reorderTasks(user.tasks).map((task) => (
            <TaskContainer
              key={task.id}
              backgroundColor={task.color}
              clr={getFontColorFromHex(task.color)}
              glow={user.settings[0].enableGlow}
              done={task.done}
              style={{
                filter:
                  selectedTaskId !== task.id && open && !isMobile
                    ? "blur(2px) opacity(75%)"
                    : "none",
                // transform: selectedTaskId === task.id && open ? "scale(1.02)" : "none",
              }}
            >
              {task.emoji || task.done ? (
                <EmojiContainer clr={getFontColorFromHex(task.color)}>
                  {task.done ? (
                    <Done fontSize="large" />
                  ) : user.emojisStyle === EmojiStyle.NATIVE ? (
                    <div>
                      <Emoji size={36} unified={task.emoji || ""} emojiStyle={EmojiStyle.NATIVE} />
                    </div>
                  ) : (
                    <Emoji size={48} unified={task.emoji || ""} emojiStyle={user.emojisStyle} />
                  )}
                </EmojiContainer>
              ) : null}
              <TaskInfo>
                {task.pinned && (
                  <Pinned>
                    <PushPin fontSize="small" /> &nbsp; Pinned
                  </Pinned>
                )}
                <TaskHeader>
                  <TaskName done={task.done}> {task.name}</TaskName>

                  <Tooltip
                    title={`Created at: ${new Date(task.date).toLocaleDateString()} • ${new Date(
                      task.date
                    ).toLocaleTimeString()}`}
                  >
                    <TaskDate>{formatDate(new Date(task.date))}</TaskDate>
                  </Tooltip>
                </TaskHeader>
                <TaskDescription done={task.done}>{task.description} </TaskDescription>

                {task.deadline && (
                  <TimeLeft done={task.done} timeUp={new Date() > new Date(task.deadline)}>
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
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "4px 6px",
                    justifyContent: "left",
                    alignItems: "center",
                  }}
                >
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
                                sx={{
                                  background: "transparent",
                                  borderRadius: "0px",
                                }}
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
                </div>
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
            </TaskContainer>
          ))
        ) : (
          <NoTasks>
            <b>You don't have any tasks yet</b>
            <br />
            Click on the <b>+</b> button to add one
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
          {user.tasks.find((task) => task.id === selectedTaskId)?.emoji !== undefined && (
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
                unified={user.tasks.find((task) => task.id === selectedTaskId)?.emoji || ""}
              />
            </p>
          )}
          <p>
            <b>Task Name:</b> {user.tasks.find((task) => task.id === selectedTaskId)?.name}
          </p>
          {user.tasks.find((task) => task.id === selectedTaskId)?.description !== undefined && (
            <p>
              <b>Task Description:</b>{" "}
              {user.tasks.find((task) => task.id === selectedTaskId)?.description}
            </p>
          )}

          {selectedTaskId !== null &&
            user.tasks.find((task) => task.id === selectedTaskId)?.category?.[0]?.name !==
              undefined && (
              <p>
                <b>Category:</b>{" "}
                {user.tasks
                  .find((task) => task.id === selectedTaskId)
                  ?.category?.map((cat) => cat.name)
                  .join(", ")}
              </p>
            )}
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
    </>
  );
};
