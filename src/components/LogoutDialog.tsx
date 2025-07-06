import { Dialog, DialogActions, DialogContent } from "@mui/material";
import { CustomDialogTitle } from "./DialogTitle";
import { DialogBtn } from "../styles";
import { Logout } from "@mui/icons-material";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { defaultUser } from "../constants/defaultUser";
import { deleteProfilePictureFromDB, showToast } from "../utils";

interface LogoutDialogProps {
  open: boolean;
  onClose: () => void;
}

export function LogoutDialog({ open, onClose }: LogoutDialogProps) {
  const { setUser } = useContext(UserContext);
  const handleLogout = async () => {
    setUser(defaultUser);
    onClose();
    await deleteProfilePictureFromDB();
    showToast("You have been successfully logged out");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <CustomDialogTitle title="Logout Confirmation" onClose={onClose} icon={<Logout />} />
      <DialogContent>
        Are you sure you want to logout? <b>Your tasks will not be saved.</b>
      </DialogContent>
      <DialogActions>
        <DialogBtn onClick={onClose}>Cancel</DialogBtn>
        <DialogBtn onClick={handleLogout} color="error">
          <Logout /> &nbsp; Logout
        </DialogBtn>
      </DialogActions>
    </Dialog>
  );
}
