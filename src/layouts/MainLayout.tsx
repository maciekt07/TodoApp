import { ReactNode } from "react";
import { BottomNav, ProfileAvatar } from "../components";
import { UserProps } from "../types/user";

interface MainLayoutProps extends UserProps {
  children: ReactNode;
}

export const MainLayout = ({ children, user, setUser }: MainLayoutProps) => {
  return (
    <>
      <ProfileAvatar user={user} setUser={setUser} />
      {children}
      <div style={{ marginTop: "128px" }} />
      <BottomNav user={user} />
    </>
  );
};
