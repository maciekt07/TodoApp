export function formatDate(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) {
    return `today at ${formatTime(date)}`;
  } else if (isSameDay(date, yesterday)) {
    return `yesterday at ${formatTime(date)}`;
  } else {
    return formatFullDate(date);
  }
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

function formatTime(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };

  return date.toLocaleTimeString([], options);
}

function formatFullDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString([], options);
}
