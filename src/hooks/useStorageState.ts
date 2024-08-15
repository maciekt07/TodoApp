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
  const storage = window[storageType];

  // Initialize state with the stored value or the default value
  const [value, setValue] = useState<T>(() => {
    const storedValue = storage.getItem(key);
    return storedValue !== null && storedValue !== undefined && storedValue !== "undefined"
      ? JSON.parse(storedValue)
      : defaultValue;
  });

  // Update storage whenever the key or value changes
  useEffect(() => {
    storage.setItem(key, JSON.stringify(value));
  }, [key, value, storage]);

  // This allows to synchronize localStorage between tabs in real time

  // Listen for storage events and update state if the key matches
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null && event.key !== "") {
        setValue(JSON.parse(event.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key]);

  // Return the state value and update function
  return [value, setValue];
}
