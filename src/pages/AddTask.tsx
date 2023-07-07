import { Category, Task, UserProps } from "../types/user";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AddTaskButton, ColorPalette, Container } from "../styles";
import { Edit } from "@mui/icons-material";
import { Emoji } from "emoji-picker-react";
import {
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import { DESCRIPTION_MAX_LENGTH, TASK_NAME_MAX_LENGTH } from "../constants";
import { TopBar } from "../components";
import { CustomEmojiPicker } from "../components";
import { CategoriesMenu } from "../styles/globalStyles";

export const AddTask = ({ user, setUser }: UserProps) => {
  const [name, setName] = useState<string>("");
  const [emoji, setEmoji] = useState<string | undefined>();
  const [color, setColor] = useState<string>("#b624ff");
  const [description, setDescription] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");

  const [nameError, setNameError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");

  const n = useNavigate();

  useEffect(() => {
    document.title = "Todo App - Add Task";
  }, []);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    if (newName.length > TASK_NAME_MAX_LENGTH) {
      setNameError(
        `Name should be less than or equal to ${TASK_NAME_MAX_LENGTH} characters`
      );
    } else {
      setNameError("");
    }
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newDescription = event.target.value;
    setDescription(newDescription);
    if (newDescription.length > DESCRIPTION_MAX_LENGTH) {
      setDescriptionError(
        `Description should be less than or equal to ${DESCRIPTION_MAX_LENGTH} characters`
      );
    } else {
      setDescriptionError("");
    }
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  const handleDeadlineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeadline(event.target.value);
  };
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const handleCategoryChange = (event: SelectChangeEvent<unknown>) => {
    const categoryId = event.target.value;
    const category = user.categories.find((cat) => cat.id === categoryId);
    setSelectedCategory(category || null);
  };

  const handleAddTask = () => {
    if (name !== "") {
      if (
        name.length > TASK_NAME_MAX_LENGTH ||
        description.length > DESCRIPTION_MAX_LENGTH
      ) {
        return; // Do not add the task if the name or description exceeds the maximum length
      }

      const newTask: Task = {
        id: new Date().getTime() + Math.random(),
        done: false,
        pinned: false,
        name,
        description: description !== "" ? description : undefined,
        emoji: emoji ? emoji : undefined,
        color,
        date: new Date(),
        deadline: deadline !== "" ? new Date(deadline) : undefined,
        category: selectedCategory ? [selectedCategory] : [],
      };
      setUser({ ...user, tasks: [...user.tasks, newTask] });
      n("/");
    }
  };

  return (
    <>
      <TopBar title="Add New Task" />
      <Container>
        <CustomEmojiPicker user={user} setEmoji={setEmoji} color={color} />
        <StyledInput
          label="Task Name"
          name="name"
          placeholder="Enter task name"
          value={name}
          onChange={handleNameChange}
          focused
          error={nameError !== ""}
          helperText={nameError}
        />
        <StyledInput
          label="Task Description (optional)"
          name="name"
          placeholder="Enter task description"
          value={description}
          onChange={handleDescriptionChange}
          multiline
          rows={4}
          focused
          error={descriptionError !== ""}
          helperText={descriptionError}
        />
        <StyledInput
          label="Task Deadline (optional)"
          name="name"
          placeholder="Enter deadline date"
          type="datetime-local"
          value={deadline}
          onChange={handleDeadlineChange}
          focused
        />
        {user.settings[0].enableCategories !== undefined &&
          user.settings[0].enableCategories && (
            <>
              <br />
              <Typography>Category (optional)</Typography>
              <StyledSelect
                color="primary"
                variant="outlined"
                value={selectedCategory !== null ? selectedCategory.id : ""}
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
                  sx={{
                    opacity: "1 !important",
                    fontWeight: 500,
                  }}
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
                      )}
                      &nbsp;
                      {category.name}
                    </CategoriesMenu>
                  ))}
              </StyledSelect>
              <Link to="/categories">
                <Button
                  sx={{
                    margin: "8px 0 24px 0 ",
                    padding: "12px 24px",
                    borderRadius: "12px",
                  }}
                  // onClick={() => n("/categories")}
                >
                  <Edit /> &nbsp; Modify Categories
                </Button>
              </Link>
            </>
          )}
        <Typography>Color</Typography>
        <ColorPicker type="color" value={color} onChange={handleColorChange} />
        <AddTaskButton
          onClick={handleAddTask}
          disabled={
            name.length > TASK_NAME_MAX_LENGTH ||
            description.length > DESCRIPTION_MAX_LENGTH ||
            name === ""
          }
        >
          Add Task
        </AddTaskButton>
      </Container>
    </>
  );
};

const StyledInput = styled(TextField)`
  margin: 12px;
  .MuiOutlinedInput-root {
    border-radius: 16px;
    transition: 0.3s all;
    width: 400px;
    color: white;
  }
`;

const StyledSelect = styled(Select)`
  margin: 12px;
  border-radius: 16px;
  transition: 0.3s all;
  width: 400px;
  color: white;
  border: 3px solid ${ColorPalette.purple};
`;

const ColorPicker = styled.input`
  width: 400px;
  margin: 12px;
  height: 40px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background-color: #ffffff3e;
  &::-webkit-color-swatch {
    border-radius: 100px;
    border: none;
  }
`;
