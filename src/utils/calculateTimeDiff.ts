/**
 * Calculates the difference between a given date and the current date.
 * @param {Date} date - The target date.
 * @returns {string} - A string indicating the date difference.
 */
export const calculateDateDifference = (date: Date): string => {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const targetDay = date.getDate();
  const difference = date.getTime() - currentDate.getTime();
  const differenceDays = Math.floor(difference / (1000 * 60 * 60 * 24)) + 1;

  if (date < currentDate) {
    return "Task not completed on time";
  } else if (targetDay === currentDay) {
    return "Today";
  } else if (targetDay === currentDay + 1) {
    return "Tomorrow";
  } else if (differenceDays <= 7) {
    // "en-US"
    const dayOfWeek = date.toLocaleString(navigator.language, {
      weekday: "long",
    });
    return `On ${dayOfWeek} (${differenceDays} day${
      differenceDays !== 1 ? "s" : ""
    })`;
  } else {
    return `In ${differenceDays} days`;
  }
};
