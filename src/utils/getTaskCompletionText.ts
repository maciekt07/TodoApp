/**
 * Returns a task completion message based on the completion percentage.
 * @param {number} completionPercentage - The completion percentage of tasks.
 * @returns {string} A task completion message.
 */
export const getTaskCompletionText = (completionPercentage: number): string => {
  switch (true) {
    case completionPercentage === 0:
      return "No tasks completed yet. Keep going!";
    case completionPercentage === 100:
      return "Congratulations! All tasks completed!";
    case completionPercentage >= 75:
      return "Almost there!";
    case completionPercentage >= 50:
      return "You're halfway there! Keep it up!";
    case completionPercentage >= 25:
      return "You're making good progress.";
    default:
      return "You're just getting started.";
  }
};
