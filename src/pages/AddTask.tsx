import { Category, Task, UserProps } from "../types/user";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AddTaskButton, Container, StyledInput } from "../styles";
import { Edit } from "@mui/icons-material";

import { Button, Typography } from "@mui/material";

import { DESCRIPTION_MAX_LENGTH, TASK_NAME_MAX_LENGTH } from "../constants";
import { CategorySelect, ColorPicker, TopBar, CustomEmojiPicker } from "../components";

import toast from "react-hot-toast";

export const AddTask = ({ user, setUser }: UserProps) => {
  const [name, setName] = useState<string>("");
  const [emoji, setEmoji] = useState<string | undefined>();
  const [color, setColor] = useState<string>("#b624ff");
  const [description, setDescription] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");

  const [nameError, setNameError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");

  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  const n = useNavigate();

  useEffect(() => {
    document.title = "Todo App - Add Task";
  }, []);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    if (newName.length > TASK_NAME_MAX_LENGTH) {
      setNameError(`Name should be less than or equal to ${TASK_NAME_MAX_LENGTH} characters`);
    } else {
      setNameError("");
    }
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  // const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setColor(event.target.value);
  // };

  const handleDeadlineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeadline(event.target.value);
  };

  const handleAddTask = () => {
    if (name !== "") {
      if (name.length > TASK_NAME_MAX_LENGTH || description.length > DESCRIPTION_MAX_LENGTH) {
        return; // Do not add the task if the name or description exceeds the maximum length
      }

      const newTask: Task = {
        id: new Date().getTime() + Math.floor(Math.random() * 1000),
        done: false,
        pinned: false,
        name,
        description: description !== "" ? description : undefined,
        emoji: emoji ? emoji : undefined,
        color,
        date: new Date(),
        deadline: deadline !== "" ? new Date(deadline) : undefined,
        category: selectedCategories ? selectedCategories : [],
      };

      setUser((prevUser) => ({
        ...prevUser,
        tasks: [...prevUser.tasks, newTask],
      }));

      n("/");
      toast.success(() => (
        <div>
          Added task - <b>{newTask.name}</b>
        </div>
      ));
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
        {user.settings[0].enableCategories !== undefined && user.settings[0].enableCategories && (
          <>
            <br />
            <Typography>Category (optional)</Typography>

            <CategorySelect
              user={user}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              width="400px"
            />
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
        <ColorPicker
          color={color}
          onColorChange={(color) => {
            setColor(color);
          }}
        />

        {/* <Typography>Color</Typography>
        <ColorPicker type="color" value={color} onChange={handleColorChange} /> */}
        <AddTaskButton
          onClick={handleAddTask}
          disabled={
            name.length > TASK_NAME_MAX_LENGTH ||
            description.length > DESCRIPTION_MAX_LENGTH ||
            name === ""
          }
        >
          Create Task
        </AddTaskButton>
      </Container>
    </>
  );
};
