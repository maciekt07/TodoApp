import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Avatar,
  Badge,
  Typography,
} from "@mui/material";
import { Task, User } from "../types/user";
import EmojiPicker, { Emoji } from "emoji-picker-react";
import styled from "@emotion/styled";
import { AddReaction, Edit } from "@mui/icons-material";
interface EditTaskProps {
  open: boolean;
  task?: Task;
  onClose: () => void;
  onSave: (editedTask: Task) => void;
  user: User;
}

export const EditTask = ({
  open,
  task,
  onClose,
  onSave,
  user,
}: EditTaskProps) => {
  const [editedTask, setEditedTask] = React.useState<Task | undefined>(task);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  React.useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedTask((prevTask) => ({
      ...(prevTask as Task),
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (editedTask) {
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
                <Emoji size={64} unified={editedTask?.emoji || ""} />
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
          autoFocus
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
        />
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
        <Btn
          onClick={() => {
            onClose();
            setEditedTask(task);
          }}
        >
          Cancel
        </Btn>
        <Btn onClick={handleSave} color="primary">
          Save
        </Btn>
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

const Btn = styled(Button)`
  border-radius: 14px;
  padding: 8px 14px;
  font-size: 16px;
  margin: 6px;
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

  /* &::-moz-color-swatch {
    border-radius: 50%;
    border: none;
  } */
`;
