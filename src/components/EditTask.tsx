import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Badge,
  Typography,
} from "@mui/material";
import { Task, User } from "../types/user";
import EmojiPicker, { Emoji } from "emoji-picker-react";
import styled from "@emotion/styled";
import { AddReaction, Edit } from "@mui/icons-material";
import { DESCRIPTION_MAX_LENGTH, TASK_NAME_MAX_LENGTH } from "../constants";
import { DialogBtn } from "../styles";
interface EditTaskProps {
  open: boolean;
  task?: Task;
  onClose: () => void;
  onSave: (editedTask: Task) => void;
  user: User;
}
//TODO: add option to change category
export const EditTask = ({
  open,
  task,
  onClose,
  onSave,
  user,
}: EditTaskProps) => {
  const [editedTask, setEditedTask] = React.useState<Task | undefined>(task);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  React.useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "name" && value.length > TASK_NAME_MAX_LENGTH) {
      setNameError(true);
    } else {
      setNameError(false);
    }

    if (name === "description" && value.length > DESCRIPTION_MAX_LENGTH) {
      setDescriptionError(true);
    } else {
      setDescriptionError(false);
    }

    setEditedTask((prevTask) => ({
      ...(prevTask as Task),
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (editedTask && !nameError && !descriptionError) {
      onSave(editedTask);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ style: { borderRadius: "24px", padding: "12px" } }}
    >
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <EmojiContaier>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <Avatar
                sx={{
                  background: "#9c9c9c81",
                  backdropFilter: "blur(6px)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setShowEmojiPicker(!showEmojiPicker);
                }}
              >
                <Edit />
              </Avatar>
            }
          >
            <Avatar
              onClick={() => {
                setShowEmojiPicker(!showEmojiPicker);
              }}
              sx={{
                width: "96px",
                height: "96px",
                background: editedTask?.color || "",
                cursor: "pointer",
              }}
            >
              {/* {editedTask?.emoji ? (
              <Emoji size={64} unified={editedTask?.emoji || ""} />
              )} */}
              {editedTask?.emoji ? (
                <Emoji
                  size={64}
                  emojiStyle={user.emojisStyle}
                  unified={editedTask?.emoji || ""}
                />
              ) : (
                <AddReaction sx={{ fontSize: "52px" }} />
              )}
            </Avatar>
          </Badge>
        </EmojiContaier>
        {showEmojiPicker && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "24px",
            }}
          >
            <EmojiPicker
              emojiStyle={user.emojisStyle}
              lazyLoadEmojis
              onEmojiClick={(e) => {
                setShowEmojiPicker(!showEmojiPicker);
                setEditedTask((prevTask) => ({
                  ...(prevTask as Task),
                  emoji: e.unified,
                }));
              }}
            />
          </div>
        )}
        <StyledInput
          label="Name"
          name="name"
          value={editedTask?.name || ""}
          onChange={handleInputChange}
          fullWidth
          error={nameError || editedTask?.name === ""}
          helperText={
            (nameError || editedTask?.name === "") &&
            `Name is required and should be less than or equal to ${TASK_NAME_MAX_LENGTH} characters`
          }
        />
        <StyledInput
          label="Description"
          name="description"
          value={editedTask?.description || ""}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={4}
          margin="normal"
          error={descriptionError}
          helperText={
            descriptionError &&
            `Description is too long (maximum ${DESCRIPTION_MAX_LENGTH} characters)`
          }
        />
        <br />
        <br />
        {/* FIXME: default date doesnt work (new amazing chrome update) */}
        <StyledInput
          label="Deadline date"
          name="deadline"
          type="datetime-local"
          value={editedTask?.deadline || ""}
          onChange={handleInputChange}
          focused
          fullWidth
        />
        <br />
        <br />
        <Typography>Color:</Typography>
        <ColorPicker
          type="color"
          name="color"
          value={editedTask?.color || "#000000"}
          onChange={(e) => {
            setEditedTask((prevTask) => ({
              ...(prevTask as Task),
              color: e.target.value,
            }));
          }}
        />
      </DialogContent>
      <DialogActions>
        <DialogBtn
          onClick={() => {
            onClose();
            setEditedTask(task);
          }}
        >
          Cancel
        </DialogBtn>
        <DialogBtn onClick={handleSave} color="primary">
          Save
        </DialogBtn>
      </DialogActions>
    </Dialog>
  );
};
const EmojiContaier = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
`;

const StyledInput = styled(TextField)`
  & .MuiInputBase-root {
    border-radius: 16px;
  }
`;

const ColorPicker = styled.input`
  width: 100%;
  height: 40px;
  border-radius: 8px;
  border: none;
  cursor: pointer;

  &::-webkit-color-swatch {
    border-radius: 100px;
    border: none;
  }
`;
