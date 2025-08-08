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
  MoveUpRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { useCallback, useContext, useEffect, useMemo, useState, memo, useRef } from "react";
import { CategoryBadge, CustomDialogTitle, EditTask, TaskItem } from "..";
import { TaskContext } from "../../contexts/TaskContext";
import { UserContext } from "../../contexts/UserContext";
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
  TaskActionContainer,
  TasksContainer,
  CategoriesListContainer,
  TaskNotFound,
} from "./tasks.styled";
import { TaskMenu } from "./TaskMenu";
import { TaskIcon } from "../TaskIcon";
import { useToasterStore } from "react-hot-toast";
import { TaskSort } from "./TaskSort";
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  DragOverlay,
  MeasuringStrategy,
  DragStartEvent,
  useSensors,
  useSensor,
  TouchSensor,
  MouseSensor,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import DisabledThemeProvider from "../../contexts/DisabledThemeProvider";

const TaskMenuButton = memo(
  ({ task, onClick }: { task: Task; onClick: (event: React.MouseEvent<HTMLElement>) => void }) => (
    <IconButton
      id="task-menu-button"
      aria-label="Task Menu"
      aria-controls="task-menu"
      aria-haspopup="true"
      aria-expanded={Boolean(task)}
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
    sortOption,
    moveMode,
    setMoveMode,
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
  const [activeDragId, setActiveDragId] = useState<UniqueIdentifier | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const isMobile = useResponsiveDisplay();
  const theme = useTheme();
  const { toasts } = useToasterStore();

  const listFormat = useMemo(
    () =>
      new Intl.ListFormat("en-US", {
        style: "long",
        type: "conjunction",
      }),
    [],
  );

  // Handler for clicking the more options button in a task
  const handleClick = (event: React.MouseEvent<HTMLElement>, taskId: UUID) => {
    const target = event.target as HTMLElement;

    // if clicking inside a task link, show native context menu and skip custom menu.
    if (target.closest("#task-description-link")) {
      return;
    }

    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(taskId);

    setAnchorPosition({
      top: event.clientY,
      left: event.clientX,
    });

    // if (!isMobile && !expandedTasks.includes(taskId)) {
    //   toggleShowMore(taskId);
    // }
  };

  // focus search input on ctrl + /
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const reorderTasks = useCallback(
    (tasks: Task[]): Task[] => {
      // Separate tasks into pinned and unpinned
      let pinnedTasks = tasks.filter((task) => task.pinned);
      let unpinnedTasks = tasks.filter((task) => !task.pinned);

      // Filter tasks based on the selected category
      if (selectedCatId !== undefined) {
        const categoryFilter = (task: Task) =>
          task.category?.some((category) => category.id === selectedCatId) ?? false;
        unpinnedTasks = unpinnedTasks.filter(categoryFilter);
        pinnedTasks = pinnedTasks.filter(categoryFilter);
      }

      // Filter tasks based on the search input
      const searchLower = search.toLowerCase();
      const searchFilter = (task: Task) =>
        task.name.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower));
      unpinnedTasks = unpinnedTasks.filter(searchFilter);
      pinnedTasks = pinnedTasks.filter(searchFilter);

      // Sort tasks based on the selected sort option
      const sortTasks = (tasks: Task[]) => {
        switch (sortOption) {
          case "dateCreated":
            return [...tasks].sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            );
          case "dueDate":
            return [...tasks].sort((a, b) => {
              if (!a.deadline) return 1;
              if (!b.deadline) return -1;
              return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
            });
          case "alphabetical":
            return [...tasks].sort((a, b) => a.name.localeCompare(b.name));
          case "custom":
            return [...tasks].sort((a, b) => {
              if (a.position != null && b.position != null) return a.position - b.position;
              if (a.position == null && b.position != null) return 1;
              if (a.position != null && b.position == null) return -1;
              return new Date(a.date).getTime() - new Date(b.date).getTime();
            });

          default:
            return tasks;
        }
      };

      unpinnedTasks = sortTasks(unpinnedTasks);
      pinnedTasks = sortTasks(pinnedTasks);

      // Move done tasks to bottom if the setting is enabled
      if (user.settings?.doneToBottom) {
        const doneTasks = unpinnedTasks.filter((task) => task.done);
        const notDoneTasks = unpinnedTasks.filter((task) => !task.done);
        return [...pinnedTasks, ...notDoneTasks, ...doneTasks];
      }

      return [...pinnedTasks, ...unpinnedTasks];
    },
    [search, selectedCatId, user.settings?.doneToBottom, sortOption],
  );

  const orderedTasks = useMemo(() => reorderTasks(user.tasks), [user.tasks, reorderTasks]);

  const confirmDeleteTask = () => {
    if (!selectedTaskId) {
      return;
    }
    const updatedTasks = user.tasks.filter((task) => task.id !== selectedTaskId);
    setUser((prevUser) => ({
      ...prevUser,
      tasks: updatedTasks,
    }));
    user.deletedTasks.push(selectedTaskId);
    setDeleteDialogOpen(false);
    showToast(
      <div>
        Deleted Task - <b translate="no">{taskToDelete?.name}</b>
      </div>,
    );
    setTaskToDelete(null);
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
          return { ...task, done: true, lastSave: new Date() };
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

    // sort categories by count (descending) then by name (ascending) if counts are equal
    uniqueCategories.sort((a, b) => {
      const countA = counts[a.id] || 0;
      const countB = counts[b.id] || 0;

      if (countB !== countA) {
        return countB - countA;
      }

      return (a.name || "").localeCompare(b.name || "");
    });

    setCategories(uniqueCategories);
    setCategoryCounts(counts);
  }, [user.tasks, search, setCategories, setCategoryCounts, orderedTasks]);

  const checkOverdueTasks = useCallback(
    (tasks: Task[]) => {
      if (location.pathname === "/share") {
        return;
      }

      const overdueTasks = tasks.filter(
        (task) => task.deadline && new Date() > new Date(task.deadline) && !task.done,
      );

      if (overdueTasks.length > 0) {
        const taskNames = overdueTasks.map((task) => task.name);

        showToast(
          <div translate="no" style={{ wordBreak: "break-word" }}>
            <b translate="yes">Overdue task{overdueTasks.length > 1 && "s"}: </b>
            {listFormat.format(taskNames)}
          </div>,
          {
            id: "overdue-tasks",
            type: "error",
            disableVibrate: true,
            preventDuplicate: true,
            visibleToasts: toasts,
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
    [listFormat, toasts, user.settings.enableGlow],
  );

  useEffect(() => {
    checkOverdueTasks(user.tasks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dndKitSensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = orderedTasks.findIndex((task) => task.id === active.id);
    const newIndex = orderedTasks.findIndex((task) => task.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    // calculate new positions for all tasks in the new order
    const newOrdered = arrayMove(orderedTasks, oldIndex, newIndex);
    // assign position as index
    const updatedTasks = user.tasks.map((task) => {
      const idx = newOrdered.findIndex((t) => t.id === task.id);
      return idx !== -1 ? { ...task, position: idx, lastSave: new Date() } : task;
    });
    setUser((prevUser) => ({
      ...prevUser,
      tasks: updatedTasks,
    }));
    requestAnimationFrame(() => {
      setActiveDragId(null);
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  return (
    <>
      <TaskMenu />
      <TasksContainer style={{ marginTop: user.settings.showProgressBar ? "0" : "24px" }}>
        {user.tasks.length > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: "8px" }}>
            <DisabledThemeProvider>
              <SearchInput
                inputRef={searchRef}
                color="primary"
                placeholder="Search for task..."
                autoComplete="off"
                value={search}
                disabled={moveMode}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: "white", opacity: moveMode ? 0.5 : undefined }} />
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
              />
              <TaskSort />
            </DisabledThemeProvider>
          </Box>
        )}
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
          <TaskActionContainer>
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
          </TaskActionContainer>
        )}
        {moveMode && (
          <TaskActionContainer>
            <div>
              <h3>
                <MoveUpRounded /> &nbsp; Move Mode Enabled
              </h3>
              <span>Organize tasks by dragging and dropping.</span>
            </div>
            <Button variant="contained" onClick={() => setMoveMode(false)}>
              Done
            </Button>
          </TaskActionContainer>
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
        {/* FIXME: dry */}
        {user.tasks.length !== 0 ? (
          moveMode ? (
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
              measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
              sensors={dndKitSensors}
            >
              <SortableContext
                items={orderedTasks.map((task) => task.id)}
                strategy={verticalListSortingStrategy}
              >
                {orderedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    features={{
                      enableLinks: true,
                      enableGlow: user.settings.enableGlow,
                      enableSelection: true,
                      enableMoveMode: true,
                    }}
                    selection={{
                      selectedIds: multipleSelectedTasks,
                      onSelect: handleSelectTask,
                      onDeselect: (taskId) =>
                        setMultipleSelectedTasks((prevTasks) =>
                          prevTasks.filter((id) => id !== taskId),
                        ),
                    }}
                    onContextMenu={(e: React.MouseEvent<Element>) => {
                      handleClick(e as unknown as React.MouseEvent<HTMLElement>, task.id);
                    }}
                    actions={
                      <TaskMenuButton
                        task={task}
                        onClick={(event) => handleClick(event, task.id)}
                      />
                    }
                    blur={selectedTaskId !== task.id && open && !isMobile}
                  />
                ))}
              </SortableContext>
              <DragOverlay
                dropAnimation={{
                  duration: 250,
                  easing: "ease-in-out",
                }}
              >
                {/* DRAG PREVIEW */}
                {activeDragId ? (
                  <TaskItem
                    task={orderedTasks.find((t) => t.id === activeDragId)!}
                    features={{
                      enableLinks: true,
                      enableGlow: user.settings.enableGlow,
                      enableSelection: false,
                      enableMoveMode: true,
                    }}
                    blur={false}
                    actions={
                      <TaskMenuButton
                        task={orderedTasks.find((t) => t.id === activeDragId)!}
                        onClick={(event) =>
                          handleClick(event, orderedTasks.find((t) => t.id === activeDragId)!.id)
                        }
                      />
                    }
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
          ) : (
            orderedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                features={{
                  enableLinks: true,
                  enableGlow: user.settings.enableGlow,
                  enableSelection: true,
                  enableMoveMode: true,
                }}
                selection={{
                  selectedIds: multipleSelectedTasks,
                  onSelect: handleSelectTask,
                  onDeselect: (taskId) =>
                    setMultipleSelectedTasks((prevTasks) =>
                      prevTasks.filter((id) => id !== taskId),
                    ),
                }}
                onContextMenu={(e: React.MouseEvent<Element>) => {
                  handleClick(e as unknown as React.MouseEvent<HTMLElement>, task.id);
                }}
                actions={
                  <TaskMenuButton task={task} onClick={(event) => handleClick(event, task.id)} />
                }
                blur={selectedTaskId !== task.id && open && !isMobile}
                textHighlighter={highlightMatchingText}
              />
            ))
          )
        ) : (
          <NoTasks>
            <span>You don't have any tasks yet</span>
            <br />
            Click on the <span>+</span> button to add one
          </NoTasks>
        )}
        {search && orderedTasks.length === 0 && user.tasks.length > 0 ? (
          <TaskNotFound>
            <b>No tasks found</b>
            <br />
            Try searching with different keywords.
            <div style={{ marginTop: "14px" }}>
              <TaskIcon scale={0.8} />
            </div>
          </TaskNotFound>
        ) : null}
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
                deletedTasks: [
                  ...(prevUser.deletedTasks || []),
                  ...multipleSelectedTasks.filter((id) => !prevUser.deletedTasks?.includes(id)),
                ],
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
