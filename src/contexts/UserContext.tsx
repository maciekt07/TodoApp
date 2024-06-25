import { createContext } from "react";
import type { User } from "../types/user";
import { defaultUser } from "../constants/defaultUser";
import { useStorageState } from "../hooks/useStorageState";

interface UserProps {
  user: User; // User data
  setUser: React.Dispatch<React.SetStateAction<User>>; // Function to update user data
}

export const UserContext = createContext<UserProps>({ user: defaultUser, setUser: () => {} });

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useStorageState<User>(defaultUser, "user");
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
