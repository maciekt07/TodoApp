import { useEffect } from "react";
import { TopBar } from "../components";
import { UserProps } from "../types/user";
import { useNavigate } from "react-router-dom";

//TODO: add option to add/delete categories
export const Categories = ({ user }: UserProps) => {
  const n = useNavigate();
  useEffect(() => {
    if (!user.enableCategories) {
      n("/");
    }
  }, []);
  return (
    <>
      <TopBar title="Categories" />
    </>
  );
};
