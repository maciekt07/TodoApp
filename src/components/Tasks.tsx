import type { Category, Task } from "../types/user";
import { ReactNode, useContext, useEffect, useState } from "react";
import { calculateDateDifference, formatDate, getFontColor, iOS } from "../utils";
import {
  CancelRounded,
  Close,
  Delete,
  DoneAll,
  DoneRounded,
  Link,
  MoreVert,
  PushPinRounded,
  RadioButtonChecked,
  Search,
} from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { CategoryBadge, EditTask, TaskMenu } from ".";
import {
  CategoriesListContainer,
  ColorPalette,
  DialogBtn,
  EmojiContainer,
  HighlightedText,
  NoTasks,
  Pinned,
  RadioChecked,
  RadioUnchecked,
  RingAlarm,
  SearchInput,
  SelectedTasksContainer,
  ShowMoreBtn,
  StyledRadio,
  TaskContainer,
  TaskDate,
  TaskDescription,
  TaskHeader,
  TaskInfo,
  TaskName,
  TasksContainer,
  TimeLeft,
} from "../styles";
import toast from "react-hot-toast";
import { useResponsiveDisplay } from "../hooks/useResponsiveDisplay";
import { UserContext } from "../contexts/UserContext";
import { useStorageState } from "../hooks/useStorageState";
import { DESCRIPTION_SHORT_LENGTH } from "../constants";
import { useCtrlS } from "../hooks/useCtrlS";
import { useTheme } from "@emotion/react";

/**
 * Component to display a list of tasks.
 */

