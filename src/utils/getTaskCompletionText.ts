export function getTaskCompletionText(completionPercentage: number): string {
  if (completionPercentage === 0) {
    return "No tasks completed yet. Keep going!";
  } else if (completionPercentage === 100) {
    return "Congratulations! All tasks completed!";
  } else if (completionPercentage >= 75) {
    return "You're making great progress!";
  } else if (completionPercentage >= 50) {
    return "You're halfway there! Keep it up!";
  } else if (completionPercentage >= 25) {
    return "You're making good progress. Keep going!";
  } else {
    return "You're just getting started. Keep pushing!";
  }
}
