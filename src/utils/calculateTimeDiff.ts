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
    const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });
    return `On ${dayOfWeek} (${differenceDays} day${
      differenceDays !== 1 ? "s" : ""
    })`;
  } else {
    return `In ${differenceDays} days`;
  }
};

// const formatTime = (date: Date): string => {
//   return date.toLocaleTimeString();
// };
