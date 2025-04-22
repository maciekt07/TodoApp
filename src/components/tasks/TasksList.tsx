import { useTheme } from "@emotion/react";
import {
  CancelRounded,
  Close,
  Delete,
  DeleteRounded,
  DoneAll,
  Search,
  RadioButtonChecked,
  MoreVert,
  ArrowDownward,
  ArrowUpward,
  Sort,
} from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  InputAdornment,
  Tooltip,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { useCallback, useContext, useEffect, useMemo, useState, memo } from "react";
import { CategoryBadge, CustomDialogTitle, EditTask, TaskItem } from "..";
import { TaskContext } from "../../contexts/TaskContext";
import { UserContext } from "../../contexts/UserContext";
import { useCtrlS } from "../../hooks/useCtrlS";
import { useResponsiveDisplay } from "../../hooks/useResponsiveDisplay";
import { useStorageState } from "../../hooks/useStorageState";
import { DialogBtn } from "../../styles";
import { ColorPalette } from "../../theme/themeConfig";
import type { Category, Task, UUID } from "../../types/user";
import { getFontColor, showToast } from "../../utils";
import {
  NoTasks,
  RingAlarm,
  SearchClear,
  SearchInput,
  SelectedTasksContainer,
  TasksContainer,
  CategoriesListContainer,
} from "./tasks.styled";
import { TaskMenu } from "./TaskMenu";
import { TaskIcon } from "../TaskIcon";

const TaskMenuButton = memo(
  ({ task, onClick }: { task: Task; onClick: (event: React.MouseEvent<HTMLElement>) => void }) => (
    <IconButton
      aria-label="Task Menu"
      aria-controls="task-menu"
      aria-haspopup="true"
      onClick={onClick}
      sx={{ color: getFontColor(task.color) }}
    >
      <MoreVert />
    </IconButton>
  ),
);

/**
 * Component to display a list of tasks.
 */
