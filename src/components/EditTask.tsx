import { useState, useEffect, useContext, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Category, Task } from "../types/user";
import styled from "@emotion/styled";
import { DESCRIPTION_MAX_LENGTH, TASK_NAME_MAX_LENGTH } from "../constants";
import { ColorPalette, DialogBtn } from "../styles";
import { CategorySelect, ColorPicker, CustomEmojiPicker } from ".";
import { UserContext } from "../contexts/UserContext";
import { CancelRounded, EditCalendarRounded, SaveRounded } from "@mui/icons-material";
import { showToast, timeAgo } from "../utils";

interface EditTaskProps {
  open: boolean;
  task?: Task;
  onClose: () => void;
  onSave: (editedTask: Task) => void;
}

export const EditTask = ({ open, task, onClose, onSave }: EditTaskProps) => {
  const { user } = useContext(UserContext);
  const [editedTask, setEditedTask] = useState<Task | undefined>(task);
  const [emoji, setEmoji] = useState<string | undefined>();
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  const nameError = useMemo(
    () => (editedTask?.name ? editedTask.name.length > TASK_NAME_MAX_LENGTH : undefined),
    [editedTask?.name]
  );
  const descriptionError = useMemo(
    () =>
      editedTask?.description ? editedTask.description.length > DESCRIPTION_MAX_LENGTH : undefined,
    [editedTask?.description]
  );

  // const isMobile = useResponsiveDisplay(600);

  // Effect hook to update the editedTask with the selected emoji.
  useEffect(() => {
    setEditedTask((prevTask) => ({
      ...(prevTask as Task),
      emoji: emoji,
    }));
  }, [emoji]);

  // Effect hook to update the editedTask when the task prop changes.
  useEffect(() => {
    setEditedTask(task);
    setSelectedCategories(task?.category as Category[]);
  }, [task]);

  // Event handler for input changes in the form fields.
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Update the editedTask state with the changed value.
    setEditedTask((prevTask) => ({
      ...(prevTask as Task),
      [name]: value,
    }));
  };
  // Event handler for saving the edited task.
  const handleSave = () => {
    document.body.style.overflow = "auto";
    if (editedTask && !nameError && !descriptionError) {
      onSave(editedTask);
      showToast(
        <div>
          Task <b>{editedTask.name}</b> updated.
        </div>
      );
    }
  };

  const handleCancel = () => {
    onClose();
    setEditedTask(task);
    setSelectedCategories(task?.category as Category[]);
  };

  useEffect(() => {
    setEditedTask((prevTask) => ({
      ...(prevTask as Task),
      category: (selectedCategories as Category[]) || undefined,
    }));
  }, [selectedCategories]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (JSON.stringify(editedTask) !== JSON.stringify(task) && open) {
        const message = "You have unsaved changes. Are you sure you want to leave?";
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [editedTask, open, task]);

  return (
    <Dialog
      open={open}
      // fullScreen={isMobile}
      onClose={() => {
        onClose();
        // setEditedTask(task);
        // setSelectedCategories(task?.category as Category[]);
      }}
      PaperProps={{
        style: {
          // borderRadius: !isMobile ? "24px" : 0,
          borderRadius: "24px",
          padding: "12px",
          maxWidth: "600px",
        },
      }}
    >
      <DialogTitle
        sx={{
          justifyContent: "space-between",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span>Edit Task</span>
        {editedTask?.lastSave && (
          <Tooltip title={timeAgo(editedTask.lastSave)}>
            <LastEdit>
              <EditCalendarRounded sx={{ fontSize: "20px" }} /> Last Edited:{" "}
              {new Date(editedTask.lastSave).toLocaleDateString()}
              {" • "}
              {new Date(editedTask.lastSave).toLocaleTimeString()}
            </LastEdit>
          </Tooltip>
        )}
      </DialogTitle>
      <DialogContent>
        <CustomEmojiPicker
          emoji={editedTask?.emoji || undefined}
          setEmoji={setEmoji}
          color={editedTask?.color}
          width="350px"
        />
        <StyledInput
          label="Name"
          name="name"
          autoComplete="off"
          value={editedTask?.name || ""}
          onChange={handleInputChange}
          error={nameError || editedTask?.name === ""}
          helperText={
            editedTask?.name
              ? editedTask?.name.length === 0
                ? "Name is required"
                : editedTask?.name.length > TASK_NAME_MAX_LENGTH
                ? `Name is too long (maximum ${TASK_NAME_MAX_LENGTH} characters)`
                : `${editedTask?.name?.length}/${TASK_NAME_MAX_LENGTH}`
              : "Name is required"
          }
        />
        <StyledInput
          label="Description"
          name="description"
          autoComplete="off"
          value={editedTask?.description || ""}
          onChange={handleInputChange}
          multiline
          rows={4}
          margin="normal"
          error={descriptionError}
          helperText={
            editedTask?.description === "" || editedTask?.description === undefined
              ? undefined
              : descriptionError
              ? `Description is too long (maximum ${DESCRIPTION_MAX_LENGTH} characters)`
              : `${editedTask?.description?.length}/${DESCRIPTION_MAX_LENGTH}`
          }
        />

        <StyledInput
          label="Deadline date"
          name="deadline"
          type="datetime-local"
          value={editedTask?.deadline || ""}
          onChange={handleInputChange}
          defaultValue=""
          InputLabelProps={{ shrink: true }}
          sx={{
            colorScheme: "light",
            " & .MuiInputBase-root": {
              transition: ".3s all",
            },
          }}
          InputProps={{
            startAdornment: editedTask?.deadline ? (
              <InputAdornment position="start">
                <Tooltip title="Clear">
                  <IconButton
                    color="error"
                    onClick={() => {
                      setEditedTask((prevTask) => ({
                        ...(prevTask as Task),
                        deadline: undefined,
                      }));
                    }}
                  >
                    <CancelRounded />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ) : undefined,
          }}
        />
        {user.settings[0].enableCategories !== undefined && user.settings[0].enableCategories && (
          <CategorySelect
            fontColor={ColorPalette.fontDark}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "8px",
          }}
        >
          <ColorPicker
            width={"100%"}
            color={editedTask?.color || "#000000"}
            fontColor={ColorPalette.fontDark}
            onColorChange={(color) => {
              setEditedTask((prevTask) => ({
                ...(prevTask as Task),
                color: color,
              }));
            }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <DialogBtn onClick={handleCancel}>Cancel</DialogBtn>
        <DialogBtn
          onClick={handleSave}
          color="primary"
          disabled={
            nameError ||
            editedTask?.name === "" ||
            descriptionError ||
            nameError ||
            JSON.stringify(editedTask) === JSON.stringify(task)
          }
        >
          <SaveRounded /> &nbsp; Save
        </DialogBtn>
      </DialogActions>
    </Dialog>
  );
};

const StyledInput = styled(TextField)`
  margin: 14px 0;
  & .MuiInputBase-root {
    border-radius: 16px;
  }
`;
StyledInput.defaultProps = {
  fullWidth: true,
};

const LastEdit = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-style: italic;
  font-weight: 400;
  opacity: 0.8;
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;
