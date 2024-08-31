import { describe, it, expect, vi, afterAll, beforeAll } from "vitest";
import { timeAgo } from "../timeAgo";

describe("timeAgo", () => {
  const now = new Date();
  // Mock the navigator.language
  beforeAll(() => {
    vi.stubGlobal("navigator", { language: "en-US" });
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('should return "now" for the current time', () => {
    const result = timeAgo(now);
    expect(result).toBe("now");
  });

  it('should return "1 minute ago" for a time 1 minute ago', () => {
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
    const result = timeAgo(oneMinuteAgo);
    expect(result).toBe("1 minute ago");
  });

  it('should return "2 hours ago" for a time 2 hours ago', () => {
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const result = timeAgo(twoHoursAgo);
    expect(result).toBe("2 hours ago");
  });

  it('should return "3 days ago" for a time 3 days ago', () => {
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const result = timeAgo(threeDaysAgo);
    expect(result).toBe("3 days ago");
  });

  it('should return "150 days ago" for a time 5 months ago', () => {
    const fiveMonthsAgo = new Date(now.getTime() - 5 * 30 * 24 * 60 * 60 * 1000);
    const result = timeAgo(fiveMonthsAgo);
    expect(result).toBe("150 days ago");
  });

  it('should return "730 days ago" for a time 2 years ago', () => {
    const twoYearsAgo = new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000);
    const result = timeAgo(twoYearsAgo);
    expect(result).toBe("730 days ago");
  });

  it("should handle different locales correctly", () => {
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
    const result = timeAgo(oneMinuteAgo, "pl-PL"); // example for Polish locale
    expect(result).toBe("1 minutę temu");
  });
});
