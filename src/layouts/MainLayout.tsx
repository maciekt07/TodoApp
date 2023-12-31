import { ReactNode } from "react";
import { BottomNav, ProfileAvatar } from "../components";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <ProfileAvatar />
      {children}
      <div style={{ marginTop: "128px" }} />
      <BottomNav />
    </>
  );
};
