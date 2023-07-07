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
  Button,
} from "@mui/material";
import { Task, UserProps } from "../types/user";
import { Emoji } from "emoji-picker-react";
import styled from "@emotion/styled";

import { DESCRIPTION_MAX_LENGTH, TASK_NAME_MAX_LENGTH } from "../constants";
import { DialogBtn } from "../styles";

import { CustomEmojiPicker } from ".";
import { CategoriesMenu } from "../styles/globalStyles";
import { Restore } from "@mui/icons-material";
interface EditTaskProps extends UserProps {
  open: boolean;
  task?: Task;
  onClose: () => void;
  onSave: (editedTask: Task) => void;
}
export const EditTask = ({
  open,
  task,
  onClose,
  onSave,
  user,
  setUser,
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
      PaperProps={{
        style: {
          borderRadius: "24px",
          padding: "12px",
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
          <LastEdit>
            Last Edited: {new Date(editedTask?.lastSave).toLocaleDateString()}
            {" • "}
            {new Date(editedTask?.lastSave).toLocaleTimeString()}
          </LastEdit>
        )}
      </DialogTitle>
      <DialogContent>
        <CustomEmojiPicker
          user={user}
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
            editedTask?.name === ""
              ? "Name is required"
              : nameError
              ? `Name should be less than or equal to ${TASK_NAME_MAX_LENGTH} characters`
              : null
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
          value={editedTask?.deadline}
          onChange={handleInputChange}
          focused
          fullWidth
        />
        <br />
        <br />
        {user.settings[0].enableCategories !== undefined &&
          user.settings[0].enableCategories && (
            <>
              <Typography>Category</Typography>

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
                <CategoriesMenu value={[]}>None</CategoriesMenu>
                {user.categories &&
                  user.categories.map((category) => (
                    <CategoriesMenu
                      key={category.id}
                      value={category.id}
                      clr={category.color}
                    >
                      {category.emoji && (
                        <Emoji
                          unified={category.emoji}
                          emojiStyle={user.emojisStyle}
                        />
                      )}{" "}
                      &nbsp;
                      {category.name}
                    </CategoriesMenu>
                  ))}
              </StyledSelect>

              {editedTask?.category &&
                editedTask.category.length > 0 &&
                !user.categories.some(
                  (category) =>
                    editedTask.category &&
                    editedTask.category[0] &&
                    category.id === editedTask.category[0].id
                ) && (
                  <div style={{ margin: "8px 0" }}>
                    <span>
                      Category <b>{editedTask.category[0]?.name}</b> has been
                      deleted
                      <br />
                      <Button
                        sx={{
                          padding: "8px 12px",
                          margin: "8px 0",
                          borderRadius: "12px",
                        }}
                        onClick={() => {
                          if (editedTask.category && editedTask.category[0]) {
                            const updatedCategories = [
                              ...user.categories,
                              editedTask.category[0],
                            ];

                            setUser((prevUser) => ({
                              ...prevUser,
                              categories: updatedCategories,
                            }));
                          }
                        }}
                      >
                        <Restore /> &nbsp; restore category
                      </Button>
                    </span>
                  </div>
                )}
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
        <DialogBtn
          onClick={handleSave}
          color="primary"
          disabled={nameError || editedTask?.name === ""}
        >
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
