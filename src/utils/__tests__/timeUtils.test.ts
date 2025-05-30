import { timeAgo, formatDate, calculateDateDifference } from "../timeUtils";

describe("Date Utility Functions", () => {
  beforeEach(() => {
    // Mock navigator.language
    vi.stubGlobal("navigator", { language: "en-US" });
  });

  describe("timeAgo", () => {
    it('should return "now" for recent dates', () => {
      const now = new Date();
      expect(timeAgo(now)).toBe("now");
    });
    it('should return "1 minute ago"', () => {
      const oneMinAgo = new Date(Date.now() - 60 * 1000);
      expect(timeAgo(oneMinAgo)).toBe("1 minute ago");
    });
    it('should return "2 hours ago"', () => {
      const minAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      expect(timeAgo(minAgo)).toBe("2 hours ago");
    });
    it('should return "2 days ago" for a date 2 days in the past', () => {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      expect(timeAgo(twoDaysAgo)).toBe("2 days ago");
    });
    it('should return "367 ago" for a date 367 days ago', () => {
      const oneYearAgo = new Date(Date.now() - 367 * 24 * 60 * 60 * 1000);
      expect(timeAgo(oneYearAgo)).toBe("367 days ago");
    });
  });

  describe("formatDate", () => {
    it('should return "today" for today\'s date', () => {
      const today = new Date();
      expect(formatDate(today)).toMatch(/^today \d{1,2}:\d{2} (AM|PM)$/);
    });

    it('should return "yesterday" for yesterday\'s date', () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      expect(formatDate(yesterday)).toMatch(/^yesterday \d{1,2}:\d{2} (AM|PM)$/);
    });
    it("should return full date for older dates", () => {
      const oldDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
      const result = formatDate(oldDate);
      expect(result).toMatch(/^\d{1,2}\/\d{1,2}\/\d{4}$/);
    });
  });

  describe("calculateDateDifference", () => {
    it('should return "now" or "in X minutes/hours" for a date within the same day', () => {
      const in10Min = new Date(Date.now() + 10 * 60 * 1000);
      const result = calculateDateDifference(in10Min);
      expect(result).toMatch(/in \d+ (minutes?|hours?)/);
    });

    it('should return "tomorrow" for a deadline on the next calendar day', () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 1, 0, 0); // 1AM tomorrow
      const result = calculateDateDifference(tomorrow);
      expect(result).toBe("tomorrow");
    });

    it('should return "Saturday (in 2 days)" for deadline 2 days ahead on calendar but under 48h', () => {
      const now = new Date("2025-05-22T21:00:00"); // Thu 9PM
      const saturdayMorning = new Date("2025-05-24T11:53:00"); // Sat 11:53AM
      vi.setSystemTime(now);
      const result = calculateDateDifference(saturdayMorning);
      expect(result).toMatch(/^Saturday \(in 2 days\)$/);
    });

    it('should return "Friday (in 2 days)" for exactly 48h from now but different day', () => {
      const now = new Date("2025-05-22T10:00:00"); // Thu 10AM
      const future = new Date("2025-05-24T10:00:00"); // Sat 10AM
      vi.setSystemTime(now);
      const result = calculateDateDifference(future);
      expect(result).toMatch(/^Saturday \(in 2 days\)$/);
    });

    it('should return "Not completed on time" for past date', () => {
      const pastDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const result = calculateDateDifference(pastDate);
      expect(result).toMatch(/^Not completed on time/);
    });

    it('should return correct "X days ago" even when time of day is late', () => {
      const now = new Date("2025-05-22T21:06:00"); // 9:06 PM
      const deadline = new Date("2025-05-15T23:56:00"); // May 15, 11:56 PM
      vi.setSystemTime(now);

      const result = calculateDateDifference(deadline);
      expect(result).toBe("Not completed on time (7 days ago)");
    });

    it('should return day of week and "in X days" for future date in 5 days', () => {
      const fiveDaysLater = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
      const result = calculateDateDifference(fiveDaysLater);
      expect(result).toMatch(/^[A-Z][a-z]+ \(in 5 days\)$/);
    });

    it('should return "in X days" for a date more than a week in the future', () => {
      const future = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
      const result = calculateDateDifference(future);
      expect(result).toBe("in 10 days");
    });

    // AM/PM BUG AND CALENDAR DAY COUNTING
    it("should correctly count calendar days: Thursday to Saturday = 2 days", () => {
      const now = new Date("2025-05-22T22:18:00"); // Thu 10:18 PM
      const deadline = new Date("2025-05-24T23:58:00"); // Sat 11:58 PM
      vi.setSystemTime(now);

      const result = calculateDateDifference(deadline);
      expect(result).toBe("Saturday (in 2 days)");
    });

    it("should correctly count calendar days: Thursday to Saturday AM = 2 days", () => {
      const now = new Date("2025-05-22T22:18:00"); // Thu 10:18 PM
      const deadline = new Date("2025-05-24T11:58:00"); // Sat 11:58 AM
      vi.setSystemTime(now);

      const result = calculateDateDifference(deadline);
      expect(result).toBe("Saturday (in 2 days)");
    });

    it("should correctly count calendar days: Thursday to Friday = 1 day (tomorrow)", () => {
      const now = new Date("2025-05-22T22:18:00"); // Thu 10:18 PM
      const deadline = new Date("2025-05-23T11:58:00"); // Fri 11:58 AM
      vi.setSystemTime(now);

      const result = calculateDateDifference(deadline);
      expect(result).toBe("tomorrow");
    });

    it("should handle edge case: very late night to early morning next day", () => {
      const now = new Date("2025-05-22T23:59:00"); // Thu 11:59 PM
      const deadline = new Date("2025-05-23T00:01:00"); // Fri 12:01 AM
      vi.setSystemTime(now);

      const result = calculateDateDifference(deadline);
      expect(result).toBe("tomorrow");
    });

    it("should handle Monday to Wednesday = 2 days", () => {
      const now = new Date("2025-05-19T14:00:00"); // Mon 2 PM
      const deadline = new Date("2025-05-21T09:00:00"); // Wed 9 AM
      vi.setSystemTime(now);

      const result = calculateDateDifference(deadline);
      expect(result).toBe("Wednesday (in 2 days)");
    });

    it("should handle same day deadlines with hours/minutes", () => {
      const now = new Date("2025-05-22T10:00:00"); // Thu 10 AM
      const deadline = new Date("2025-05-22T15:30:00"); // Thu 3:30 PM (same day)
      vi.setSystemTime(now);

      const result = calculateDateDifference(deadline);
      expect(result).toBe("in 5 hours");
    });
  });
});

describe("with Polish locale", () => {
  beforeEach(() => {
    // Mock navigator.language
    vi.stubGlobal("navigator", { language: "pl-PL" });
  });

  describe("timeAgo", () => {
    it('should return "teraz" for recent dates', () => {
      const now = new Date();
      expect(timeAgo(now)).toBe("teraz");
    });
  });

  describe("formatDate", () => {
    it('should return "dzisiaj" for today\'s date', () => {
      const today = new Date();
      expect(formatDate(today)).toMatch(/^dzisiaj \d{1,2}:\d{2}$/);
    });

    it('should return "wczoraj" for yesterday\'s date', () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      expect(formatDate(yesterday)).toMatch(/^wczoraj \d{1,2}:\d{2}$/);
    });
  });
});
