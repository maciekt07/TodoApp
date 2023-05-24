import { Task, UserProps } from "../types/user";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  AddTaskButton,
  BackBtn,
  CloseEmojiBtn,
  ColorPreview,
  Container,
  EmojiPreview,
  Header,
  Input,
  OpenPickerBtn,
} from "../styles";
import { ArrowBackIosNew, Close } from "@mui/icons-material";
import EmojiPicker, { Emoji } from "emoji-picker-react";

export const AddTask = ({ user, setUser }: UserProps) => {
  const [name, setName] = useState<string>("");
  const [emoji, setEmoji] = useState<string>("");
  const [color, setColor] = useState<string>("#733fd4");
  const [description, setDescription] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [openEmojiPicker, setOpenEmojiPicker] = useState<boolean>(false);
  const colorPickerRef = useRef<HTMLInputElement>(null);
  const n = useNavigate();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  const handleDeadlineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeadline(event.target.value);
  };

  const handleAddTask = () => {
    if (name !== "") {
      const newTask: Task = {
        id: new Date().getTime(), // Generate a unique ID for the new task
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
    } else {
      alert("Please enter a name for the task");
    }
  };

  const openColorPicker = () => {
    if (colorPickerRef.current) {
      colorPickerRef.current.click();
    }
  };

  return (
    <>
      <Container>
        <BackBtn onClick={() => n("/")}>
          <ArrowBackIosNew /> &nbsp; Back
        </BackBtn>
        <Header>Add new task</Header>
        <Input
          maxLength={64}
          type="text"
          placeholder="Name"
          value={name}
          onChange={handleNameChange}
        />
        <br />
        <Input
          maxLength={128}
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={handleDescriptionChange}
        />
        <br />

        <p>Deadline date (optional)</p>
        <Input
          type="datetime-local"
          value={deadline}
          onChange={handleDeadlineChange}
        />
        <p>Emoji (optional)</p>
        {emoji !== "" && (
          <EmojiPreview>
            <Emoji unified={emoji} emojiStyle={user.emojisStyle} />
          </EmojiPreview>
        )}
        <br />
        <OpenPickerBtn onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
          Open emoji picker
        </OpenPickerBtn>
        {openEmojiPicker && (
          <div style={{ position: "absolute", bottom: "64px" }}>
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

        <p>Color</p>

        <ColorPreview color={color} onClick={openColorPicker} />
        <br />
        <OpenPickerBtn onClick={openColorPicker}>
          Open Color Picker
        </OpenPickerBtn>
        <div style={{ position: "relative" }}>
          <input
            ref={colorPickerRef}
            type="color"
            value={color}
            onChange={handleColorChange}
            style={{
              position: "absolute",
              top: "100%",
              left: "0",
              opacity: "0",
              pointerEvents: "none",
            }}
          />
        </div>
        <br />

        <AddTaskButton onClick={handleAddTask}>Add task</AddTaskButton>
        {openEmojiPicker && (
          <CloseEmojiBtn onClick={() => setOpenEmojiPicker(false)}>
            <Close /> &nbsp; Close emoji picker
          </CloseEmojiBtn>
        )}
      </Container>
    </>
  );
};
