export const formatDate = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
  const oneWeek = 7 * oneDay; // One week in milliseconds

  const timeDifference = date.getTime() - today.getTime();

  const rtf = new Intl.RelativeTimeFormat(navigator.language, { numeric: "auto" });

  if (isSameDay(date, today)) {
    return rtf.format(0, "day") + ` ${formatTime(date)}`;
  } else if (isSameDay(date, yesterday)) {
    return rtf.format(-1, "day") + ` ${formatTime(date)}`;
  } else if (timeDifference > -oneWeek) {
    return `${getDayOfWeek(date)} ${formatTime(date)}`;
  } else {
    return formatDateOnly(date);
  }
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString(navigator.language, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateOnly = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return date.toLocaleDateString(navigator.language, options);
};

const getDayOfWeek = (date: Date): string =>
  date.toLocaleDateString(navigator.language, { weekday: "long" });