export const Tasks: React.FC = () => {
  const { user, setUser } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [search, setSearch] = useStorageState<string>("", "search", "sessionStorage");
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set()); //FIXME: use storage state for set
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [multipleSelectedTasks, setMultipleSelectedTasks] = useStorageState<number[]>(
    [],
    "selectedTasks",
    "sessionStorage"
  );
  const [deleteSelectedOpen, setDeleteSelectedOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[] | undefined>(undefined);
  const [selectedCatId, setSelectedCatId] = useStorageState<number | undefined>(
    undefined,
    "selectedCategory",
    "sessionStorage"
  );
  const [categoryCounts, setCategoryCounts] = useState<{
    [categoryId: number]: number;
  }>({});

  const isMobile = useResponsiveDisplay();
  const theme = useTheme();
  useCtrlS();

  const listFormat = new Intl.ListFormat("en-US", {
    style: "long",
    type: "conjunction",
  });

  const selectedTask = user.tasks.find((task) => task.id === selectedTaskId) || ({} as Task);

  // Handler for clicking the more options button in a task
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, taskId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(taskId);
    if (!isMobile && !expandedTasks.has(taskId)) {
      toggleShowMore(taskId);
    }
  };

  const handleCloseMoreMenu = () => {
    setAnchorEl(null);
    document.body.style.overflow = "visible";
    if (selectedTaskId && !isMobile && expandedTasks.has(selectedTaskId)) {
      toggleShowMore(selectedTaskId);
    }
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
      toast.success((t) => (
        <div onClick={() => toast.dismiss(t.id)}>
          Deleted Task - <b>{user.tasks.find((task) => task.id === selectedTaskId)?.name}</b>
        </div>
      ));
    }
  };
  const cancelDeleteTask = () => {
    // Cancels the delete task operation
    setDeleteDialogOpen(false);
  };

  const handleSelectTask = (taskId: number) => {
    setAnchorEl(null);
    setMultipleSelectedTasks((prevSelectedTaskIds) => {
      if (prevSelectedTaskIds.includes(taskId)) {
        // Deselect the task if already selected
        return prevSelectedTaskIds.filter((id) => id !== taskId);
      } else {
        // Select the task if not selected
        return [...prevSelectedTaskIds, taskId];
      }
    });
  };

  const handleMarkSelectedAsDone = () => {
    setUser((prevUser) => ({
      ...prevUser,
      tasks: prevUser.tasks.map((task) => {
        if (multipleSelectedTasks.includes(task.id)) {
          // Mark the task as done if selected
          return { ...task, done: true };
        }
        return task;
      }),
    }));
    // Clear the selected task IDs after the operation
    setMultipleSelectedTasks([]);
  };

  const handleDeleteSelected = () => setDeleteSelectedOpen(true);

  useEffect(() => {
    const tasks: Task[] = reorderTasks(user.tasks);
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
  }, [user.tasks, search]);

  const toggleShowMore = (taskId: number) => {
    setExpandedTasks((prevExpandedTasks) => {
      const newSet = new Set(prevExpandedTasks);
      newSet.has(taskId) ? newSet.delete(taskId) : newSet.add(taskId);
      return newSet;
    });
  };

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
  const checkOverdueTasks = (tasks: Task[]) => {
    const overdueTasks = tasks.filter((task) => {
      return task.deadline && new Date() > new Date(task.deadline) && !task.done;
    });

    if (overdueTasks.length > 0) {
      const taskNames = overdueTasks.map((task) => task.name);

      toast.error(
        (t) => (
          <div
            translate="no"
            onClick={() => toast.dismiss(t.id)}
            style={{ wordBreak: "break-word" }}
          >
            <b translate="yes">Overdue task{overdueTasks.length > 1 && "s"}: </b>
            {listFormat.format(taskNames)}
          </div>
        ),
        {
          duration: 3400,
          icon: <RingAlarm animate sx={{ color: ColorPalette.red }} />,
          style: {
            borderColor: ColorPalette.red,
          },
        }
      );
    }
  };

  useEffect(() => {
    checkOverdueTasks(user.tasks);
  }, []);

  return (
    <>
      <TaskMenu
        selectedTaskId={selectedTaskId}
        selectedTasks={multipleSelectedTasks}
        setEditModalOpen={setEditModalOpen}
        anchorEl={anchorEl}
        handleDeleteTask={handleDeleteTask}
        handleCloseMoreMenu={handleCloseMoreMenu}
        handleSelectTask={handleSelectTask}
      />
      <TasksContainer>
        {user.tasks.length > 0 && (
          <SearchInput
            focused
            color="primary"
            placeholder="Search for task..."
            autoComplete="off"
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
          categories?.length > 0 &&
          user.settings[0].enableCategories && (
            <CategoriesListContainer>
              {categories?.map((cat) => (
                <CategoryBadge
                  key={cat.id}
                  category={cat}
                  emojiSizes={[24, 20]}
                  list={"true"}
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
                  onClick={() =>
                    selectedCatId !== cat.id
                      ? setSelectedCatId(cat.id)
                      : setSelectedCatId(undefined)
                  }
                  onDelete={
                    selectedCatId === cat.id ? () => setSelectedCatId(undefined) : undefined
                  }
                  sx={{
                    boxShadow: "none",
                    display:
                      selectedCatId === undefined || selectedCatId === cat.id
                        ? "inline-flex"
                        : "none",
                    p: "20px 14px",
                    fontSize: "16px",
                  }}
                />
              ))}
            </CategoriesListContainer>
          )}
        {multipleSelectedTasks.length > 0 && (
          <SelectedTasksContainer>
            <div>
              <h3 style={{ margin: 0, display: "flex", alignItems: "center" }}>
                <RadioButtonChecked /> &nbsp; Selected {multipleSelectedTasks.length} task
                {multipleSelectedTasks.length > 1 ? "s" : ""}
              </h3>
              <span style={{ fontSize: "14px", opacity: 0.8 }}>
                {listFormat.format(
                  multipleSelectedTasks
                    .map((taskId) => user.tasks.find((task) => task.id === taskId)?.name)
                    .filter((taskName) => taskName !== undefined) as string[]
                )}
              </span>
            </div>
            {/* TODO: add more features */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Tooltip title="Mark selected as done">
                <IconButton
                  sx={{ color: getFontColor(theme.secondary) }}
                  size="large"
                  onClick={handleMarkSelectedAsDone}
                >
                  <DoneAll />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete selected">
                <IconButton color="error" size="large" onClick={handleDeleteSelected}>
                  <Delete />
                </IconButton>
              </Tooltip>
              <Tooltip sx={{ color: getFontColor(theme.secondary) }} title="Cancel">
                <IconButton size="large" onClick={() => setMultipleSelectedTasks([])}>
                  <CancelRounded />
                </IconButton>
              </Tooltip>
            </div>
          </SelectedTasksContainer>
        )}
        {search && reorderTasks(user.tasks).length > 1 && user.tasks.length > 0 && (
          <div
            style={{
              textAlign: "center",
              fontSize: "18px",
              opacity: 0.9,
              marginTop: "12px",
            }}
          >
            <b>
              Found {reorderTasks(user.tasks).length} task
              {reorderTasks(user.tasks).length > 1 ? "s" : ""}
            </b>
          </div>
        )}
        {user.tasks.length !== 0 ? (
          reorderTasks(user.tasks).map((task) => (
            <TaskContainer
              key={task.id}
              id={task.id.toString()}
              backgroundColor={task.color}
              glow={user.settings[0].enableGlow}
              done={task.done}
              blur={selectedTaskId !== task.id && open && !isMobile}
            >
              {multipleSelectedTasks.length > 0 && (
                <StyledRadio
                  clr={getFontColor(task.color)}
                  checked={multipleSelectedTasks.includes(task.id)}
                  icon={<RadioUnchecked />}
                  checkedIcon={<RadioChecked />}
                  onChange={() => {
                    if (multipleSelectedTasks.includes(task.id)) {
                      setMultipleSelectedTasks((prevTasks) =>
                        prevTasks.filter((id) => id !== task.id)
                      );
                    } else {
                      handleSelectTask(task.id);
                    }
                  }}
                />
              )}
              {task.emoji || task.done ? (
                <EmojiContainer
                  clr={getFontColor(task.color)}
                  // onDoubleClick={() => handleSelectTask(task.id)}
                >
                  {task.done ? (
                    <DoneRounded fontSize="large" />
                  ) : user.emojisStyle === EmojiStyle.NATIVE ? (
                    <div>
                      <Emoji
                        size={iOS ? 48 : 36}
                        unified={task.emoji || ""}
                        emojiStyle={EmojiStyle.NATIVE}
                      />
                    </div>
                  ) : (
                    <Emoji size={48} unified={task.emoji || ""} emojiStyle={user.emojisStyle} />
                  )}
                </EmojiContainer>
              ) : null}
              <TaskInfo translate="no">
                {task.pinned && (
                  <Pinned translate="yes">
                    <PushPinRounded fontSize="small" /> &nbsp; Pinned
                  </Pinned>
                )}
                <TaskHeader>
                  <TaskName done={task.done}>{highlightMatchingText(task.name, search)}</TaskName>
                  <Tooltip
                    title={new Intl.DateTimeFormat(navigator.language, {
                      dateStyle: "full",
                      timeStyle: "medium",
                    }).format(new Date(task.date))}
                  >
                    <TaskDate>{formatDate(new Date(task.date))}</TaskDate>
                  </Tooltip>
                </TaskHeader>
                <TaskDescription done={task.done}>
                  {highlightMatchingText(
                    expandedTasks.has(task.id) || !task.description
                      ? task.description || ""
                      : task.description?.slice(0, DESCRIPTION_SHORT_LENGTH) || "",
                    search
                  )}
                  {(!open || task.id !== selectedTaskId || isMobile) &&
                    task.description &&
                    task.description.length > DESCRIPTION_SHORT_LENGTH && (
                      <ShowMoreBtn onClick={() => toggleShowMore(task.id)} clr={task.color}>
                        {expandedTasks.has(task.id) ? "Show less" : "Show more"}
                      </ShowMoreBtn>
                    )}
                </TaskDescription>
                {task.deadline && (
                  <TimeLeft done={task.done}>
                    <RingAlarm
                      fontSize="small"
                      animate={new Date() > new Date(task.deadline) && !task.done}
                      sx={{
                        color: `${getFontColor(task.color)} !important`,
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
                {task.sharedBy && (
                  <div style={{ opacity: 0.8, display: "flex", alignItems: "center", gap: "4px" }}>
                    <Link /> Shared by {task.sharedBy}
                  </div>
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
                    user.settings[0].enableCategories &&
                    task.category.map((category) => (
                      <div key={category.id}>
                        <CategoryBadge category={category} borderclr={getFontColor(task.color)} />
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
                sx={{ color: getFontColor(task.color) }}
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
          onSave={(editedTask) => {
            const updatedTasks = user.tasks.map((task) => {
              if (task.id === editedTask.id) {
                return {
                  ...task,
                  name: editedTask.name,
                  color: editedTask.color,
                  emoji: editedTask.emoji || undefined,
                  description: editedTask.description || undefined,
                  deadline: editedTask.deadline || undefined,
                  category: editedTask.category || undefined,
                  lastSave: new Date(),
                };
              }
              return task;
            });
            setUser((prevUser) => ({
              ...prevUser,
              tasks: updatedTasks,
            }));
            setEditModalOpen(false);
          }}
        />
      </TasksContainer>
      <Dialog open={deleteDialogOpen} onClose={cancelDeleteTask}>
        <DialogTitle>Are you sure you want to delete the task?</DialogTitle>
        <DialogContent>
          {selectedTask.emoji !== undefined && (
            <>
              {selectedTask.emoji && (
                <p
                  style={{
                    display: "flex",
                    justifyContent: "left",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <b>Emoji:</b>{" "}
                  <Emoji size={28} emojiStyle={user.emojisStyle} unified={selectedTask.emoji} />
                </p>
              )}
              <p>
                <b>Task Name:</b> {selectedTask.name}
              </p>
              {selectedTask.description && (
                <p>
                  <b>Task Description:</b> {selectedTask.description}
                </p>
              )}
              {selectedTask.category?.[0]?.name && (
                <p>
                  <b>{selectedTask.category.length > 1 ? "Categories" : "Category"}:</b>{" "}
                  {listFormat.format(selectedTask.category.map((cat) => cat.name))}
                </p>
              )}
            </>
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
      <Dialog open={deleteSelectedOpen}>
        <DialogTitle>Are you sure you want to delete selected tasks?</DialogTitle>
        <DialogContent>
          {listFormat.format(
            multipleSelectedTasks
              .map((taskId) => user.tasks.find((task) => task.id === taskId)?.name)
              .filter((taskName) => taskName !== undefined) as string[]
          )}
        </DialogContent>
        <DialogActions>
          <DialogBtn onClick={() => setDeleteSelectedOpen(false)} color="primary">
            Cancel
          </DialogBtn>
          <DialogBtn
            onClick={() => {
              setUser((prevUser) => ({
                ...prevUser,
                tasks: prevUser.tasks.filter((task) => !multipleSelectedTasks.includes(task.id)),
              }));
              // Clear the selected task IDs after the operation
              setMultipleSelectedTasks([]);
              setDeleteSelectedOpen(false);
            }}
            color="error"
          >
            Delete
          </DialogBtn>
        </DialogActions>
      </Dialog>
    </>
  );
};
