import { useTheme } from "@emotion/react";
import {
  CancelRounded,
  Close,
  Delete,
  DeleteRounded,
  DoneAll,
  DoneRounded,
  Link,
  MoreVert,
  PushPinRounded,
  RadioButtonChecked,
  RadioButtonChecked as RadioButtonCheckedIcon,
  Search,
} from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { useCallback, useContext, useEffect, useMemo, useState, memo, ReactNode, FC } from "react";
import { CategoryBadge, CustomDialogTitle, EditTask, TaskIcon, TaskMenu } from "..";
import { URL_REGEX } from "../../constants";
import { TaskContext } from "../../contexts/TaskContext";
import { UserContext } from "../../contexts/UserContext";
import { useCtrlS } from "../../hooks/useCtrlS";
import { useResponsiveDisplay } from "../../hooks/useResponsiveDisplay";
import { useStorageState } from "../../hooks/useStorageState";
import { DialogBtn } from "../../styles";
import { ColorPalette } from "../../theme/themeConfig";
import type { Category, Task, UUID } from "../../types/user";
import {
  calculateDateDifference,
  formatDate,
  getFontColor,
  showToast,
  systemInfo,
} from "../../utils";
import { RenderTaskDescription } from "./RenderTaskDescription";
import {
  CategoriesListContainer,
  EmojiContainer,
  NoTasks,
  Pinned,
  RadioChecked,
  RadioUnchecked,
  RingAlarm,
  SearchClear,
  SearchInput,
  SelectedTasksContainer,
  StyledRadio,
  TaskContainer,
  TaskDate,
  TaskDescription,
  TaskHeader,
  TaskInfo,
  TaskName,
  TasksContainer,
  TimeLeft,
} from "./tasks.styled";

/**
 * Component to display a list of tasks.
 */

// Memoized Task component to prevent rerendering all tasks when one changes
interface TaskItemProps {
  task: Task;
  handleClick: (event: React.MouseEvent<HTMLElement>, taskId: UUID) => void;
  selectedTaskId: UUID | null;
  open: boolean;
  isMobile: boolean;
  multipleSelectedTasks: UUID[];
  handleSelectTask: (taskId: UUID) => void;
  user: any;
  highlightMatchingText: (text: string) => ReactNode;
}

const TaskItem = memo<TaskItemProps>(
  ({
    task,
    handleClick,
    selectedTaskId,
    open,
    isMobile,
    multipleSelectedTasks,
    handleSelectTask,
    user,
    highlightMatchingText,
  }) => {
    const theme = useTheme();

    return (
      <TaskContainer
        key={task.id}
        id={task.id.toString()}
        onContextMenu={(e) => {
          e.preventDefault();
          handleClick(e, task.id);
        }}
        backgroundColor={task.color}
        glow={user.settings.enableGlow}
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
                // Directly manipulate a memoized callback instead
                handleSelectTask(task.id);
              } else {
                handleSelectTask(task.id);
              }
            }}
          />
        )}
        {task.emoji || task.done ? (
          <EmojiContainer clr={getFontColor(task.color)}>
            {task.done ? (
              <DoneRounded fontSize="large" />
            ) : (
              <Emoji
                size={
                  user.emojisStyle === EmojiStyle.NATIVE
                    ? systemInfo.os === "iOS" || systemInfo.os === "macOS"
                      ? 50
                      : 38
                    : 46
                }
                unified={task.emoji || ""}
                emojiStyle={user.emojisStyle}
                lazyLoad
              />
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
            <TaskName done={task.done}>{highlightMatchingText(task.name)}</TaskName>
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
            <RenderTaskDescription task={task} />
          </TaskDescription>

          {task.deadline && (
            <Tooltip
              title={new Intl.DateTimeFormat(navigator.language, {
                dateStyle: "full",
                timeStyle: "medium",
              }).format(new Date(task.deadline))}
              placement="bottom-start"
            >
              <TimeLeft done={task.done} translate="yes">
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
            </Tooltip>
          )}
          {task.sharedBy && (
            <div
              translate="yes"
              style={{ opacity: 0.8, display: "flex", alignItems: "center", gap: "4px" }}
            >
              <Link /> Shared by{" "}
              <span translate={task.sharedBy === "User" ? "yes" : "no"}>{task.sharedBy}</span>
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
              user.settings.enableCategories &&
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
    );
  },
);

// Memoized component for the search bar
const SearchBar = memo<{
  search: string;
  setSearch: (value: string) => void;
  orderedTasks: Task[];
  userTasks: Task[];
}>(({ search, setSearch, orderedTasks, userTasks }) => (
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
          <SearchClear
            color={orderedTasks.length === 0 && userTasks.length > 0 ? "error" : "default"}
            onClick={() => setSearch("")}
          >
            <Close
              sx={{
                color:
                  orderedTasks.length === 0 && userTasks.length > 0
                    ? `${ColorPalette.red} !important`
                    : "white",
                transition: ".3s all",
              }}
            />
          </SearchClear>
        </InputAdornment>
      ) : undefined,
    }}
  />
));

