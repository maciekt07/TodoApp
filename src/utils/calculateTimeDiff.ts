export const calculateDateDifference = (date: Date): string => {
  const currentDate = new Date();
  const targetDate = new Date(date);

  const difference = targetDate.getTime() - currentDate.getTime();
  const differenceDays = Math.floor(difference / (1000 * 60 * 60 * 24));
  const differenceHours = Math.floor(difference / (1000 * 60 * 60));
  const differenceMinutes = Math.floor(difference / (1000 * 60));

  const userLocale = navigator.language || "en-US";

  if (targetDate < currentDate) {
    return "Not completed on time";
  } else if (targetDate.toDateString() === currentDate.toDateString()) {
    if (differenceHours > 0) {
      return new Intl.RelativeTimeFormat(userLocale, { numeric: "auto" }).format(
        differenceHours,
        "hour"
      );
    } else if (differenceMinutes > 0) {
      return new Intl.RelativeTimeFormat(userLocale, { numeric: "auto" }).format(
        differenceMinutes,
        "minute"
      );
    } else {
      return new Intl.RelativeTimeFormat(userLocale, { numeric: "auto" }).format(
        differenceMinutes,
        "minute"
      );
    }
  } else if (targetDate.getDate() === currentDate.getDate() + 1) {
    return new Intl.RelativeTimeFormat(userLocale, { numeric: "auto" }).format(1, "day");
  } else if (differenceDays <= 7) {
    const dayOfWeek = new Intl.DateTimeFormat(userLocale, { weekday: "long" }).format(date);
    return `${dayOfWeek} (${new Intl.RelativeTimeFormat(userLocale, { numeric: "auto" }).format(
      differenceDays,
      "day"
    )})`;
  } else {
    return new Intl.RelativeTimeFormat(userLocale, { numeric: "auto" }).format(
      differenceDays,
      "day"
    );
  }
};
