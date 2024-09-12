/**
 * Converts a given date to a human-readable relative time string.
 *
 * @param {Date} date - The date to be converted.
 * @returns {string} A string representing the relative time using `Intl` format (e.g., "2 days ago").
 */
export const timeAgo = (date: Date, lang = navigator.language || "en-US"): string => {
  // Get the current date and time
  const now = new Date();
  date = new Date(date);
  // Calculate the time difference in seconds
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Create an Intl.RelativeTimeFormat instance with the user's language
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });

  // Determine the appropriate unit and format the result
  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, "second");
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return rtf.format(-minutes, "minute");
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return rtf.format(-hours, "hour");
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return rtf.format(-days, "day");
  }
};

/**
 * Formats a date into a human-readable string based on its proximity to the current date.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
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

/**
 * Calculates the difference between a given date and the current date.
 * @param {Date} date - The target date to calculate the difference from.
 * @param {string} [lang=navigator.language || "en-US"] - The language code used for formatting.
 * @returns {string} A string representing the calculated difference in `Intl` format.
 */
export const calculateDateDifference = (
  date: Date,
  lang: string = navigator.language || "en-US",
): string => {
  const currentDate = new Date();
  const targetDate = new Date(date);
  const difference = targetDate.getTime() - currentDate.getTime();
  const differenceDays = Math.floor(difference / (1000 * 60 * 60 * 24));
  const differenceHours = Math.floor(difference / (1000 * 60 * 60));
  const differenceMinutes = Math.floor(difference / (1000 * 60));
  const userLocale = lang;

  if (targetDate < currentDate) {
    return `Not completed on time (${timeAgo(targetDate, userLocale)})`;
  } else if (targetDate.toDateString() === currentDate.toDateString()) {
    return new Intl.RelativeTimeFormat(userLocale, { numeric: "auto" }).format(
      differenceHours > 0 ? differenceHours : differenceMinutes,
      differenceHours > 0 ? "hour" : "minute",
    );
  } else if (targetDate.getDate() === currentDate.getDate() + 1) {
    return new Intl.RelativeTimeFormat(userLocale, { numeric: "auto" }).format(1, "day");
  } else if (differenceDays <= 7) {
    const dayOfWeek = new Intl.DateTimeFormat(userLocale, { weekday: "long" }).format(date);
    return `${dayOfWeek} (${new Intl.RelativeTimeFormat(userLocale, { numeric: "auto" }).format(
      differenceDays,
      "day",
    )})`;
  } else {
    return new Intl.RelativeTimeFormat(userLocale, { numeric: "auto" }).format(
      differenceDays,
      "day",
    );
  }
};
