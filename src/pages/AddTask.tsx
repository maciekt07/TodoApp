import { Task, UserProps } from "../types/user";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AddTaskButton, BackBtn, Container, Header } from "../styles";
import { AddReaction, ArrowBackIosNew, Edit } from "@mui/icons-material";
import EmojiPicker, { Emoji } from "emoji-picker-react";
import { Avatar, Badge, TextField, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { DESCRIPTION_MAX_LENGTH, TASK_NAME_MAX_LENGTH } from "../constants";
import { getFontColorFromHex } from "../utils";

export const AddTask = ({ user, setUser }: UserProps) => {
  const [name, setName] = useState<string>("");
  const [emoji, setEmoji] = useState<string>("");
  const [color, setColor] = useState<string>("#b624ff");
  const [description, setDescription] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [openEmojiPicker, setOpenEmojiPicker] = useState<boolean>(false);

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

  const handleAddTask = () => {
    if (name !== "") {
      if (
        name.length > TASK_NAME_MAX_LENGTH ||
        description.length > DESCRIPTION_MAX_LENGTH
      ) {
        return; // Do not add the task if the name or description exceeds the maximum length
      }

      const newTask: Task = {
        id: new Date().getTime() + Math.random(), // Generate a unique ID for the new task
        done: false,
        pinned: false,
        name,
        description: description !== "" ? description : undefined,
        emoji: emoji !== "" ? emoji : undefined,
        color,
        date: new Date(),
        deadline: deadline !== "" ? new Date(deadline) : undefined,
      };
      setUser({ ...user, tasks: [...user.tasks, newTask] });
      n("/");
    }
  };

  return (
    <>
      <Container>
        <BackBtn onClick={() => n("/")}>
          <ArrowBackIosNew /> &nbsp; Back
        </BackBtn>
        <Header>Add New Task</Header>
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
                onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
              >
                <Edit />
              </Avatar>
            }
          >
            <Avatar
              onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
              sx={{
                width: "96px",
                height: "96px",
                background: color,
                color: getFontColorFromHex(color),
                cursor: "pointer",
              }}
            >
              {emoji ? (
                <Emoji
                  size={64}
                  emojiStyle={user.emojisStyle}
                  unified={emoji || ""}
                />
              ) : (
                <AddReaction sx={{ fontSize: "52px" }} />
              )}
            </Avatar>
          </Badge>
        </EmojiContaier>
        {openEmojiPicker && (
          <div style={{ margin: "16px" }}>
            <EmojiPicker
              emojiStyle={user.emojisStyle}
              lazyLoadEmojis
              onEmojiClick={(e) => {
                setEmoji(e.unified);
                setOpenEmojiPicker(false);
              }}
            />
          </div>
        )}
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
          Add task
        </AddTaskButton>
        {/* {openEmojiPicker && (
          <CloseEmojiBtn onClick={() => setOpenEmojiPicker(false)}>
            <Close /> &nbsp; Close emoji picker
          </CloseEmojiBtn>
        )} */}
      </Container>
    </>
  );
};

const EmojiContaier = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
`;
const StyledInput = styled(TextField)`
  margin: 12px;
  .MuiOutlinedInput-root {
    border-radius: 16px;
    transition: 0.3s all;
    width: 400px;
    color: white;
  }
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
