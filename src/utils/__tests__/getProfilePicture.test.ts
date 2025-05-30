import { getProfilePictureFromDB } from "../profilePictureStorage";

function createMockIDBRequest<T>(result: T): IDBRequest<T> {
  const request = {
    onsuccess: null as ((this: IDBRequest<T>, ev: Event) => void) | null,
    onerror: null as ((this: IDBRequest<T>, ev: Event) => void) | null,
    readyState: "done" as const,
    source: null,
    transaction: null,
    result,
    error: null,
  };

  return request as unknown as IDBRequest<T>;
}

// util to fire onsuccess event
function triggerSuccess<T>(req: IDBRequest<T>, result: T) {
  const event = new Event("success");
  Object.defineProperty(req, "result", { value: result, configurable: true });
  req.onsuccess?.call(req, event);
}

describe("getProfilePicture", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    delete (globalThis as Record<string, unknown>).indexedDB;
  });

  it("returns null if profilePicture is null", async () => {
    expect(await getProfilePictureFromDB(null)).toBeNull();
  });

  it("returns profilePicture if it's not a local file", async () => {
    const url =
      "https://images.pexels.com/photos/2071882/pexels-photo-2071882.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";
    expect(await getProfilePictureFromDB(url)).toBe(url);
  });

  it("returns picture from IndexedDB if it's a local file", async () => {
    const mockPicture = "data:image/png;base64,sfdhfhdsdgsdgdsgssdggsdsdg";

    const getRequest = createMockIDBRequest<string | null>(mockPicture);

    const objectStore = {
      get: vi.fn().mockReturnValue(getRequest),
    };

    const transaction = {
      objectStore: vi.fn().mockReturnValue(objectStore),
    };

    const db = {
      transaction: vi.fn().mockReturnValue(transaction),
    };

    const openRequest: IDBOpenDBRequest = {
      onsuccess: null,
      onerror: null,
    } as IDBOpenDBRequest;

    const mockIndexedDB: IDBFactory = {
      open: vi.fn().mockReturnValue(openRequest),
      deleteDatabase: vi.fn(),
      cmp: vi.fn(),
      databases: vi.fn().mockResolvedValue([]),
    };

    globalThis.indexedDB = mockIndexedDB;

    // simulate open success and return db
    queueMicrotask(() => {
      Object.defineProperty(openRequest, "result", {
        value: db,
        configurable: true,
      });
      openRequest.onsuccess?.call(openRequest, {
        target: openRequest,
      } as unknown as Event);

      queueMicrotask(() => {
        triggerSuccess(getRequest, mockPicture);
      });
    });

    const result = await getProfilePictureFromDB("LOCAL_FILE::dfhdzhzdfhfd");
    expect(result).toBe(mockPicture);
  });

  it("throws if IndexedDB fails to open", async () => {
    const openRequest: IDBOpenDBRequest = {
      onsuccess: null,
      onerror: null,
    } as IDBOpenDBRequest;

    const mockIndexedDB: IDBFactory = {
      open: vi.fn().mockReturnValue(openRequest),
      deleteDatabase: vi.fn(),
      cmp: vi.fn(),
      databases: vi.fn().mockResolvedValue([]),
    };

    globalThis.indexedDB = mockIndexedDB;

    queueMicrotask(() => {
      openRequest.onerror?.call(openRequest, new Event("error"));
    });

    await expect(getProfilePictureFromDB("LOCAL_FILE::fail")).rejects.toThrow(
      "Failed to open IndexedDB",
    );
  });
});
