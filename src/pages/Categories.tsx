import { useContext, useEffect, useState } from "react";
import { ColorPicker, CustomEmojiPicker, TopBar } from "../components";
import { Category, UUID } from "../types/user";
import { useNavigate } from "react-router-dom";
import { Emoji } from "emoji-picker-react";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Delete, Edit, SaveRounded, DeleteRounded } from "@mui/icons-material";
import { CATEGORY_NAME_MAX_LENGTH } from "../constants";
import { getFontColor, showToast } from "../utils";
import {
  ActionButton,
  AddCategoryButton,
  AddContainer,
  CategoriesContainer,
  CategoryContent,
  CategoryElement,
  CategoryElementsContainer,
  ColorPalette,
  DialogBtn,
  EditNameInput,
  CategoryInput,
} from "../styles";
import NotFound from "./NotFound";
import { UserContext } from "../contexts/UserContext";
import { useStorageState } from "../hooks/useStorageState";
import { useTheme } from "@emotion/react";

const Categories = () => {
  const { user, setUser } = useContext(UserContext);
  const theme = useTheme();

  const [name, setName] = useStorageState<string>("", "catName", "sessionStorage");
  const [nameError, setNameError] = useState<string>("");
  const [emoji, setEmoji] = useStorageState<string | null>(null, "catEmoji", "sessionStorage");
  const [color, setColor] = useStorageState<string>(theme.primary, "catColor", "sessionStorage");

  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<UUID | undefined>();

  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>("");
  const [editNameError, setEditNameError] = useState<string>("");
  const [editEmoji, setEditEmoji] = useState<string | undefined>();
  const [editColor, setEditColor] = useState<string>(ColorPalette.purple);

  const n = useNavigate();

  useEffect(() => {
    document.title = "Todo App - Categories";
    if (!user.settings[0].enableCategories) {
      n("/");
    }
    if (name.length > CATEGORY_NAME_MAX_LENGTH) {
      setNameError(`Name is too long maximum ${CATEGORY_NAME_MAX_LENGTH} characters`);
    }
  }, [n, name.length, user.settings]);

  useEffect(() => {
    setEditColor(
      user.categories.find((cat) => cat.id === selectedCategoryId)?.color || ColorPalette.purple
    );
    setEditName(user.categories.find((cat) => cat.id === selectedCategoryId)?.name || "");
    setEditNameError("");
  }, [selectedCategoryId, user.categories]);

  const handleDelete = (categoryId: UUID | undefined) => {
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

      showToast(
        <div>
          Deleted category - <b>{categoryName}.</b>
        </div>
      );
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    if (newName.length > CATEGORY_NAME_MAX_LENGTH) {
      setNameError(`Name is too long (maximum ${CATEGORY_NAME_MAX_LENGTH} characters)`);
    } else {
      setNameError("");
    }
  };

  const handleEditNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setEditName(newName);
    if (newName.length > CATEGORY_NAME_MAX_LENGTH) {
      setEditNameError(`Name is too long (maximum ${CATEGORY_NAME_MAX_LENGTH} characters)`);
    } else {
      setEditNameError("");
    }
  };

  const handleAddCategory = () => {
    if (name !== "") {
      if (name.length > CATEGORY_NAME_MAX_LENGTH) {
        return;
      }
      const newCategory: Category = {
        id: crypto.randomUUID(),
        name,
        emoji: emoji !== "" && emoji !== null ? emoji : undefined,
        color,
      };

      showToast(
        <div>
          Added category - <b>{newCategory.name}</b>
        </div>
      );

      setUser((prevUser) => ({
        ...prevUser,
        categories: [...prevUser.categories, newCategory],
      }));

      setName("");
      setColor(ColorPalette.purple);
      setEmoji("");
    } else {
      showToast("Category name is required.", { type: "error" });
    }
  };

  const handleEditDimiss = () => {
    setSelectedCategoryId(undefined);
    setOpenEditDialog(false);
    setEditColor(ColorPalette.purple);
    setEditName("");
    setEditEmoji(undefined);
  };

  const handleEditCategory = () => {
    if (selectedCategoryId) {
      const updatedCategories = user.categories.map((category) => {
        if (category.id === selectedCategoryId) {
          return {
            ...category,
            name: editName,
            emoji: editEmoji || undefined,
            color: editColor,
          };
        }
        return category;
      });

      const updatedTasks = user.tasks.map((task) => {
        const updatedCategoryList = task.category?.map((category) => {
          if (category.id === selectedCategoryId) {
            return {
              id: selectedCategoryId,
              name: editName,
              emoji: editEmoji || undefined,
              color: editColor,
            };
          }
          return category;
        });

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

      showToast(
        <div>
          Updated category - <b>{editName}</b>
        </div>
      );

      setOpenEditDialog(false);
    }
  };

  if (!user.settings[0].enableCategories) {
    return <NotFound message="Categories are not enabled." />;
  }

  return (
    <>
      <TopBar title="Categories" />
      <CategoriesContainer>
        {user.categories.length > 0 ? (
          <CategoryElementsContainer>
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
                <CategoryElement key={category.id} clr={category.color}>
                  <CategoryContent translate="no">
                    <span>
                      {category.emoji && (
                        <Emoji unified={category.emoji} emojiStyle={user.emojisStyle} />
                      )}
                    </span>
                    &nbsp;
                    <span style={{ wordBreak: "break-all", fontWeight: 600 }}>{category.name}</span>
                    <Tooltip title="The percentage of completion of tasks assigned to this category">
                      <span style={{ opacity: 0.8, fontStyle: "italic" }}>{displayPercentage}</span>
                    </Tooltip>
                  </CategoryContent>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <ActionButton>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setSelectedCategoryId(category.id);
                          setOpenEditDialog(true);
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </ActionButton>
                    <ActionButton>
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
                    </ActionButton>
                  </div>
                </CategoryElement>
              );
            })}
          </CategoryElementsContainer>
        ) : (
          <p>You don't have any categories</p>
        )}
        <AddContainer>
          <h2>Add New Category</h2>
          <CustomEmojiPicker
            emoji={typeof emoji === "string" ? emoji : undefined}
            setEmoji={setEmoji}
            color={color}
            theme={getFontColor(theme.secondary) === ColorPalette.fontDark ? "light" : "dark"}
          />
          <CategoryInput
            focused
            required
            label="Category name"
            placeholder="Enter category name"
            value={name}
            onChange={handleNameChange}
            error={nameError !== ""}
            helperText={
              name == ""
                ? undefined
                : !nameError
                ? `${name.length}/${CATEGORY_NAME_MAX_LENGTH}`
                : nameError
            }
          />
          {/* <Typography>Color</Typography> */}
          <ColorPicker
            color={color}
            onColorChange={(color) => {
              setColor(color);
            }}
            width={360}
            fontColor={getFontColor(theme.secondary)}
          />
          <AddCategoryButton
            onClick={handleAddCategory}
            disabled={name.length > CATEGORY_NAME_MAX_LENGTH}
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
              padding: "12px",
              maxWidth: "600px",
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
              <DeleteRounded /> &nbsp; Delete
            </DialogBtn>
          </DialogActions>
        </Dialog>
        {/* Edit Dialog */}
        <Dialog
          open={openEditDialog}
          onClose={handleEditDimiss}
          PaperProps={{
            style: {
              borderRadius: "24px",
              padding: "12px",
              maxWidth: "600px",
            },
          }}
        >
          <DialogTitle>
            Edit Category
            {/* <b>{user.categories.find((cat) => cat.id === selectedCategoryId)?.name}</b> */}
          </DialogTitle>

          <DialogContent>
            <CustomEmojiPicker
              emoji={
                user.categories.find((cat) => cat.id === selectedCategoryId)?.emoji || undefined
              }
              setEmoji={setEditEmoji}
              width={300}
              color={editColor}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <EditNameInput
                label="Enter category name"
                placeholder="Enter category name"
                value={editName}
                error={editNameError !== "" || editName.length === 0}
                onChange={handleEditNameChange}
                helperText={
                  editNameError
                    ? editNameError
                    : editName.length === 0
                    ? "Category name is required"
                    : `${editName.length}/${CATEGORY_NAME_MAX_LENGTH}`
                }
              />
              <ColorPicker
                color={editColor}
                width="300px"
                fontColor={ColorPalette.fontDark}
                onColorChange={(clr) => {
                  setEditColor(clr);
                }}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <DialogBtn onClick={handleEditDimiss}>Cancel</DialogBtn>
            <DialogBtn
              onClick={handleEditCategory}
              disabled={editNameError !== "" || editName.length === 0}
            >
              <SaveRounded /> &nbsp; Save
            </DialogBtn>
          </DialogActions>
        </Dialog>
      </CategoriesContainer>
    </>
  );
};

export default Categories;
