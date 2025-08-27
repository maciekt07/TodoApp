import { defaultUser } from "../constants/defaultUser";
import { useStorageState } from "../hooks/useStorageState";
import { User } from "../types/user";
import { UserContext } from "./UserContext";

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useStorageState<User>(defaultUser, "user");

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
