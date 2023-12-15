import { Category, Task, UserProps } from "../types/user";
import { ReactNode, useEffect, useState } from "react";
import { calculateDateDifference, formatDate, getFontColorFromHex } from "../utils";
import {
  Alarm,
  Cancel,
  Close,
  Done,
  MoreVert,
  Pause,
  PlayArrow,
  PushPin,
  RecordVoiceOver,
  Search,
} from "@mui/icons-material";
import {
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { EditTask } from ".";
import {
  CategoriesListContainer,
  CategoryChip,
  ColorPalette,
  DialogBtn,
  EmojiContainer,
  HighlightedText,
  NoTasks,
  Pinned,
  SearchInput,
  TaskComponent,
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
import Marquee from "react-fast-marquee";

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

    // Filter tasks based on the search input
    const searchLower = search.toLowerCase();
    unpinnedTasks = unpinnedTasks.filter(
      (task) =>
        task.name.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower))
    );
    pinnedTasks = pinnedTasks.filter(
      (task) =>
        task.name.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower))
    );

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

  const handleReadAloud = () => {
    const selectedTask = user.tasks.find((task) => task.id === selectedTaskId);
    const voices = window.speechSynthesis.getVoices();
    const voiceName = voices.find((voice) => voice.name === user.settings[0].voice);
    const voiceVolume = user.settings[0].voiceVolume;
    const taskName = selectedTask?.name || "";
    const taskDescription = selectedTask?.description || "";
    const taskDate = formatDate(new Date(selectedTask?.date || ""));
    const taskDeadline = selectedTask?.deadline
      ? ". Task Deadline: " + calculateDateDifference(new Date(selectedTask.deadline) || "")
      : "";

    const textToRead = `${taskName}. ${taskDescription}. Date: ${taskDate}${taskDeadline}`;

    const utterThis: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(textToRead);

    if (voiceName) {
      utterThis.voice = voiceName;
    }

    if (voiceVolume) {
      utterThis.volume = voiceVolume;
    }

    setAnchorEl(null);
    const pauseSpeech = () => {
      window.speechSynthesis.pause();
    };

    const resumeSpeech = () => {
      window.speechSynthesis.resume();
    };

    const cancelSpeech = () => {
      window.speechSynthesis.cancel();
      toast.dismiss(SpeechToastId);
      setAnchorEl(null);
    };

    const SpeechToastId = toast(
      () => {
        const [isPlaying, setIsPlaying] = useState<boolean>(true);

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              touchAction: "none",
            }}
          >
            {/* FIXME: */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontWeight: 600,
              }}
            >
              <RecordVoiceOver /> &nbsp; Speaking: {selectedTask?.name}
            </span>

            <span style={{ marginTop: "10px", fontSize: "16px" }}>
              Voice: {utterThis.voice?.name || "Default"}
            </span>

            <div>
              {/* FIXME: */}
              <Marquee
                delay={0.6}
                play={isPlaying}
                // gradient
                // gradientColor="#14143166"
                // style={{
                //   borderRadius: "8px",
                // }}
              >
                <p style={{ margin: "6px 0" }}>{utterThis.text} &nbsp;</p>
              </Marquee>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "16px",
                gap: "8px",
              }}
            >
              {isPlaying ? (
                <IconButton
                  sx={{ color: "white" }}
                  onClick={() => {
                    pauseSpeech();
                    setIsPlaying(!isPlaying);
                  }}
                >
                  <Pause fontSize="large" />
                </IconButton>
              ) : (
                <IconButton
                  sx={{ color: "white" }}
                  onClick={() => {
                    resumeSpeech();
                    setIsPlaying(!isPlaying);
                  }}
                >
                  <PlayArrow fontSize="large" />
                </IconButton>
              )}

              <IconButton sx={{ color: "white" }} onClick={cancelSpeech}>
                <Cancel fontSize="large" />
              </IconButton>
            </div>
          </div>
        );
      },
      {
        duration: 999999999,
        style: {
          border: "1px solid #1b1d4eb7",
          WebkitBackdropFilter: "blur(10px)",
          backdropFilter: "blur(10px)",
        },
      }
    );

    // Set up event listener for the end of speech
    utterThis.onend = () => {
      // Close the menu
      setAnchorEl(null);
      // Hide the toast when speech ends
      toast.dismiss(SpeechToastId);
    };
    console.log(utterThis);
    if (voiceVolume > 0) {
      window.speechSynthesis.speak(utterThis);
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

  const [search, setSearch] = useState<string>("");
  const highlightMatchingText = (text: string, search: string): ReactNode => {
    if (!search) {
      return text;
    }

    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <HighlightedText key={index}>{part}</HighlightedText>
      ) : (
        part
      )
    );
  };

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
        handleReadAloud={handleReadAloud}
      />
      <TasksContainer>
        {user.tasks.length > 0 && (
          <SearchInput
            focused
            color="primary"
            placeholder="Search for task..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "white" }} />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton
                    sx={{
                      transition: ".3s all",
                      color:
                        reorderTasks(user.tasks).length === 0 && user.tasks.length > 0
                          ? ColorPalette.red
                          : "white",
                    }}
                    onClick={() => setSearch("")}
                  >
                    <Close />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            }}
          />
        )}
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
            <TaskComponent
              key={task.id}
              backgroundColor={task.color}
              clr={getFontColorFromHex(task.color)}
              glow={user.settings[0].enableGlow}
              done={task.done}
              blur={selectedTaskId !== task.id && open && !isMobile}
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
                  <TaskName done={task.done}>{highlightMatchingText(task.name, search)}</TaskName>

                  <Tooltip
                    title={`Created at: ${new Date(task.date).toLocaleDateString()} • ${new Date(
                      task.date
                    ).toLocaleTimeString()}`}
                  >
                    <TaskDate>{formatDate(new Date(task.date))}</TaskDate>
                  </Tooltip>
                </TaskHeader>
                <TaskDescription done={task.done}>
                  {highlightMatchingText(task.description || "", search)}
                </TaskDescription>

                {task.deadline && (
                  <TimeLeft done={task.done}>
                    <Alarm
                      fontSize="small"
                      sx={{
                        color:
                          new Date() > new Date(task.deadline) && !task.done
                            ? ColorPalette.red
                            : getFontColorFromHex(task.color),
                        filter:
                          new Date() > new Date(task.deadline) && !task.done
                            ? `drop-shadow(0 0 6px ${ColorPalette.red})`
                            : "none",
                      }}
                    />{" "}
                    &nbsp;
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
            </TaskComponent>
          ))
        ) : (
          <NoTasks>
            <b>You don't have any tasks yet</b>
            <br />
            Click on the <b>+</b> button to add one
          </NoTasks>
        )}
        {search && reorderTasks(user.tasks).length === 0 && user.tasks.length > 0 && (
          <div
            style={{
              textAlign: "center",
              fontSize: "18px",
              opacity: 0.9,
              marginTop: "18px",
            }}
          >
            <b>No tasks found</b>
            <br />
            Try searching with different keywords.
          </div>
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
