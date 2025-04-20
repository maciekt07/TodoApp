import { describe, it, expect, vi, beforeEach } from "vitest";

describe("systemInfo", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  const mockUserAgent = (ua: string) => {
    vi.stubGlobal("navigator", { userAgent: ua });
  };

  it("detects Windows and Chrome", async () => {
    mockUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
    );

    const { systemInfo } = await import("../getSystemInfo");
    expect(systemInfo.os).toBe("Windows");
    expect(systemInfo.browser).toBe("Chrome");
    expect(systemInfo.isAppleDevice).toBe(false);
  });

  it("detects macOS and Safari", async () => {
    mockUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15",
    );

    const { systemInfo } = await import("../getSystemInfo");
    expect(systemInfo.os).toBe("macOS");
    expect(systemInfo.browser).toBe("Safari");
    expect(systemInfo.isAppleDevice).toBe(true);
  });
  it("detects macOS and Firefox", async () => {
    mockUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 14.7; rv:137.0) Gecko/20100101 Firefox/137.0",
    );

    const { systemInfo } = await import("../getSystemInfo");
    expect(systemInfo.os).toBe("macOS");
    expect(systemInfo.browser).toBe("Firefox");
    expect(systemInfo.isAppleDevice).toBe(true);
  });
  it("detects iOS and Safari", async () => {
    mockUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1",
    );

    const { systemInfo } = await import("../getSystemInfo");
    expect(systemInfo.os).toBe("iOS");
    expect(systemInfo.browser).toBe("Safari");
    expect(systemInfo.isAppleDevice).toBe(true);
  });

  it("detects Windows and Firefox", async () => {
    mockUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0",
    );

    const { systemInfo } = await import("../getSystemInfo");
    expect(systemInfo.os).toBe("Windows");
    expect(systemInfo.browser).toBe("Firefox");
    expect(systemInfo.isAppleDevice).toBe(false);
  });

  it("detects Android and Chrome", async () => {
    mockUserAgent(
      "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.7049.100 Mobile Safari/537.36",
    );

    const { systemInfo } = await import("../getSystemInfo");
    expect(systemInfo.os).toBe("Android");
    expect(systemInfo.browser).toBe("Chrome");
    expect(systemInfo.isAppleDevice).toBe(false);
  });

  it("returns Unknown for garbage UA", async () => {
    mockUserAgent("fdhdfsggd");

    const { systemInfo } = await import("../getSystemInfo");
    expect(systemInfo.os).toBe("Unknown");
    expect(systemInfo.browser).toBe("Unknown");
    expect(systemInfo.isAppleDevice).toBe(false);
  });
});
