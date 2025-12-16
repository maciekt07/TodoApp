import { Dialog, DialogActions, DialogContent } from "@mui/material";
import { CustomDialogTitle } from "./DialogTitle";
import { DialogBtn } from "../styles";
import { Logout } from "@mui/icons-material";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { defaultUser } from "../constants/defaultUser";
import { deleteProfilePictureFromDB, showToast } from "../utils";
import { useTranslation } from "react-i18next";

interface LogoutDialogProps {
  open: boolean;
  onClose: () => void;
}

export function LogoutDialog({ open, onClose }: LogoutDialogProps) {
  const { setUser } = useContext(UserContext);
  const { t } = useTranslation();
  const handleLogout = async () => {
    setUser(defaultUser);
    onClose();
    await deleteProfilePictureFromDB();
    showToast(t("logout.success", { defaultValue: "You have been successfully logged out" }));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <CustomDialogTitle
        title={t("logout.title", { defaultValue: "Logout Confirmation" })}
        onClose={onClose}
        icon={<Logout />}
      />
      <DialogContent>
        {t("logout.confirmation", { defaultValue: "Are you sure you want to logout?" })}{" "}
        <b>{t("logout.note", { defaultValue: "Your tasks will not be saved." })}</b>
      </DialogContent>
      <DialogActions>
        <DialogBtn onClick={onClose}>{t("common.cancel", { defaultValue: "Cancel" })}</DialogBtn>
        <DialogBtn onClick={handleLogout} color="error">
          <Logout /> &nbsp; {t("logout.logoutBtn", { defaultValue: "Logout" })}
        </DialogBtn>
      </DialogActions>
    </Dialog>
  );
}
