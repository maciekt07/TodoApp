import { ReactNode } from "react";
import { BottomNav, ProfileAvatar } from "../components";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <ProfileAvatar />
      {children}
      <div style={{ marginTop: "128px" }} />
      <BottomNav />
    </>
  );
};

export default MainLayout;
