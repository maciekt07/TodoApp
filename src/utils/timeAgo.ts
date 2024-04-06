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