export const TasksList: React.FC = () => {
  const { user, setUser } = useContext(UserContext);
  const {
    selectedTaskId,
    setSelectedTaskId,
    anchorEl,
    setAnchorEl,
    setAnchorPosition,
    expandedTasks,
    toggleShowMore,
    search,
    setSearch,
    highlightMatchingText,
    multipleSelectedTasks,
    setMultipleSelectedTasks,
    handleSelectTask,
    editModalOpen,
    setEditModalOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
  } = useContext(TaskContext);
  const open = Boolean(anchorEl);

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const [deleteSelectedOpen, setDeleteSelectedOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[] | undefined>(undefined);
  const [selectedCatId, setSelectedCatId] = useStorageState<UUID | undefined>(
    undefined,
    "selectedCategory",
    "sessionStorage",
  );
  const [categoryCounts, setCategoryCounts] = useState<{
    [categoryId: UUID]: number;
  }>({});
  const isMobile = useResponsiveDisplay();
  const theme = useTheme();
  useCtrlS();

  const listFormat = useMemo(
    () =>
      new Intl.ListFormat("en-US", {
        style: "long",
        type: "conjunction",
      }),
    [],
  );

  const [sortBy, setSortBy] = useStorageState<string | null>(null, "taskSortBy", "localStorage");
  const [sortDirection, setSortDirection] = useStorageState<"asc" | "desc">(
    "asc",
    "taskSortDirection",
    "localStorage",
  );
  const [sortMenuAnchorEl, setSortMenuAnchorEl] = useState<null | HTMLElement>(null);
  const sortMenuOpen = Boolean(sortMenuAnchorEl);

  // Add these handler functions
  const handleSortMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSortMenuAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortMenuAnchorEl(null);
  };

  const handleSortChange = (sortOption: string) => {
    if (sortBy === sortOption) {
      // Toggle direction if clicking the same option
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new sort option with default ascending direction
      setSortBy(sortOption);
      setSortDirection("asc");
    }
    handleSortMenuClose();
  };

  // Handler for clicking the more options button in a task
  const handleClick = (event: React.MouseEvent<HTMLElement>, taskId: UUID) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(taskId);
    const target = event.target as HTMLElement;
    // Position the menu where the click event occurred
    if (target.tagName !== "BUTTON") {
      setAnchorPosition({
        top: event.clientY,
        left: event.clientX,
      });
    } else {
      setAnchorPosition(null);
    }
    if (!isMobile && !expandedTasks.has(taskId)) {
      toggleShowMore(taskId);
    }
  };

  const reorderTasks = useCallback(
    (tasks: Task[]): Task[] => {
      let pinnedTasks = tasks.filter((task) => task.pinned);
      let unpinnedTasks = tasks.filter((task) => !task.pinned);

      if (selectedCatId !== undefined) {
        const categoryFilter = (task: Task) =>
          task.category?.some((category) => category.id === selectedCatId) ?? false;
        unpinnedTasks = unpinnedTasks.filter(categoryFilter);
        pinnedTasks = pinnedTasks.filter(categoryFilter);
      }

      const searchLower = search.toLowerCase();
      const searchFilter = (task: Task) =>
        task.name.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower));
      unpinnedTasks = unpinnedTasks.filter(searchFilter);
      pinnedTasks = pinnedTasks.filter(searchFilter);

      if (sortBy) {
        const sortTasks = (tasksToSort: Task[]) => {
          return [...tasksToSort].sort((a, b) => {
            let comparison = 0;

            if (sortBy === "priority") {
              const priorityA = a.priority;
              const priorityB = b.priority;
              if (priorityA === "High") comparison = -1;
              else if (priorityB === "High") comparison = 1;
              else if (priorityA === "Medium" && priorityB === "Low") comparison = -1;
              else if (priorityA === "Low" && priorityB === "Medium") comparison = 1;
            } else if (sortBy === "startDate") {
              if (!a.startDate && !b.startDate) comparison = 0;
              else if (!a.startDate) comparison = 1;
              else if (!b.startDate) comparison = -1;
              else comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
            } else if (sortBy === "endDate") {
              if (!a.endDate && !b.endDate) comparison = 0;
              else if (!a.endDate) comparison = 1;
              else if (!b.endDate) comparison = -1;
              else comparison = new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
            }

            return sortDirection === "desc" ? -comparison : comparison;
          });
        };

        pinnedTasks = sortTasks(pinnedTasks);
        unpinnedTasks = sortTasks(unpinnedTasks);
      }

      if (user.settings?.doneToBottom) {
        const doneTasks = unpinnedTasks.filter((task) => task.done);
        const notDoneTasks = unpinnedTasks.filter((task) => !task.done);
        return [...pinnedTasks, ...notDoneTasks, ...doneTasks];
      }

      return [...pinnedTasks, ...unpinnedTasks];
    },
    [search, selectedCatId, user.settings, sortBy, sortDirection],
  );

  const orderedTasks = useMemo(() => reorderTasks(user.tasks), [user.tasks, reorderTasks]);

  const confirmDeleteTask = () => {
    if (selectedTaskId) {
      const updatedTasks = user.tasks.filter((task) => task.id !== selectedTaskId);
      setUser((prevUser) => ({
        ...prevUser,
        tasks: updatedTasks,
      }));

      setDeleteDialogOpen(false);
      showToast(
        <div>
          Deleted Task - <b translate="no">{taskToDelete?.name}</b>
        </div>,
      );
      setTaskToDelete(null);
    }
  };

  useEffect(() => {
    if (selectedTaskId && deleteDialogOpen) {
      const task = user.tasks.find((t) => t.id === selectedTaskId);
      setTaskToDelete(task || null);
    }
  }, [selectedTaskId, deleteDialogOpen, user.tasks]);

  const cancelDeleteTask = () => {
    // Cancels the delete task operation
    setDeleteDialogOpen(false);
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
    const tasks: Task[] = orderedTasks;
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
    const counts: { [categoryId: UUID]: number } = {};
    uniqueCategories.forEach((category) => {
      const categoryTasks = tasks.filter((task) =>
        task.category?.some((cat) => cat.id === category.id),
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
  }, [user.tasks, search, setCategories, setCategoryCounts, orderedTasks]);

  const checkOverdueTasks = useCallback(
    (tasks: Task[]) => {
      if (location.pathname === "/share") {
        return;
      }

      const overdueTasks = tasks.filter((task) => {
        return task.deadline && new Date() > new Date(task.deadline) && !task.done;
      });

      if (overdueTasks.length > 0) {
        const taskNames = overdueTasks.map((task) => task.name);

        showToast(
          <div translate="no" style={{ wordBreak: "break-word" }}>
            <b translate="yes">Overdue task{overdueTasks.length > 1 && "s"}: </b>
            {listFormat.format(taskNames)}
          </div>,
          {
            type: "error",
            disableVibrate: true,
            duration: 3400,
            icon: <RingAlarm animate sx={{ color: ColorPalette.red }} />,
            style: {
              borderColor: ColorPalette.red,
              boxShadow: user.settings.enableGlow ? `0 0 18px -8px ${ColorPalette.red}` : "none",
            },
          },
        );
      }
    },
    [listFormat, user.settings],
  );

  useEffect(() => {
    checkOverdueTasks(user.tasks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <TaskMenu />
      <TasksContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
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
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "white" }} />
                    </InputAdornment>
                  ),
                  endAdornment: search ? (
                    <InputAdornment position="end">
                      <SearchClear
                        color={
                          orderedTasks.length === 0 && user.tasks.length > 0 ? "error" : "default"
                        }
                        onClick={() => setSearch("")}
                      >
                        <Close
                          sx={{
                            color:
                              orderedTasks.length === 0 && user.tasks.length > 0
                                ? `${ColorPalette.red} !important`
                                : "white",
                            transition: ".3s all",
                          }}
                        />
                      </SearchClear>
                    </InputAdornment>
                  ) : undefined,
                },
              }}
              sx={{ flex: 1, marginRight: "10px" }}
            />
          )}

          {user.tasks.length > 0 && (
            <Tooltip title="Sort tasks">
              <Button
                variant="outlined"
                size="large"
                startIcon={<Sort />}
                endIcon={
                  sortBy ? sortDirection === "asc" ? <ArrowUpward /> : <ArrowDownward /> : null
                }
                onClick={handleSortMenuOpen}
                sx={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.3)",
                  minWidth: "120px",
                  ml: "20px",
                  justifyContent: "space-between",
                }}
              >
                {sortBy ? sortBy.charAt(0).toUpperCase() + sortBy.slice(1) : "Sort"}
              </Button>
            </Tooltip>
          )}

          <Menu
            anchorEl={sortMenuAnchorEl}
            open={sortMenuOpen}
            onClose={handleSortMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem
              onClick={() => handleSortChange("priority")}
              sx={{
                backgroundColor: sortBy === "priority" ? "rgba(25, 118, 210, 0.08)" : undefined,
                fontWeight: sortBy === "priority" ? "bold" : "normal",
              }}
            >
              Priority
              {sortBy === "priority" && (
                <span style={{ marginLeft: "8px" }}>{sortDirection === "asc" ? "↑" : "↓"}</span>
              )}
            </MenuItem>
            <MenuItem
              onClick={() => handleSortChange("startDate")}
              sx={{
                backgroundColor: sortBy === "startDate" ? "rgba(25, 118, 210, 0.08)" : undefined,
                fontWeight: sortBy === "startDate" ? "bold" : "normal",
              }}
            >
              Start Date
              {sortBy === "startDate" && (
                <span style={{ marginLeft: "8px" }}>{sortDirection === "asc" ? "↑" : "↓"}</span>
              )}
            </MenuItem>
            <MenuItem
              onClick={() => handleSortChange("endDate")}
              sx={{
                backgroundColor: sortBy === "endDate" ? "rgba(25, 118, 210, 0.08)" : undefined,
                fontWeight: sortBy === "endDate" ? "bold" : "normal",
              }}
            >
              End Date
              {sortBy === "endDate" && (
                <span style={{ marginLeft: "8px" }}>{sortDirection === "asc" ? "↑" : "↓"}</span>
              )}
            </MenuItem>
            {sortBy && (
              <MenuItem
                onClick={() => {
                  setSortBy(null);
                  handleSortMenuClose();
                }}
                sx={{ color: "red" }}
              >
                Clear Sort
              </MenuItem>
            )}
          </Menu>
        </div>
        {categories !== undefined && categories?.length > 0 && user.settings.enableCategories && (
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
                      ({categoryCounts[cat.id]})
                    </span>
                  </div>
                }
                onClick={() =>
                  selectedCatId !== cat.id ? setSelectedCatId(cat.id) : setSelectedCatId(undefined)
                }
                onDelete={selectedCatId === cat.id ? () => setSelectedCatId(undefined) : undefined}
                deleteIcon={<CancelRounded />}
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
              <h3>
                <RadioButtonChecked /> &nbsp; Selected {multipleSelectedTasks.length} task
                {multipleSelectedTasks.length > 1 ? "s" : ""}
              </h3>
              <span translate="no" style={{ fontSize: "14px", opacity: 0.8 }}>
                {listFormat.format(
                  multipleSelectedTasks
                    .map((taskId) => user.tasks.find((task) => task.id === taskId)?.name)
                    .filter((taskName) => taskName !== undefined) as string[],
                )}
              </span>
            </div>
            {/* TODO: add more features */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
        {search && orderedTasks.length > 1 && user.tasks.length > 0 && (
          <div
            style={{
              textAlign: "center",
              fontSize: "18px",
              opacity: 0.9,
              marginTop: "12px",
            }}
          >
            <b>
              Found {orderedTasks.length} task
              {orderedTasks.length > 1 ? "s" : ""}
            </b>
          </div>
        )}
        {user.tasks.length !== 0 ? (
          orderedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              features={{
                enableLinks: true,
                enableGlow: user.settings.enableGlow,
                enableSelection: true,
              }}
              selection={{
                selectedIds: multipleSelectedTasks,
                onSelect: handleSelectTask,
                onDeselect: (taskId) =>
                  setMultipleSelectedTasks((prevTasks) => prevTasks.filter((id) => id !== taskId)),
              }}
              onContextMenu={(e: React.MouseEvent<Element>) => {
                e.preventDefault();
                handleClick(e as unknown as React.MouseEvent<HTMLElement>, task.id);
              }}
              actions={
                <TaskMenuButton task={task} onClick={(event) => handleClick(event, task.id)} />
              }
              blur={selectedTaskId !== task.id && open && !isMobile}
              textHighlighter={highlightMatchingText}
            />
          ))
        ) : (
          <NoTasks>
            <span>You don't have any tasks yet</span>
            <br />
            Click on the <span>+</span> button to add one
          </NoTasks>
        )}
        {search && orderedTasks.length === 0 && user.tasks.length > 0 && (
          <div
            style={{
              textAlign: "center",
              fontSize: "20px",
              opacity: 0.9,
              marginTop: "18px",
            }}
          >
            <b>No tasks found</b>
            <br />
            Try searching with different keywords.
            <div style={{ marginTop: "14px" }}>
              <TaskIcon scale={0.8} />
            </div>
          </div>
        )}
        <EditTask
          open={editModalOpen}
          task={user.tasks.find((task) => task.id === selectedTaskId)}
          onClose={() => setEditModalOpen(false)}
        />
      </TasksContainer>
      <Dialog open={deleteDialogOpen} onClose={cancelDeleteTask}>
        <CustomDialogTitle
          title="Delete Task"
          subTitle="Are you sure you want to delete this task?"
          onClose={cancelDeleteTask}
          icon={<Delete />}
        />
        <DialogContent>
          {taskToDelete && (
            <TaskItem
              task={taskToDelete}
              features={{
                enableGlow: false,
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <DialogBtn onClick={cancelDeleteTask} color="primary">
            Cancel
          </DialogBtn>
          <DialogBtn onClick={confirmDeleteTask} color="error">
            <DeleteRounded /> &nbsp; Confirm Delete
          </DialogBtn>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteSelectedOpen}>
        <CustomDialogTitle
          title="Delete selected tasks"
          subTitle="Confirm to delete selected tasks"
          icon={<DeleteRounded />}
        />
        <DialogContent translate="no">
          {listFormat.format(
            multipleSelectedTasks
              .map((taskId) => user.tasks.find((task) => task.id === taskId)?.name)
              .filter((taskName) => taskName !== undefined) as string[],
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
