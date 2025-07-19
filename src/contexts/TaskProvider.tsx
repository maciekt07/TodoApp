import { ReactNode, useState, useCallback, useMemo, useContext } from "react";
import { Category, SortOption, UUID } from "../types/user";
import { useStorageState } from "../hooks/useStorageState";
import { HighlightedText } from "../components/tasks/tasks.styled";
import { TaskContext, TaskContextType } from "./TaskContext";
import { UserContext } from "../contexts/UserContext";

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { user, setUser } = useContext(UserContext);

  const [selectedTaskId, setSelectedTaskId] = useState<UUID | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);
  const [expandedTasks, setExpandedTasks] = useStorageState<UUID[]>(
    [],
    "expandedTasks",
    "sessionStorage",
  );
  const [multipleSelectedTasks, setMultipleSelectedTasks] = useStorageState<UUID[]>(
    [],
    "selectedTasks",
    "sessionStorage",
  );
  const [search, setSearch] = useStorageState<string>("", "search", "sessionStorage");
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);

  const [moveMode, setMoveMode] = useStorageState<boolean>(false, "moveMode", "sessionStorage");

  const sortOption = user.settings.sortOption;
  const setSortOption = useCallback(
    (option: SortOption) => {
      setUser((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          sortOption: option,
        },
      }));
    },
    [setUser],
  );

  const toggleShowMore = useCallback(
    (taskId: UUID) => {
      setExpandedTasks((prevExpandedTasks) => {
        if (prevExpandedTasks.includes(taskId)) {
          return prevExpandedTasks.filter((id) => id !== taskId);
        } else {
          return [...prevExpandedTasks, taskId];
        }
      });
    },
    [setExpandedTasks],
  );

  const handleSelectTask = useCallback(
    (taskId: UUID) => {
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
    },
    [setMultipleSelectedTasks],
  );

  // Memoize this function since it's used in render
  const highlightMatchingText = useCallback(
    (text: string) => {
      if (!search) {
        return text;
      }

      const parts = text.split(new RegExp(`(${search})`, "gi"));
      return parts.map((part, index) =>
        part.toLowerCase() === search.toLowerCase() ? (
          <HighlightedText key={index}>{part}</HighlightedText>
        ) : (
          part
        ),
      );
    },
    [search],
  );

  const handleDeleteTask = useCallback(() => {
    // Opens the delete task dialog
    if (selectedTaskId) {
      setDeleteDialogOpen(true);
    }
  }, [selectedTaskId]);

  const handleCloseMoreMenu = useCallback(() => {
    setAnchorEl(null);
    document.body.style.overflow = "visible";
    // if (selectedTaskId && !isMobile && expandedTasks.includes(selectedTaskId)) {
    //   toggleShowMore(selectedTaskId);
    // }
  }, []);

  const updateCategory = useCallback(
    (patch: Partial<Category>) => {
      setUser((prev) => {
        const updatedCategories = prev.categories.map((c) =>
          c.id === patch.id ? { ...c, ...patch } : c,
        );

        const updatedTasks = prev.tasks.map((task) => {
          const updatedCategoryList = task.category?.map((c) =>
            c.id === patch.id ? { ...c, ...patch } : c,
          );

          return { ...task, category: updatedCategoryList };
        });

        return {
          ...prev,
          categories: updatedCategories,
          tasks: updatedTasks,
        };
      });
    },
    [setUser],
  );

  // Memoize the context value to prevent recreation on every render
  const contextValue = useMemo<TaskContextType>(
    () => ({
      selectedTaskId,
      setSelectedTaskId,
      anchorEl,
      setAnchorEl,
      anchorPosition,
      setAnchorPosition,
      expandedTasks,
      setExpandedTasks,
      toggleShowMore,
      search,
      setSearch,
      highlightMatchingText,
      multipleSelectedTasks,
      setMultipleSelectedTasks,
      handleSelectTask,
      editModalOpen,
      setEditModalOpen,
      handleDeleteTask,
      deleteDialogOpen,
      setDeleteDialogOpen,
      handleCloseMoreMenu,
      sortOption,
      setSortOption,
      sortAnchorEl,
      setSortAnchorEl,
      moveMode,
      setMoveMode,
      updateCategory,
    }),
    [
      selectedTaskId,
      anchorEl,
      anchorPosition,
      expandedTasks,
      setExpandedTasks,
      toggleShowMore,
      search,
      setSearch,
      highlightMatchingText,
      multipleSelectedTasks,
      setMultipleSelectedTasks,
      handleSelectTask,
      editModalOpen,
      handleDeleteTask,
      deleteDialogOpen,
      handleCloseMoreMenu,
      sortOption,
      setSortOption,
      sortAnchorEl,
      moveMode,
      setMoveMode,
      updateCategory,
    ],
  );

  return <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>;
};
