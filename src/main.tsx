import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { initColors } from "ntc-ts";
import { ORIGINAL_COLORS } from "ntc-ts";
import { UserContextProvider } from "./contexts/UserProvider.tsx";
import { registerSW } from "virtual:pwa-register";
import { showToast } from "./utils/showToast.tsx";
import { updatePrompt } from "./utils/updatePrompt.tsx";
import { CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import { TaskProvider } from "./contexts/TaskProvider.tsx";

// initialize ntc colors
initColors(ORIGINAL_COLORS);

const offlinePreparationCount = parseInt(
  // prevent toast from showing infinitely on older versions of the app
  localStorage.getItem("offlinePreparationCount") || "0",
  10,
);

if (
  offlinePreparationCount < 3 &&
  !localStorage.getItem("initialCachingComplete") &&
  process.env.NODE_ENV !== "development"
) {
  showToast("Preparing app for offline use...", {
    duration: Infinity,
    type: "blank",
    id: "initial-offline-preparation",
    icon: <CircularProgress size={20} thickness={4} />,
  });

  localStorage.setItem("offlinePreparationCount", (offlinePreparationCount + 1).toString());
}

// Show a prompt to update the app when a new version is available
registerSW({
  onRegistered(r) {
    if (r) {
      updatePrompt(r);
    }
  },
  onOfflineReady() {
    toast.dismiss("initial-offline-preparation");

    if (!localStorage.getItem("initialCachingComplete")) {
      showToast("App is ready to work offline.", { type: "success" });
      localStorage.setItem("initialCachingComplete", "true");
    }
  },
});

// Listen for the `SKIP_WAITING` message and reload the page when the new SW takes over
navigator.serviceWorker?.addEventListener("controllerchange", () => {
  window.location.reload();
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <UserContextProvider>
      <TaskProvider>
        <App />
      </TaskProvider>
    </UserContextProvider>
  </BrowserRouter>,
);
