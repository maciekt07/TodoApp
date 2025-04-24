import { useState, useEffect } from "react";

type StorageType = "localStorage" | "sessionStorage";

/**
 * A custom React hook that returns a stateful value and a function to update it, and persists the value in storage.
 * @param {any} defaultValue - The default value for the state.
 * @param {string} key - The key under which the value will be stored.
 * @param {StorageType} storageType - The type of storage to use ("localStorage" or "sessionStorage").
 * @returns {[any, Function]} A tuple containing the current state value and a function to update it.
 * @example const [count, setCount] = useStorageState(1, "count", "localStorage");
 */
export function useStorageState<T>(
  defaultValue: T,
  key: string,
  storageType: StorageType = "localStorage",
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const isBrowser = typeof window !== "undefined";
  const storage = isBrowser ? window[storageType] : null;

  const [value, setValue] = useState<T>(() => {
    if (!isBrowser || !storage) return defaultValue;

    const storedValue = storage.getItem(key);
    return storedValue !== null && storedValue !== "undefined"
      ? JSON.parse(storedValue)
      : defaultValue;
  });

  useEffect(() => {
    if (!isBrowser || !storage) return;
    storage.setItem(key, JSON.stringify(value));
  }, [key, value, storage]);

  useEffect(() => {
    if (!isBrowser) return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null && event.key !== "") {
        setValue(JSON.parse(event.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [value, setValue];
}
