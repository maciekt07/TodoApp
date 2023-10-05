import { useEffect, useState } from "react";
import { ColorPicker, CustomEmojiPicker, TopBar } from "../components";
import { Category, UserProps } from "../types/user";
import { useNavigate } from "react-router-dom";
import { Emoji } from "emoji-picker-react";
import styled from "@emotion/styled";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { CATEGORY_NAME_MAX_LENGTH } from "../constants";
import { getFontColorFromHex } from "../utils";
import { ColorPalette, fadeIn } from "../styles";
import toast from "react-hot-toast";

export const Categories = ({ user, setUser }: UserProps) => {
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [emoji, setEmoji] = useState<string | undefined>();
  const [color, setColor] = useState<string>(ColorPalette.purple);

  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);

  const n = useNavigate();

  useEffect(() => {
    document.title = "Todo App - Categories";
    if (!user.settings[0].enableCategories) {
      n("/");
    }
  }, []);

  const handleDelete = (categoryId: number) => {
    if (categoryId) {
      const categoryName =
        user.categories.find((category) => category.id === categoryId)?.name || "";
      const updatedCategories = user.categories.filter((category) => category.id !== categoryId);
      // Remove the category from tasks that have it associated
      const updatedTasks = user.tasks.map((task) => {
        const updatedCategoryList = task.category?.filter((category) => category.id !== categoryId);
        return {
          ...task,
          category: updatedCategoryList,
        };
      });

      setUser({
        ...user,
        categories: updatedCategories,
        tasks: updatedTasks,
      });
      toast.success(() => (
        <div>
          Deleted category - <b>{categoryName}.</b>
        </div>
      ));
    }
  };

  // const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setColor(event.target.value);
  // };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    if (newName.length > CATEGORY_NAME_MAX_LENGTH) {
      setNameError(`Name is too long maximum ${CATEGORY_NAME_MAX_LENGTH} characters`);
    } else {
      setNameError("");
    }
  };

  const handleAddCategory = () => {
    if (name !== "") {
      if (name.length > CATEGORY_NAME_MAX_LENGTH) {
        return;
      }
      const newCategory: Category = {
        id: new Date().getTime() + Math.floor(Math.random() * 1000),
        name,
        emoji: emoji !== "" ? emoji : undefined,
        color,
      };
      toast.success(() => (
        <div>
          Added category - <b>{newCategory.name}</b>
        </div>
      ));
      setUser((prevUser) => ({
        ...prevUser,
        categories: [...prevUser.categories, newCategory],
      }));

      setName("");
      setColor(ColorPalette.purple);
      setEmoji("");
    }
  };

  if (!user.settings[0].enableCategories) {
    return null;
  }

  return (
    <>
      <TopBar title="Categories" />
      <Container>
        {user.categories.length > 0 ? (
          <CategoriesContainer>
            {user.categories.map((category) => {
              const categoryTasks = user.tasks.filter((task) =>
                task.category?.some((cat) => cat.id === category.id)
              );

              const completedTasksCount = categoryTasks.reduce(
                (count, task) => (task.done ? count + 1 : count),
                0
              );
              const totalTasksCount = categoryTasks.length;
              const completionPercentage =
                totalTasksCount > 0 ? Math.floor((completedTasksCount / totalTasksCount) * 100) : 0;

              const displayPercentage = totalTasksCount > 0 ? `(${completionPercentage}%)` : "";

              return (
                <CategoryDiv key={category.id} clr={category.color}>
                  <CategoryContent>
                    <span>
                      {category.emoji && (
                        <Emoji unified={category.emoji} emojiStyle={user.emojisStyle} />
                      )}
                    </span>{" "}
                    &nbsp;
                    <span style={{ wordBreak: "break-all" }}>{category.name}</span>
                    <Tooltip title="The percentage of completion of tasks assigned to this category">
                      <span style={{ opacity: 0.8, fontStyle: "italic" }}>{displayPercentage}</span>
                    </Tooltip>
                  </CategoryContent>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {/* <DeleteButton>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          console.log(`edit: ${category.name}`);
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </DeleteButton> */}
                    <DeleteButton>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setSelectedCategoryId(category.id);
                          if (totalTasksCount > 0) {
                            // Open delete dialog if there are tasks associated to catagory
                            setOpenDeleteDialog(true);
                          } else {
                            // If no associated tasks, directly handle deletion
                            handleDelete(category.id);
                          }
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </DeleteButton>
                  </div>
                </CategoryDiv>
              );
            })}
          </CategoriesContainer>
        ) : (
          <p>You don't have any categories</p>
        )}
        <AddContainer>
          <h2>Add New Category</h2>
          <CustomEmojiPicker user={user} emoji={emoji} setEmoji={setEmoji} color={color} />
          <StyledInput
            focused
            label="Category name"
            placeholder="Enter category name"
            value={name}
            onChange={handleNameChange}
            error={nameError !== ""}
            helperText={nameError}
          />
          <Typography>Color</Typography>
          <ColorPicker
            color={color}
            onColorChange={(color) => {
              setColor(color);
            }}
            width={"350px"}
          />
          <AddCategoryButton
            onClick={handleAddCategory}
            disabled={name.length > CATEGORY_NAME_MAX_LENGTH || name === ""}
          >
            Create Category
          </AddCategoryButton>
        </AddContainer>
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          PaperProps={{
            style: {
              borderRadius: "24px",
              padding: "10px",
            },
          }}
        >
          <DialogTitle>
            Confirm deletion of{" "}
            <b>{user.categories.find((cat) => cat.id === selectedCategoryId)?.name}</b>
          </DialogTitle>

          <DialogContent>
            This will remove the category from your list and associated tasks.
          </DialogContent>

          <DialogActions>
            <DialogBtn onClick={() => setOpenDeleteDialog(false)}>Cancel</DialogBtn>
            <DialogBtn
              onClick={() => {
                handleDelete(selectedCategoryId);
                setOpenDeleteDialog(false);
              }}
              color="error"
            >
              Delete
            </DialogBtn>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 40px;
`;

const CategoriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 300px;
  background: #ffffff15;
  overflow-y: auto;
  padding: 24px 18px;
  border-radius: 18px 0 0 18px;
  /* Custom Scrollbar Styles */
  ::-webkit-scrollbar {
    width: 8px;
    border-radius: 4px;
    background-color: #ffffff15;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #ffffff30;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #ffffff50;
  }

  ::-webkit-scrollbar-track {
    border-radius: 4px;
    background-color: #ffffff15;
  }
`;

const AddContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 4px;
`;

const CategoryDiv = styled.div<{ clr: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 320px;
  margin: 6px 0;
  padding: 12px;
  border-radius: 18px;
  background: ${(props) => props.clr};
  color: ${(props) => getFontColorFromHex(props.clr)};
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const CategoryContent = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  margin: 0 4px;
  gap: 4px;
`;

const DeleteButton = styled.div`
  background: #ffffffbd;
  border-radius: 100%;
  margin: 0 4px;
`;
const StyledInput = styled(TextField)`
  margin: 12px;
  .MuiOutlinedInput-root {
    border-radius: 16px;
    transition: 0.3s all;
    width: 350px;
    color: white;
  }
`;
export const AddCategoryButton = styled(Button)`
  border: none;
  padding: 18px 48px;
  font-size: 24px;
  background: ${ColorPalette.purple};
  color: #ffffff;
  border-radius: 26px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s all;
  margin: 20px;
  width: 350px;
  text-transform: capitalize;
  &:hover {
    box-shadow: 0px 0px 24px 0px #7614ff;
    background: ${ColorPalette.purple};
  }
  &:disabled {
    box-shadow: none;
    cursor: not-allowed;
    opacity: 0.7;
    color: white;
  }
`;
const DialogBtn = styled(Button)`
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 16px;
  margin: 8px;
`;
