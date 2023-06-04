import { useEffect, useState } from "react";
import { TopBar } from "../components";
import { Category, UserProps } from "../types/user";
import { useNavigate } from "react-router-dom";
import EmojiPicker, { Emoji } from "emoji-picker-react";
import styled from "@emotion/styled";
import {
  Avatar,
  Badge,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { AddReaction, Delete, Edit } from "@mui/icons-material";
import { CATEGORY_NAME_MAX_LENGTH } from "../constants";
import { getFontColorFromHex } from "../utils";

//TODO: add option to add/delete categories
export const Categories = ({ user, setUser }: UserProps) => {
  const [openEmojiPicker, setOpenEmojiPicker] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [emoji, setEmoji] = useState<string>("");
  const [color, setColor] = useState<string>("#b624ff");
  const n = useNavigate();
  useEffect(() => {
    document.title = "Todo App - Categories";
    if (!user.enableCategories) {
      n("/");
    }
  }, []);
  const handleDelete = (categoryId: number) => {
    if (categoryId) {
      const updatedCategories = user.categories.filter(
        (category) => category.id !== categoryId
      );
      setUser({ ...user, categories: updatedCategories });
    }
  };
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    if (newName.length > CATEGORY_NAME_MAX_LENGTH) {
      setNameError(
        `Name should be less than or equal to ${CATEGORY_NAME_MAX_LENGTH} characters`
      );
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
      setColor("#b624ff");
      setEmoji("");
    }
  };

  return (
    <>
      <TopBar title="Categories" />
      <Container>
        <CategoriesContainer>
          {/* {user.categories
          .sort((a, b) => a.name.localeCompare(b.name)) */}
          {user.categories.map((category) => {
            return (
              <CategoryDiv key={category.id} clr={category.color}>
                <CategoryContent>
                  <span>
                    {category.emoji && (
                      <Emoji
                        unified={category.emoji}
                        emojiStyle={user.emojisStyle}
                      />
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
        <AddContainer>
          <h2>Add New Category</h2>

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
                cursor: "pointer",
                background: "#b624ff",
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
          {!openEmojiPicker && <br />}
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
            focused
            label="Category name"
            placeholder="Enter category name"
            value={name}
            onChange={handleNameChange}
            error={nameError !== ""}
            helperText={nameError}
          />
          <Typography>Color:</Typography>
          <ColorPicker
            type="color"
            value={color}
            onChange={handleColorChange}
          />
          <AddCategoryButton
            onClick={handleAddCategory}
            disabled={name.length > CATEGORY_NAME_MAX_LENGTH || name === ""}
          >
            Add Category
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
`;

const CategoryContent = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  margin: 0 4px;
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
export const AddCategoryButton = styled.button`
  border: none;
  padding: 18px 48px;
  font-size: 24px;
  background: #b624ff;
  color: #ffffff;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s all;
  margin: 20px;
  width: 350px;
  &:hover {
    box-shadow: 0px 0px 24px 0px #7614ff;
  }
  &:disabled {
    box-shadow: none;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;
const ColorPicker = styled.input`
  width: 350px;
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
