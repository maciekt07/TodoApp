import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { initColors } from "ntc-ts";
import { ORIGINAL_COLORS } from "ntc-ts";
import { UserContextProvider } from "./contexts/UserProvider.tsx";
import { registerSW } from "virtual:pwa-register";
import { showToast } from "./utils/showToast.tsx";
import toast from "react-hot-toast";
import { Button } from "@mui/material";
import { UpdateRounded } from "@mui/icons-material";

// initialize ntc colors
initColors(ORIGINAL_COLORS);

registerSW({
  onNeedRefresh() {
    // Show an alert to inform the user about the update
    toast(
      (t) => (
        <div>
          <div style={{ fontWeight: 700 }}>
            A new version of the app is available. Reload to update?
          </div>
          <div style={{ display: "flex", justifyContent: "left", gap: "8px", marginTop: "12px" }}>
            <Button fullWidth variant="contained" onClick={() => window.location.reload()}>
              <UpdateRounded /> &nbsp; Reload
            </Button>
            <Button fullWidth variant="outlined" onClick={() => toast.dismiss(t.id)}>
              Dismiss
            </Button>
          </div>
        </div>
      ),
      { duration: 9999999, style: { border: "none" } },
    );
  },
  onOfflineReady() {
    console.log("App is ready to work offline.");
    showToast("App is ready to work offline.", { type: "success", duration: 2000 });
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <UserContextProvider>
      <App />
    </UserContextProvider>
  </BrowserRouter>,
);
