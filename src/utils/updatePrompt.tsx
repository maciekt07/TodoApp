import { Button } from "@mui/material";
import { UpdateRounded } from "@mui/icons-material";
import toast from "react-hot-toast";

/**
 * Sets up a prompt to notify the user when a new version of the app is available.
 *
 * @param {ServiceWorkerRegistration} r - The service worker registration object.
 * @returns {void}
 */
export const updatePrompt = (r: ServiceWorkerRegistration): void => {
  r.addEventListener("updatefound", () => {
    const newWorker = r.installing;
    if (newWorker) {
      newWorker.addEventListener("statechange", () => {
        if (newWorker.state === "installed") {
          if (navigator.serviceWorker.controller) {
            toast(
              (t) => (
                <div>
                  <div style={{ fontWeight: 700 }}>
                    A new version of the app is available. Reload to update?
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "left",
                      gap: "8px",
                      marginTop: "12px",
                    }}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        newWorker.postMessage({ type: "SKIP_WAITING" });
                        toast.dismiss(t.id);
                      }}
                    >
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
          }
        }
      });
    }
  });
};
