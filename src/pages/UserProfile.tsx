import {
  Avatar,
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  AddAPhotoRounded,
  Delete,
  LinkRounded,
  Logout,
  SaveRounded,
  Settings,
  TodayRounded,
  UploadRounded,
} from "@mui/icons-material";
import { PROFILE_PICTURE_MAX_LENGTH, USER_NAME_MAX_LENGTH } from "../constants";
import { CustomDialogTitle, LogoutDialog, SettingsDialog, TopBar } from "../components";
import { DialogBtn, UserAvatar } from "../styles";
import { UserContext } from "../contexts/UserContext";
import { timeAgo, getFontColor, showToast, getProfilePicture, generateUUID } from "../utils";
import { ColorPalette } from "../theme/themeConfig";

const UserProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const { name, profilePicture, createdAt } = user;
  const [userName, setUserName] = useState<string>("");
  const [profilePictureURL, setProfilePictureURL] = useState<string>("");
  const [openChangeImage, setOpenChangeImage] = useState<boolean>(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);

  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

  useEffect(() => {
    const loadProfilePicture = async () => {
      const picture = await getProfilePicture(profilePicture);
      setAvatarSrc(picture);
    };
    loadProfilePicture();
  }, [profilePicture]);

  useEffect(() => {
    document.title = `Todo App - User ${name ? `(${name})` : ""}`;
  }, [name]);

  const handleSaveName = () => {
    if (userName.length <= USER_NAME_MAX_LENGTH && userName !== name) {
      setUser({ ...user, name: userName });
      showToast("Updated user name");
      setUserName("");
    }
  };

  const handleOpenImageDialog = () => {
    setOpenChangeImage(true);
  };
  const handleCloseImageDialog = () => {
    setOpenChangeImage(false);
    setProfilePictureURL("");
  };

  const handleSaveImageLink = () => {
    // TODO: remove image from indexedDB if it exists
    if (
      profilePictureURL.length <= PROFILE_PICTURE_MAX_LENGTH &&
      profilePictureURL.startsWith("https://")
    ) {
      handleCloseImageDialog();
      setProfilePictureURL("");
      setUser((prevUser) => ({
        ...prevUser,
        profilePicture: profilePictureURL,
      }));
      showToast("Changed profile picture.");
    }
  };

  useEffect(() => {
    // init IndexedDB
    const request = indexedDB.open("profilePictureDB", 1);

    request.onerror = () => {
      console.error("Error opening IndexedDB");
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("pictures")) {
        db.createObjectStore("pictures");
      }
    };
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please upload an image file.");
      return;
    }

    const maxFileSize = 6 * 1024 * 1024; //MB
    if (file.size > maxFileSize) {
      const formatMB = new Intl.NumberFormat("en-US", {
        style: "unit",
        unit: "megabyte",
        maximumFractionDigits: 2,
      });

      const fileSizeMB = file.size / (1024 * 1024);
      const maxSizeMB = maxFileSize / (1024 * 1024);

      showToast(
        `File size is too large (${formatMB.format(fileSizeMB)}/${formatMB.format(maxSizeMB)})`,
        { type: "error" },
      );
      return;
    }

    try {
      // convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // store in IndexedDB
      const request = indexedDB.open("profilePictureDB", 1);

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(["pictures"], "readwrite");
        const store = transaction.objectStore("pictures");

        const putRequest = store.put(base64, "profilePicture");

        putRequest.onsuccess = () => {
          setUser((prevUser) => ({
            ...prevUser,
            // we cant store base64 directly in localStorage because it may cause performance issues
            profilePicture: "LOCAL_FILE_" + generateUUID(), // add uuid so image would update
          }));

          handleCloseImageDialog();
          showToast(`Profile picture updated successfully.`);
        };

        putRequest.onerror = () => {
          showToast("Failed to save profile picture.");
        };
      };
    } catch (error) {
      console.error("Error uploading file:", error);
      showToast("Failed to upload profile picture.");
    }
  };

  const handleDeleteImage = () => {
    const request = indexedDB.open("profilePictureDB", 1);

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(["pictures"], "readwrite");
      const store = transaction.objectStore("pictures");

      const deleteRequest = store.delete("profilePicture");

      deleteRequest.onsuccess = () => {
        setUser({ ...user, profilePicture: null });
        handleCloseImageDialog();
        showToast("Deleted profile image.");
      };

      deleteRequest.onerror = () => {
        showToast("Failed to delete profile picture.");
      };
    };
  };

  return (
    <>
      <TopBar title="User Profile" />
      <Container>
        <Tooltip title="App Settings">
          <IconButton
            onClick={() => setOpenSettings(true)}
            aria-label="Settings"
            size="large"
            sx={{
              position: "absolute",
              top: "24px",
              right: "24px",
            }}
          >
            <Settings fontSize="large" />
          </IconButton>
        </Tooltip>
        <Tooltip title={profilePicture ? "Change profile picture" : "Add profile picture"}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <Avatar
                onClick={handleOpenImageDialog}
                sx={{
                  background: "#9c9c9c81",
                  backdropFilter: "blur(10px)",
                  cursor: "pointer",
                }}
              >
                <AddAPhotoRounded />
              </Avatar>
            }
          >
            <UserAvatar
              onClick={handleOpenImageDialog}
              src={avatarSrc || undefined}
              hasimage={profilePicture !== null}
              style={{ cursor: "pointer" }}
              size="96px"
            >
              {name ? name[0].toUpperCase() : undefined}
            </UserAvatar>
          </Badge>
        </Tooltip>
        <UserName translate={name ? "no" : "yes"}>{name || "User"}</UserName>
        <Tooltip
          title={new Intl.DateTimeFormat(navigator.language, {
            dateStyle: "full",
            timeStyle: "medium",
          }).format(new Date(createdAt))}
        >
          <CreatedAtDate>
            <TodayRounded fontSize="small" />
            &nbsp;Registered {timeAgo(createdAt)}
          </CreatedAtDate>
        </Tooltip>

        <TextField
          sx={{ width: "300px", marginTop: "8px" }}
          label={name === null ? "Add Name" : "Change Name"}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
          error={userName.length > USER_NAME_MAX_LENGTH || (userName === name && name !== "")}
          helperText={
            userName.length > USER_NAME_MAX_LENGTH
              ? `Name exceeds ${USER_NAME_MAX_LENGTH} characters`
              : userName.length > 0 && userName !== name
                ? `${userName.length}/${USER_NAME_MAX_LENGTH}`
                : userName === name && name !== ""
                  ? "New username matches old one."
                  : ""
          }
          autoComplete="given-name"
        />

        <SaveBtn
          onClick={handleSaveName}
          disabled={userName.length > USER_NAME_MAX_LENGTH || userName === name}
        >
          Save name
        </SaveBtn>
        <Button
          color="error"
          variant="outlined"
          sx={{ p: "12px 20px", borderRadius: "14px", marginTop: "8px" }}
          onClick={() => setOpenLogoutDialog(true)}
        >
          <Logout />
          &nbsp; Logout
        </Button>
      </Container>
      <Dialog open={openChangeImage} onClose={handleCloseImageDialog}>
        <CustomDialogTitle
          title="Profile Picture"
          subTitle="Change or delete profile picture"
          onClose={handleCloseImageDialog}
          icon={<AddAPhotoRounded />}
        />
        <DialogContent>
          <TextField
            label="Link to profile picture"
            placeholder="Enter link to profile picture..."
            sx={{ my: "8px", width: "100%" }}
            value={profilePictureURL}
            onChange={(e) => {
              setProfilePictureURL(e.target.value);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSaveImageLink()}
            error={profilePictureURL.length > PROFILE_PICTURE_MAX_LENGTH}
            helperText={
              profilePictureURL.length > PROFILE_PICTURE_MAX_LENGTH
                ? `URL is too long maximum ${PROFILE_PICTURE_MAX_LENGTH} characters`
                : ""
            }
            autoComplete="url"
            type="url"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkRounded />
                </InputAdornment>
              ),
            }}
          />

          <StyledDivider>
            <span style={{ opacity: 0.8 }}>or</span>
          </StyledDivider>

          <input
            accept="image/*"
            id="upload-pfp"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
          <label htmlFor="upload-pfp">
            <Button component="span" variant="contained" fullWidth sx={{ my: "8px" }}>
              <UploadRounded /> &nbsp; Upload from file
            </Button>
          </label>

          {profilePicture !== null && (
            <>
              <Divider sx={{ my: "12px" }} />
              <Button
                fullWidth
                onClick={handleDeleteImage}
                color="error"
                variant="outlined"
                sx={{ my: "8px" }}
              >
                <Delete /> &nbsp; Remove Profile Picture
              </Button>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <DialogBtn onClick={handleCloseImageDialog}>Cancel</DialogBtn>
          <DialogBtn
            disabled={
              profilePictureURL.length > PROFILE_PICTURE_MAX_LENGTH ||
              !profilePictureURL.startsWith("https://")
            }
            onClick={handleSaveImageLink}
          >
            <SaveRounded /> &nbsp; Save
          </DialogBtn>
        </DialogActions>
      </Dialog>
      <LogoutDialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)} />
      <SettingsDialog open={openSettings} onClose={() => setOpenSettings(false)} />
    </>
  );
};

