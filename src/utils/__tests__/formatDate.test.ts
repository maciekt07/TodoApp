import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { formatDate } from "../formatDate";

describe("formatDate", () => {
  // Mock the navigator.language
  beforeAll(() => {
    vi.stubGlobal("navigator", { language: "en-US" });
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("should format today's date correctly", () => {
    const now = new Date();
    const result = formatDate(now);
    const expected = `${new Intl.RelativeTimeFormat(navigator.language, { numeric: "auto" }).format(0, "day")} ${now.toLocaleTimeString(navigator.language, { hour: "2-digit", minute: "2-digit" })}`;
    expect(result).toBe(expected);
  });

  it("should format yesterday's date correctly", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const result = formatDate(yesterday);
    const expected = `${new Intl.RelativeTimeFormat(navigator.language, { numeric: "auto" }).format(-1, "day")} ${yesterday.toLocaleTimeString(navigator.language, { hour: "2-digit", minute: "2-digit" })}`;
    expect(result).toBe(expected);
  });

  it("should format a date within the past week correctly", () => {
    const dateWithinWeek = new Date();
    dateWithinWeek.setDate(dateWithinWeek.getDate() - 3); // 3 days ago
    const result = formatDate(dateWithinWeek);
    const expected = `${dateWithinWeek.toLocaleDateString(navigator.language, { weekday: "long" })} ${dateWithinWeek.toLocaleTimeString(navigator.language, { hour: "2-digit", minute: "2-digit" })}`;
    expect(result).toBe(expected);
  });
  //FIXME: fix this test
  // it("should format a date older than a week correctly", () => {
  //   const olderDate = new Date();
  //   olderDate.setDate(olderDate.getDate() - 16); // 16 days ago
  //   const result = formatDate(olderDate);
  //   const expected = `${olderDate.toLocaleDateString(navigator.language, { weekday: "long" })} ${olderDate.toLocaleTimeString(navigator.language, { hour: "2-digit", minute: "2-digit" })}`;
  //   expect(result).toBe(expected);
  // });
  //FIXME: fix this test
  it("should format a date within the past week correctly in Polish", () => {
    vi.stubGlobal("navigator", { language: "pl-PL" }); // Stub navigator.language to Polish

    const dateWithinWeek = new Date();
    dateWithinWeek.setDate(dateWithinWeek.getDate() - 3); // 3 days ago
    const result = formatDate(dateWithinWeek);
    const expected = `${dateWithinWeek.toLocaleDateString("pl-PL", { weekday: "long" })} ${dateWithinWeek.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}`;

    expect(result).toBe(expected);

    vi.stubGlobal("navigator", { language: "en-US" }); // Reset navigator.language after the test
  });
});
