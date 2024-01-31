import { useEffect } from "react";
import { Task } from "../types/user";
import { exportTasksToJson } from "../utils";

/**
 * Custom React hook that enables saving tasks to JSON when the user presses Ctrl + S.
 * @param {Task[]} tasks - The array of tasks to be exported to JSON.
 * @returns {void}
 */
export const useCtrlS = (tasks: Task[]): void => {
  // Check if the key combination is Ctrl + S
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.key === "s" || e.key === "S") && (e.ctrlKey || e.metaKey)) {
      // Prevent the default browser save dialog
      e.preventDefault();
      const userConfirmed = window.confirm("Do you want to save all tasks to JSON?");
      if (userConfirmed) {
        exportTasksToJson(tasks);
      }
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
};