export default UserProfile;

const Container = styled.div`
  margin: 0 auto;
  max-width: 400px;
  padding: 64px 38px;
  border-radius: 48px;
  box-shadow: 0px 4px 50px rgba(0, 0, 0, 0.25);
  background: ${({ theme }) => (theme.darkmode ? "#383838" : "#f5f5f5")};
  color: ${({ theme }) => (theme.darkmode ? ColorPalette.fontLight : ColorPalette.fontDark)};
  transition:
    border 0.3s,
    box-shadow 0.3s;
  border: 4px solid ${({ theme }) => theme.primary};
  box-shadow: 0 0 72px -1px ${({ theme }) => theme.primary + "bf"};
  display: flex;
  gap: 14px;
  flex-direction: column;
  align-items: center;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const SaveBtn = styled(Button)`
  width: 300px;
  font-weight: 600;
  border: none;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => getFontColor(theme.primary)};
  font-size: 18px;
  padding: 14px;
  border-radius: 16px;
  cursor: pointer;
  text-transform: capitalize;
  transition:
    background 0.3s,
    color 0.3s;
  &:hover {
    background: ${({ theme }) => theme.primary};
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
    color: white;
  }
`;

const UserName = styled.span`
  font-size: 20px;
  font-weight: 500;
`;

const CreatedAtDate = styled.span`
  display: flex;
  align-items: center;
  font-style: italic;
  font-weight: 400;
  opacity: 0.8;
  margin-top: -8px;
  margin-bottom: 2px;
  // fix for browser translate
  & font {
    margin: 0 1px;
  }
`;

const StyledDivider = styled(Divider)`
  &::before,
  &::after {
    border-color: ${({ theme }) => (theme.darkmode ? "#ffffff83" : "#00000083")};
  }
`;