// Memoized component for categories list
const CategoriesList = memo<{
  categories: Category[];
  categoryCounts: { [categoryId: UUID]: number };
  selectedCatId: UUID | undefined;
  setSelectedCatId: (catId: UUID | undefined) => void;
}>(({ categories, categoryCounts, selectedCatId, setSelectedCatId }) => (
  <CategoriesListContainer>
    {categories.map((cat) => (
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
        sx={{
          boxShadow: "none",
          display: selectedCatId === undefined || selectedCatId === cat.id ? "inline-flex" : "none",
          p: "20px 14px",
          fontSize: "16px",
        }}
      />
    ))}
  </CategoriesListContainer>
));

// Memoized component for selected tasks bar
const SelectedTasksBar = memo<{
  multipleSelectedTasks: UUID[];
  user: any;
  listFormat: Intl.ListFormat;
  handleMarkSelectedAsDone: () => void;
  handleDeleteSelected: () => void;
  setMultipleSelectedTasks: (tasks: UUID[]) => void;
}>(
  ({
    multipleSelectedTasks,
    user,
    listFormat,
    handleMarkSelectedAsDone,
    handleDeleteSelected,
    setMultipleSelectedTasks,
  }) => {
    const theme = useTheme();

    return (
      <SelectedTasksContainer>
        <div>
          <h3>
            <RadioButtonCheckedIcon /> &nbsp; Selected {multipleSelectedTasks.length} task
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
    );
  },
);

// Extraction of search results notification
const SearchResultsNotification = memo<{
  search: string;
  orderedTasksLength: number;
  userTasksLength: number;
}>(({ search, orderedTasksLength, userTasksLength }) => {
  if (!search || orderedTasksLength <= 1 || userTasksLength === 0) return null;

  return (
    <div
      style={{
        textAlign: "center",
        fontSize: "18px",
        opacity: 0.9,
        marginTop: "12px",
      }}
    >
      <b>
        Found {orderedTasksLength} task
        {orderedTasksLength > 1 ? "s" : ""}
      </b>
    </div>
  );
});

// Extraction of no tasks found message
const NoTasksFound = memo<{
  search: string;
  orderedTasksLength: number;
  userTasksLength: number;
}>(({ search, orderedTasksLength, userTasksLength }) => {
  if (!search || orderedTasksLength !== 0 || userTasksLength === 0) return null;

  return (
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
  );
});

