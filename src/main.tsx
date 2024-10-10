import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { initColors } from "ntc-ts";
import { ORIGINAL_COLORS } from "ntc-ts";
import { UserContextProvider } from "./contexts/UserProvider.tsx";
import { registerSW } from "virtual:pwa-register";
import { showToast } from "./utils/showToast.tsx";
import { updatePrompt } from "./utils/updatePrompt.tsx";

// initialize ntc colors
initColors(ORIGINAL_COLORS);

// Show a prompt to update the app when a new version is available
registerSW({
  onRegistered(r) {
    if (r) {
      updatePrompt(r);
    }
  },
  onOfflineReady() {
    showToast("App is ready to work offline.", { type: "success", duration: 2000 });
  },
});

// Listen for the `SKIP_WAITING` message and reload the page when the new SW takes over
navigator.serviceWorker?.addEventListener("controllerchange", () => {
  window.location.reload();
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <UserContextProvider>
      <App />
    </UserContextProvider>
  </BrowserRouter>,
);
