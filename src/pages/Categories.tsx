import { useEffect, useState } from "react";
import { ColorPicker, CustomEmojiPicker, TopBar } from "../components";
import { Category, UserProps } from "../types/user";
import { useNavigate } from "react-router-dom";
import { Emoji } from "emoji-picker-react";
import styled from "@emotion/styled";
import { Button, IconButton, TextField, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { CATEGORY_NAME_MAX_LENGTH } from "../constants";
import { getFontColorFromHex } from "../utils";
import { ColorPalette, fadeIn } from "../styles";

export const Categories = ({ user, setUser }: UserProps) => {
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [emoji, setEmoji] = useState<string | undefined>();
  const [color, setColor] = useState<string>(ColorPalette.purple);

  const n = useNavigate();

  useEffect(() => {
    document.title = "Todo App - Categories";
    if (!user.settings[0].enableCategories) {
      n("/");
    }
  }, []);

  const handleDelete = (categoryId: number): void => {
    if (categoryId) {
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
        id: new Date().getTime() + Math.random(),
        name,
        emoji: emoji !== "" ? emoji : undefined,
        color,
      };
      setUser({ ...user, categories: [...user.categories, newCategory] });
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
              return (
                <CategoryDiv key={category.id} clr={category.color}>
                  <CategoryContent>
                    <span>
                      {category.emoji && (
                        <Emoji unified={category.emoji} emojiStyle={user.emojisStyle} />
                      )}
                    </span>{" "}
                    &nbsp;
                    {category.name}
                  </CategoryContent>
                  <DeleteButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        handleDelete(category.id);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </DeleteButton>
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
  max-height: 275px;
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
  width: 300px;
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
  background: #ffffffbc;
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
