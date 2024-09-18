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

    it('should return "2 days ago" for a date 2 days in the past', () => {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      expect(timeAgo(twoDaysAgo)).toBe("2 days ago");
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
  });

  describe("calculateDateDifference", () => {
    it('should return the day of the week and "in 2 days" for a date 2 days in the future', () => {
      const twoDaysLater = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
      const result = calculateDateDifference(twoDaysLater);
      expect(result).toMatch(/^[A-Z][a-z]+ \(in 2 days\)$/);
    });

    it('should return "Not completed on time" for a past date', () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      expect(calculateDateDifference(pastDate)).toMatch(/^Not completed on time/);
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