// Main TasksList component
export const TasksList: FC = memo(() => {
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

  const selectedTask = useMemo(() => {
    return user.tasks.find((task) => task.id === selectedTaskId) || ({} as Task);
  }, [user.tasks, selectedTaskId]);

  // Handler for clicking the more options button in a task - memoized
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>, taskId: UUID) => {
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
    },
    [setAnchorEl, setSelectedTaskId, setAnchorPosition, isMobile, expandedTasks, toggleShowMore],
  );

  // Memoize this computation-heavy function
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

      // Move done tasks to bottom if the setting is enabled
      if (user.settings?.doneToBottom) {
        const doneTasks = unpinnedTasks.filter((task) => task.done);
        const notDoneTasks = unpinnedTasks.filter((task) => !task.done);
        return [...pinnedTasks, ...notDoneTasks, ...doneTasks];
      }

      return [...pinnedTasks, ...unpinnedTasks];
    },
    [search, selectedCatId, user.settings],
  );

  // Memoize ordered tasks to prevent recalculation
  const orderedTasks = useMemo(() => reorderTasks(user.tasks), [user.tasks, reorderTasks]);

  // All handlers memoized with useCallback
  const confirmDeleteTask = useCallback(() => {
    if (selectedTaskId) {
      const updatedTasks = user.tasks.filter((task) => task.id !== selectedTaskId);
      setUser((prevUser) => ({
        ...prevUser,
        tasks: updatedTasks,
      }));

      setDeleteDialogOpen(false);
      showToast(
        <div>
          Deleted Task -{" "}
          <b translate="no">{user.tasks.find((task) => task.id === selectedTaskId)?.name}</b>
        </div>,
      );
    }
  }, [selectedTaskId, user.tasks, setUser, setDeleteDialogOpen]);

  const cancelDeleteTask = useCallback(() => {
    setDeleteDialogOpen(false);
  }, [setDeleteDialogOpen]);

  const handleMarkSelectedAsDone = useCallback(() => {
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
  }, [multipleSelectedTasks, setUser, setMultipleSelectedTasks]);

  const handleDeleteSelected = useCallback(() => setDeleteSelectedOpen(true), []);

  // Extract category calculation to useEffect with dependency on relevant state
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
  }, [user.tasks, search, orderedTasks]);

  // Memoize checkOverdueTasks to prevent recreation
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

  // Run on initial mount only
  useEffect(() => {
    checkOverdueTasks(user.tasks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler for deleting selected tasks - memoized
  const handleConfirmDeleteSelected = useCallback(() => {
    setUser((prevUser) => ({
      ...prevUser,
      tasks: prevUser.tasks.filter((task) => !multipleSelectedTasks.includes(task.id)),
    }));
    // Clear the selected task IDs after the operation
    setMultipleSelectedTasks([]);
    setDeleteSelectedOpen(false);
  }, [multipleSelectedTasks, setUser, setMultipleSelectedTasks]);

  return (
    <>
      <TaskMenu />
      <TasksContainer>
        {user.tasks.length > 0 && (
          <SearchBar
            search={search}
            setSearch={setSearch}
            orderedTasks={orderedTasks}
            userTasks={user.tasks}
          />
        )}

        {categories !== undefined && categories?.length > 0 && user.settings.enableCategories && (
          <CategoriesList
            categories={categories}
            categoryCounts={categoryCounts}
            selectedCatId={selectedCatId}
            setSelectedCatId={setSelectedCatId}
          />
        )}

        {multipleSelectedTasks.length > 0 && (
          <SelectedTasksBar
            multipleSelectedTasks={multipleSelectedTasks}
            user={user}
            listFormat={listFormat}
            handleMarkSelectedAsDone={handleMarkSelectedAsDone}
            handleDeleteSelected={handleDeleteSelected}
            setMultipleSelectedTasks={setMultipleSelectedTasks}
          />
        )}

        <SearchResultsNotification
          search={search}
          orderedTasksLength={orderedTasks.length}
          userTasksLength={user.tasks.length}
        />

        {user.tasks.length !== 0 ? (
          orderedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              handleClick={handleClick}
              selectedTaskId={selectedTaskId}
              open={open}
              isMobile={isMobile}
              multipleSelectedTasks={multipleSelectedTasks}
              handleSelectTask={handleSelectTask}
              user={user}
              highlightMatchingText={highlightMatchingText}
            />
          ))
        ) : (
          <NoTasks>
            <span>You don't have any tasks yet</span>
            <br />
            Click on the <span>+</span> button to add one
          </NoTasks>
        )}

        <NoTasksFound
          search={search}
          orderedTasksLength={orderedTasks.length}
          userTasksLength={user.tasks.length}
        />

        <EditTask
          open={editModalOpen}
          task={user.tasks.find((task) => task.id === selectedTaskId)}
          onClose={() => setEditModalOpen(false)}
        />
      </TasksContainer>

      <Dialog open={deleteDialogOpen} onClose={cancelDeleteTask}>
        <CustomDialogTitle
          title="Delete task"
          subTitle="Confirm to delete task"
          onClose={cancelDeleteTask}
          icon={<Delete />}
        />
        <DialogContent>
          {selectedTask !== undefined && (
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
                <b>Task Name:</b> <span translate="no">{selectedTask.name}</span>
              </p>
              {selectedTask.description && (
                <p>
                  <b>Task Description:</b>{" "}
                  <span translate="no">
                    {selectedTask.description.replace(URL_REGEX, "[link]")}
                  </span>
                </p>
              )}
              {selectedTask.category?.[0]?.name && (
                <p>
                  <b>{selectedTask.category.length > 1 ? "Categories" : "Category"}:</b>{" "}
                  <span translate="no">
                    {listFormat.format(selectedTask.category.map((cat) => cat.name))}
                  </span>
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
            <DeleteRounded /> &nbsp; Delete
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
          <DialogBtn onClick={handleConfirmDeleteSelected} color="error">
            Delete
          </DialogBtn>
        </DialogActions>
      </Dialog>
    </>
  );
});
