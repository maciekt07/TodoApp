import { Emoji } from "emoji-picker-react";
import { lazy, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CategoryBadge,
  ColorPicker,
  CustomDialogTitle,
  CustomEmojiPicker,
  TopBar,
} from "../components";
import type { Category, Task, UUID } from "../types/user";
import { useTheme } from "@emotion/react";
import { Delete, DeleteRounded, Edit, ExpandMoreRounded, SaveRounded } from "@mui/icons-material";
import {
  AccordionDetails,
  AccordionSummary,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import { CATEGORY_NAME_MAX_LENGTH } from "../constants";
import { UserContext } from "../contexts/UserContext";
import { useStorageState } from "../hooks/useStorageState";
import {
  ActionButton,
  AddCategoryButton,
  AddContainer,
  AssociatedTasksAccordion,
  CategoriesContainer,
  CategoryContent,
  CategoryElement,
  CategoryElementsContainer,
  CategoryInput,
  DialogBtn,
  EditNameInput,
  StarChecked,
  StarUnchecked,
} from "../styles";
import { formatDate, generateUUID, getFontColor, showToast, timeAgo } from "../utils";
import { ColorPalette } from "../theme/themeConfig";
import InputThemeProvider from "../contexts/InputThemeProvider";
import { useToasterStore } from "react-hot-toast";
import { TaskContext } from "../contexts/TaskContext";

const NotFound = lazy(() => import("./NotFound"));

//FIXME: category colors can be broken after sync

const Categories = () => {
  const { user, setUser } = useContext(UserContext);
  const { updateCategory } = useContext(TaskContext);
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
  const [editEmoji, setEditEmoji] = useState<string | null>(null);
  const [editColor, setEditColor] = useState<string>(ColorPalette.purple);

  const n = useNavigate();
  const { toasts } = useToasterStore();

  const selectedCategory = user.categories.find((cat) => cat.id === selectedCategoryId);

  useEffect(() => {
    document.title = "Todo App - Categories";
    if (!user.settings.enableCategories) {
      n("/");
    }
    if (name.length > CATEGORY_NAME_MAX_LENGTH) {
      setNameError(`Name is too long (maximum ${CATEGORY_NAME_MAX_LENGTH} characters)`);
    }
  }, [n, name.length, user.settings]);

  useEffect(() => {
    setEditColor(
      user.categories.find((cat) => cat.id === selectedCategoryId)?.color || ColorPalette.purple,
    );
    setEditName(user.categories.find((cat) => cat.id === selectedCategoryId)?.name || "");
    setEditNameError("");
  }, [selectedCategoryId, user.categories]);

  const handleDelete = (categoryId: UUID | undefined) => {
    if (!categoryId) return;

    const categoryName = user.categories.find((category) => category.id === categoryId)?.name || "";

    const updatedCategories = user.categories.filter((category) => category.id !== categoryId);
    const updatedFavoriteCategories = user.favoriteCategories.filter((id) => id !== categoryId);

    const updatedTasks = user.tasks.map((task) => {
      const updatedCategoryList = task.category?.filter((category) => category.id !== categoryId);
      return {
        ...task,
        category: updatedCategoryList,
      };
    });

    setUser((prevUser) => ({
      ...prevUser,
      categories: updatedCategories,
      favoriteCategories: updatedFavoriteCategories,
      tasks: updatedTasks,
      deletedCategories: [
        ...(prevUser.deletedCategories || []),
        ...(prevUser.deletedCategories?.includes(categoryId) ? [] : [categoryId]),
      ],
    }));

    showToast(
      <div>
        Deleted category - <b translate="no">{categoryName}.</b>
      </div>,
    );
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
        id: generateUUID(),
        lastSave: new Date(),
        name,
        emoji: emoji !== "" && emoji !== null ? emoji : undefined,
        color,
      };

      showToast(
        <div>
          Added category - <b translate="no">{newCategory.name}</b>
        </div>,
      );

      setUser((prevUser) => ({
        ...prevUser,
        categories: [...prevUser.categories, newCategory],
      }));

      setName("");
      setColor(theme.primary);
      setEmoji("");
    } else {
      showToast("Category name is required.", {
        type: "error",
        preventDuplicate: true,
        id: "category-name-required",
        visibleToasts: toasts,
      });
    }
  };

  const handleEditDimiss = () => {
    setSelectedCategoryId(undefined);
    setOpenEditDialog(false);
    setEditColor(theme.primary);
    setEditName("");
    setEditEmoji(null);
  };

  const handleEditCategory = () => {
    updateCategory({
      id: selectedCategoryId,
      name: editName,
      emoji: editEmoji || undefined,
      color: editColor,
      lastSave: new Date(),
    });

    showToast(
      <div>
        Updated category - <b translate="no">{editName}</b>
      </div>,
    );

    setOpenEditDialog(false);
  };

  const handleAddToFavorites = (category: Category) => {
    setUser((user) => ({
      ...user,
      favoriteCategories: user.favoriteCategories.includes(category.id)
        ? user.favoriteCategories.filter((id) => id !== category.id)
        : [...user.favoriteCategories, category.id],
      categories: user.categories.map((cat) =>
        cat.id === category.id ? { ...cat, lastSave: new Date() } : cat,
      ),
    }));
  };

  const getAssociatedTasks = (categoryId: UUID): Task[] => {
    return user.tasks.filter((task) => task.category?.some((cat) => cat.id === categoryId));
  };

  if (!user.settings.enableCategories) {
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
                task.category?.some((cat) => cat.id === category.id),
              );

              const completedTasksCount = categoryTasks.reduce(
                (count, task) => (task.done ? count + 1 : count),
                0,
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
                    {totalTasksCount > 0 && (
                      <Tooltip title="The percentage of completion of tasks assigned to this category">
                        <span style={{ opacity: 0.8, fontStyle: "italic" }}>
                          {displayPercentage}
                        </span>
                      </Tooltip>
                    )}
                  </CategoryContent>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <ActionButton>
                      <IconButton color="warning" onClick={() => handleAddToFavorites(category)}>
                        {user.favoriteCategories.includes(category.id) ? (
                          <StarChecked color="warning" />
                        ) : (
                          <StarUnchecked color="disabled" />
                        )}
                      </IconButton>
                    </ActionButton>
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
                          if (
                            totalTasksCount > 0 ||
                            user.favoriteCategories.includes(category.id)
                          ) {
                            // Open delete dialog if there are tasks associated to catagory or if it's a favorite
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
            name={name}
            type="category"
          />
          <InputThemeProvider>
            <CategoryInput
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
          </InputThemeProvider>
          <ColorPicker
            color={color}
            onColorChange={(color) => {
              setColor(color);
            }}
            width={400}
            fontColor={getFontColor(theme.secondary)}
          />
          <AddCategoryButton
            onClick={handleAddCategory}
            disabled={name.length > CATEGORY_NAME_MAX_LENGTH}
          >
            Create Category
          </AddCategoryButton>
        </AddContainer>
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <CustomDialogTitle
            title="Delete this category?"
            subTitle="This action cannot be undone."
            icon={<DeleteRounded />}
            onClose={() => setOpenDeleteDialog(false)}
          />

          <DialogContent>
            {selectedCategory ? (
              <>
                <CategoryBadge
                  glow={false}
                  category={user.categories.find((cat) => cat.id === selectedCategoryId)!}
                  sx={{ width: "100%", height: "100%", margin: "0 auto", borderRadius: "12px" }}
                />
                {getAssociatedTasks(selectedCategoryId!).length > 0 && (
                  <AssociatedTasksAccordion>
                    <AccordionSummary expandIcon={<ExpandMoreRounded />}>
                      <span style={{ fontWeight: 600 }}>
                        {`Associated Tasks (${getAssociatedTasks(selectedCategoryId!).length})`}
                      </span>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0, m: 0 }}>
                      <ul>
                        {user.tasks
                          .filter((task) =>
                            task.category?.some((cat) => cat.id === selectedCategoryId),
                          )
                          .map((task) => (
                            <li key={task.id}>{task.name}</li>
                          ))}
                      </ul>
                    </AccordionDetails>
                  </AssociatedTasksAccordion>
                )}
              </>
            ) : (
              <p style={{ textAlign: "center" }}>Category not found</p>
            )}
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
          slotProps={{
            paper: {
              style: {
                borderRadius: "24px",
                padding: "12px",
                minWidth: "350px",
              },
            },
          }}
        >
          <CustomDialogTitle
            title="Edit Category"
            subTitle={
              selectedCategory?.lastSave
                ? `Last edited ${timeAgo(new Date(selectedCategory.lastSave))} • ${formatDate(new Date(selectedCategory.lastSave))}`
                : "Edit the details of the category."
            }
            icon={<Edit />}
            onClose={handleEditDimiss}
          />

          <DialogContent>
            <CustomEmojiPicker
              emoji={
                user.categories.find((cat) => cat.id === selectedCategoryId)?.emoji || undefined
              }
              setEmoji={setEditEmoji}
              color={editColor}
              name={editName}
              type="category"
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
                width="350px"
                fontColor={theme.darkmode ? ColorPalette.fontLight : ColorPalette.fontDark}
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
