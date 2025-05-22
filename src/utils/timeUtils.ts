const MS_IN_MINUTE = 60 * 1000;
const MS_IN_HOUR = 60 * MS_IN_MINUTE;
const MS_IN_DAY = 24 * MS_IN_HOUR;

const getLocale = () => navigator.language || "en-US";

export const isSameDay = (date1: Date, date2: Date): boolean =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();

const getDayOfWeek = (date: Date): string =>
  date.toLocaleDateString(getLocale(), { weekday: "long" });

const formatTime = (date: Date): string =>
  date.toLocaleTimeString(getLocale(), { hour: "2-digit", minute: "2-digit" });

const formatDateOnly = (date: Date): string =>
  date.toLocaleDateString(getLocale(), {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

/**
 * Returns a human-readable relative time string (e.g. "in 2 days")
 */
export const timeAgo = (input: Date, lang = getLocale()): string => {
  const now = new Date();
  const date = new Date(input);
  const diff = now.getTime() - date.getTime();
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });

  if (Math.abs(diff) < MS_IN_MINUTE) {
    return rtf.format(-Math.floor(diff / 1000), "second");
  } else if (Math.abs(diff) < MS_IN_HOUR) {
    return rtf.format(-Math.floor(diff / MS_IN_MINUTE), "minute");
  } else if (Math.abs(diff) < MS_IN_DAY) {
    return rtf.format(-Math.floor(diff / MS_IN_HOUR), "hour");
  } else {
    return rtf.format(-Math.floor(diff / MS_IN_DAY), "day");
  }
};

export const formatDate = (input: Date): string => {
  const today = new Date();
  const date = new Date(input);
  const rtf = new Intl.RelativeTimeFormat(getLocale(), { numeric: "auto" });

  if (isSameDay(today, date)) {
    return `${rtf.format(0, "day")} ${formatTime(date)}`;
  }

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (isSameDay(yesterday, date)) {
    return `${rtf.format(-1, "day")} ${formatTime(date)}`;
  }

  const daysDiff = Math.floor((date.getTime() - today.getTime()) / MS_IN_DAY);

  if (daysDiff >= -6 && daysDiff <= 6) {
    return `${getDayOfWeek(date)} ${formatTime(date)}`;
  }

  return formatDateOnly(date);
};

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
  const now = new Date();
  const target = new Date(date);
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });

  // create dates at midnight for accurate day counting
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(target.getFullYear(), target.getMonth(), target.getDate());

  const dayDiff = Math.round((targetDate.getTime() - nowDate.getTime()) / (1000 * 60 * 60 * 24));

  // for past dates
  if (dayDiff < 0) {
    return `Not completed on time (${rtf.format(dayDiff, "day")})`;
  }

  // same day
  if (dayDiff === 0) {
    const msDiff = target.getTime() - now.getTime();
    const diffHours = Math.floor(msDiff / (1000 * 60 * 60));
    const diffMinutes = Math.floor(msDiff / (1000 * 60));

    if (diffHours > 0) {
      return rtf.format(diffHours, "hour");
    }
    return rtf.format(diffMinutes, "minute");
  }

  // tomorrow (1 day)
  if (dayDiff === 1) {
    return rtf.format(1, "day"); // tomorrow or localized equivalent
  }

  // within next 7 days (2-7 days)
  if (dayDiff >= 2 && dayDiff <= 7) {
    const dayOfWeek = target.toLocaleDateString(lang, { weekday: "long" });
    return `${dayOfWeek} (${rtf.format(dayDiff, "day")})`;
  }

  // beyond 7 days
  return rtf.format(dayDiff, "day");
};
