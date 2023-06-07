import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Task, User } from "../types/user";
import { Emoji } from "emoji-picker-react";
import styled from "@emotion/styled";

import { DESCRIPTION_MAX_LENGTH, TASK_NAME_MAX_LENGTH } from "../constants";
import { ColorPalette, DialogBtn } from "../styles";
import { getFontColorFromHex } from "../utils";
import { CustomEmojiPicker } from ".";
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
  const [editedTask, setEditedTask] = useState<Task | undefined>(task);
  const [nameError, setNameError] = useState<boolean>(false);
  const [descriptionError, setDescriptionError] = useState<boolean>(false);

  const [emoji, setEmoji] = useState<string | undefined>();

  useEffect(() => {
    setEditedTask((prevTask) => ({
      ...(prevTask as Task),
      emoji: emoji,
    }));
  }, [emoji]);

  useEffect(() => {
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
  const handleCategoryChange = (event: SelectChangeEvent<unknown>) => {
    const categoryId = event.target.value as number;
    const selectedCategory = user.categories.find(
      (category) => category.id === categoryId
    );

    setEditedTask((prevTask) => ({
      ...(prevTask as Task),
      category: selectedCategory ? [selectedCategory] : undefined,
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ style: { borderRadius: "24px", padding: "12px" } }}
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
          <LastEdit>
            Last Edited: {new Date(editedTask?.lastSave).toLocaleDateString()}
            {" • "}
            {new Date(editedTask?.lastSave).toLocaleTimeString()}
          </LastEdit>
        )}
      </DialogTitle>
      <DialogContent>
        <CustomEmojiPicker
          emojiStyle={user.emojisStyle}
          emoji={editedTask?.emoji || undefined}
          setEmoji={setEmoji}
          color={editedTask?.color}
        />
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
        {user.enableCategories && (
          <>
            <Typography>Category (optional)</Typography>

            <StyledSelect
              color="primary"
              fullWidth
              variant="outlined"
              value={editedTask?.category?.[0]?.id ?? ""}
              onChange={handleCategoryChange}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 400,
                  },
                },
              }}
            >
              <MenuItem
                value=""
                disabled
                sx={{ opacity: "1 !important", fontWeight: 500 }}
              >
                Select a category
              </MenuItem>
              <StyledMenu value={[]}>None</StyledMenu>
              {user.categories &&
                user.categories.map((category) => (
                  <StyledMenu
                    key={category.id}
                    value={category.id}
                    clr={category.color}
                  >
                    {category.emoji && <Emoji unified={category.emoji} />}{" "}
                    &nbsp;
                    {category.name}
                  </StyledMenu>
                ))}
            </StyledSelect>
          </>
        )}
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
const StyledMenu = styled(MenuItem)<{ clr?: string }>`
  padding: 12px 20px;
  border-radius: 16px;
  margin: 8px;
  display: flex;
  gap: 4px;
  font-weight: 500;
  transition: 0.2s all;
  color: ${(props) => getFontColorFromHex(props.clr || ColorPalette.fontLight)};
  background: ${(props) => props.clr || "#bcbcbc"};
  &:hover {
    background: ${(props) => props.clr || "#bcbcbc"};
    opacity: 0.7;
  }

  &.Mui-selected {
    background: ${(props) => props.clr || "#bcbcbc"};
    color: ${(props) =>
      getFontColorFromHex(props.clr || ColorPalette.fontLight)};
    box-shadow: 0 0 14px 4px ${(props) => props.clr || "#bcbcbc"};
    &:hover {
      background: ${(props) => props.clr || "#bcbcbc"};
      opacity: 0.7;
    }
  }
`;
const StyledSelect = styled(Select)`
  border-radius: 16px;
  transition: 0.3s all;

  margin: 8px 0;
`;

const LastEdit = styled.span`
  font-size: 14px;
  font-style: italic;
  font-weight: 400;
  opacity: 0.8;
`;
