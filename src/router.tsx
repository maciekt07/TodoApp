import { Route, Routes } from "react-router-dom";
import { UserProps } from "./types/user";
import { UserSettings } from "./pages/UserSettings";
import { Categories } from "./pages/Categories";
import { NotFound } from "./pages/NotFound";
import { AddTask } from "./pages/AddTask";
import { ImportExport } from "./pages/ImportExport";
import { Home } from "./pages/Home";
import { TaskDetails } from "./pages/TaskDetails";

export const AppRouter = ({ user, setUser }: UserProps): JSX.Element => {
  const userProps = { user, setUser };

  return (
    <Routes>
      <Route path="/" element={<Home {...userProps} />} />
      <Route path="/task/:id" element={<TaskDetails {...userProps} />} />
      <Route path="/add" element={<AddTask {...userProps} />} />
      <Route path="/user" element={<UserSettings {...userProps} />} />
      <Route path="/import-export" element={<ImportExport {...userProps} />} />
      <Route path="/categories" element={<Categories {...userProps} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
