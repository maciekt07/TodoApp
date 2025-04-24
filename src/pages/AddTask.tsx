import { Category, Task, TaskPriority } from "../types/user";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AddTaskButton, Container, StyledInput } from "../styles";
import { AddTaskRounded, CancelRounded } from "@mui/icons-material";
import { IconButton, InputAdornment, Tooltip } from "@mui/material";
import { DESCRIPTION_MAX_LENGTH, TASK_NAME_MAX_LENGTH } from "../constants";
import { CategorySelect, ColorPicker, TopBar, CustomEmojiPicker } from "../components";
import { UserContext } from "../contexts/UserContext";
import { useStorageState } from "../hooks/useStorageState";
import { useTheme } from "@emotion/react";
import { generateUUID, getFontColor, isDark, showToast } from "../utils";
import { ColorPalette } from "../theme/themeConfig";
import InputThemeProvider from "../contexts/InputThemeProvider";
import { PrioritySelect } from "../components/PrioritySelect";

const AddTask = () => {
  const { user, setUser } = useContext(UserContext);
  const theme = useTheme();
  const [name, setName] = useStorageState<string>("", "name", "sessionStorage");
  const [emoji, setEmoji] = useStorageState<string | null>(null, "emoji", "sessionStorage");
  const [color, setColor] = useStorageState<string>(theme.primary, "color", "sessionStorage");
  const [description, setDescription] = useStorageState<string>(
    "",
    "description",
    "sessionStorage",
  );
  const [deadline, setDeadline] = useStorageState<string>("", "deadline", "sessionStorage");
  const [nameError, setNameError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useStorageState<Category[]>(
    [],
    "categories",
    "sessionStorage",
  );
  const [selectedPriority, setSelectedPriority] = useStorageState<TaskPriority>(
    "Low",
    "priority",
    "sessionStorage",
  );
  const [startDate, setStartDate] = useStorageState<Date | undefined>(
    undefined,
    "startDate",
    "sessionStorage",
  );
  const [endDate, setEndDate] = useStorageState<Date | undefined>(
    undefined,
    "endDate",
    "sessionStorage",
  );

  const [isDeadlineFocused, setIsDeadlineFocused] = useState<boolean>(false);
  const [isStartDateFocused, setIsStartDateFocused] = useState<boolean>(false);
  const [isEndDateFocused, setIsEndDateFocused] = useState<boolean>(false);

  const n = useNavigate();

  useEffect(() => {
    document.title = "Todo App - Add Task";
  }, []);

  useEffect(() => {
    if (name.length > TASK_NAME_MAX_LENGTH) {
      setNameError(`Name should be less than or equal to ${TASK_NAME_MAX_LENGTH} characters`);
    } else {
      setNameError("");
    }
    if (description.length > DESCRIPTION_MAX_LENGTH) {
      setDescriptionError(
        `Description should be less than or equal to ${DESCRIPTION_MAX_LENGTH} characters`,
      );
    } else {
      setDescriptionError("");
    }
  }, [description.length, name.length]);

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
        `Description should be less than or equal to ${DESCRIPTION_MAX_LENGTH} characters`,
      );
    } else {
      setDescriptionError("");
    }
  };

  const handleDeadlineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeadline(event.target.value);
  };

  const handleAddTask = () => {
    if (name === "") {
      showToast("Task name is required.", { type: "error" });
      return;
    }

    if (nameError !== "" || descriptionError !== "") {
      return; // Do not add the task if the name or description exceeds the maximum length
    }

    const newTask: Task = {
      id: generateUUID(),
      done: false,
      pinned: false,
      name,
      description: description !== "" ? description : undefined,
      emoji: emoji ? emoji : undefined,
      color,
      date: new Date(),
      deadline: deadline !== "" ? new Date(deadline) : undefined,
      category: selectedCategories ? selectedCategories : [],
      priority: selectedPriority,
      startDate: startDate,
      endDate: endDate,
    };

    setUser((prevUser) => ({
      ...prevUser,
      tasks: [...prevUser.tasks, newTask],
    }));

    n("/");

    showToast(
      <div>
        Added task - <b>{newTask.name}</b>
      </div>,
      {
        icon: <AddTaskRounded />,
      },
    );

    const itemsToRemove = [
      "name",
      "color",
      "description",
      "emoji",
      "deadline",
      "categories",
      "priority",
      "startDate",
      "endDate",
    ];
    itemsToRemove.map((item) => sessionStorage.removeItem(item));
  };

  return (
    <>
      <TopBar title="Add New Task" />
      <Container>
        <CustomEmojiPicker
          emoji={typeof emoji === "string" ? emoji : undefined}
          setEmoji={setEmoji}
          color={color}
          name={name}
          type="task"
        />
        {/* fix for input colors */}
        <InputThemeProvider>
          <StyledInput
            label="Task Name"
            name="name"
            placeholder="Enter task name"
            autoComplete="off"
            value={name}
            onChange={handleNameChange}
            required
            error={nameError !== ""}
            helpercolor={nameError && ColorPalette.red}
            helperText={
              name === ""
                ? undefined
                : !nameError
                  ? `${name.length}/${TASK_NAME_MAX_LENGTH}`
                  : nameError
            }
          />
          <StyledInput
            label="Task Description"
            name="name"
            placeholder="Enter task description"
            autoComplete="off"
            value={description}
            onChange={handleDescriptionChange}
            multiline
            rows={4}
            error={descriptionError !== ""}
            helpercolor={descriptionError && ColorPalette.red}
            helperText={
              description === ""
                ? undefined
                : !descriptionError
                  ? `${description.length}/${DESCRIPTION_MAX_LENGTH}`
                  : descriptionError
            }
          />
          <StyledInput
            label="Task Deadline"
            name="name"
            placeholder="Enter deadline date"
            type="datetime-local"
            value={deadline}
            onChange={handleDeadlineChange}
            onFocus={() => setIsDeadlineFocused(true)}
            onBlur={() => setIsDeadlineFocused(false)}
            hidetext={(!deadline || deadline === "") && !isDeadlineFocused} // fix for label overlapping with input
            sx={{
              colorScheme: isDark(theme.secondary) ? "dark" : "light",
            }}
            slotProps={{
              input: {
                startAdornment:
                  deadline && deadline !== "" ? (
                    <InputAdornment position="start">
                      <Tooltip title="Clear">
                        <IconButton color="error" onClick={() => setDeadline("")}>
                          <CancelRounded />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ) : undefined,
              },
            }}
          />
          <StyledInput
            label="Start Date"
            name="startDate"
            placeholder="Enter start date"
            type="datetime-local"
            onFocus={() => setIsStartDateFocused(true)}
            onBlur={() => setIsStartDateFocused(false)}
            hidetext={(!startDate || startDate === undefined) && !isStartDateFocused}
            value={startDate ? new Date(startDate).toISOString().slice(0, 16) : ""}
            onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : undefined)}
            sx={{
              colorScheme: isDark(theme.secondary) ? "dark" : "light",
              marginBottom: "14px",
            }}
            slotProps={{
              input: {
                startAdornment: startDate ? (
                  <InputAdornment position="start">
                    <Tooltip title="Clear">
                      <IconButton color="error" onClick={() => setStartDate(undefined)}>
                        <CancelRounded />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ) : undefined,
              },
            }}
          />

          <StyledInput
            label="End Date"
            name="endDate"
            placeholder="Enter end date"
            type="datetime-local"
            onFocus={() => setIsEndDateFocused(true)}
            onBlur={() => setIsEndDateFocused(false)}
            hidetext={(!endDate || endDate === undefined) && !isEndDateFocused}
            value={endDate ? new Date(endDate).toISOString().slice(0, 16) : ""}
            onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : undefined)}
            sx={{
              colorScheme: isDark(theme.secondary) ? "dark" : "light",
            }}
            slotProps={{
              input: {
                startAdornment: endDate ? (
                  <InputAdornment position="start">
                    <Tooltip title="Clear">
                      <IconButton color="error" onClick={() => setEndDate(undefined)}>
                        <CancelRounded />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ) : undefined,
              },
            }}
          />

          {user.settings.enableCategories !== undefined && user.settings.enableCategories && (
            <div style={{ marginBottom: "14px" }}>
              <br />
              <CategorySelect
                selectedCategories={selectedCategories}
                onCategoryChange={(categories) => setSelectedCategories(categories)}
                width="400px"
                fontColor={getFontColor(theme.secondary)}
              />
            </div>
          )}

          <PrioritySelect
            width={"400px"}
            selectedPriority={selectedPriority}
            onPriorityChange={setSelectedPriority}
            fontColor={getFontColor(theme.secondary)}
          />
        </InputThemeProvider>
        <ColorPicker
          color={color}
          width="400px"
          onColorChange={(color) => {
            setColor(color);
          }}
          fontColor={getFontColor(theme.secondary)}
        />
        <AddTaskButton
          onClick={handleAddTask}
          disabled={
            name.length > TASK_NAME_MAX_LENGTH || description.length > DESCRIPTION_MAX_LENGTH
          }
        >
          Create Task
        </AddTaskButton>
      </Container>
    </>
  );
};

export default AddTask;
