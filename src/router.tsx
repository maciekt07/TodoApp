import { Route, Routes } from "react-router-dom";
import React, { ReactElement } from "react";
import Loading from "./components/Loading";
const Home = React.lazy(() => import('./pages/Home'));
const TaskDetails = React.lazy(() => import('./pages/TaskDetails'));
const SharePage = React.lazy(() => import('./pages/Share'));
const AddTask = React.lazy(() => import('./pages/AddTask'));
const UserSettings = React.lazy(() => import('./pages/UserSettings'));
const ImportExport = React.lazy(() => import('./pages/ImportExport'));
const Categories = React.lazy(() => import('./pages/Categories'));
const Purge = React.lazy(() => import('./pages/Purge'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

const AppRouter = (): ReactElement => {
  return (
    <React.Suspense fallback={<Loading  />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/task/:id" element={<TaskDetails />} />
        <Route path="/share" element={<SharePage />} />
        <Route path="/add" element={<AddTask />} />
        <Route path="/user" element={<UserSettings />} />
        <Route path="/transfer" element={<ImportExport />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/purge" element={<Purge />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Suspense>
  );
};

export default AppRouter;
