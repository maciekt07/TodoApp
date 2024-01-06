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
  storageType: StorageType = "localStorage"
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const storage = window[storageType];

  const [value, setValue] = useState<T>(() => {
    const storedValue = storage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
  });

  useEffect(() => {
    storage.setItem(key, JSON.stringify(value));
  }, [key, value, storage]);

  return [value, setValue];
}
