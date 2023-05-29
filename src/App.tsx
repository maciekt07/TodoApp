import { useStorageState } from "./hooks/useStorageState";
import { Route, Routes } from "react-router-dom";
import { defaultUser } from "./constants/defaultUser";
import { User } from "./types/user";
import { Home } from "./pages/Home";
import { AddTask } from "./pages/AddTask";
import { GlobalStyles, MuiTheme } from "./styles";
import { UserSettings } from "./pages/UserSettings";
import { ThemeProvider } from "@mui/material";
import { NotFount } from "./pages/NotFount";

function App() {
  const [user, setUser] = useStorageState<User>(defaultUser, "user");

  return (
    <>
      <ThemeProvider theme={MuiTheme}>
        <GlobalStyles />
        <Routes>
          <Route path="/" element={<Home user={user} setUser={setUser} />} />
          <Route
            path="/add"
            element={<AddTask user={user} setUser={setUser} />}
          />
          <Route
            path="/user"
            element={<UserSettings user={user} setUser={setUser} />}
          />
          <Route path="*" element={<NotFount />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
