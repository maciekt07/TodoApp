import { Route, Routes } from "react-router-dom";
import { ReactElement } from "react";
import UserSettings from "./pages/UserSettings";
import Categories from "./pages/Categories";
import NotFound from "./pages/NotFound";
import AddTask from "./pages/AddTask";
import ImportExport from "./pages/ImportExport";
import Home from "./pages/Home";
import TaskDetails from "./pages/TaskDetails";
import SharePage from "./pages/Share";

const AppRouter = (): ReactElement => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/task/:id" element={<TaskDetails />} />
      <Route path="/share" element={<SharePage />} />
      <Route path="/add" element={<AddTask />} />
      <Route path="/user" element={<UserSettings />} />
      <Route path="/import-export" element={<ImportExport />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
