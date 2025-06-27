import styled from "@emotion/styled";
import {
  AddRounded,
  EditRounded,
  ExpandMoreRounded,
  RadioButtonChecked,
  StarRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  useTheme,
  ListSubheader,
} from "@mui/material";
import { Emoji } from "emoji-picker-react";
import { CSSProperties, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CategoryBadge } from ".";
import { MAX_CATEGORIES_IN_TASK } from "../constants";
import { UserContext } from "../contexts/UserContext";
import type { Category, UUID } from "../types/user";
import { getFontColor, showToast } from "../utils";
import { ColorPalette } from "../theme/themeConfig";
import { useSystemTheme } from "../hooks/useSystemTheme";
import { isDarkMode } from "../theme/createTheme";

interface CategorySelectProps {
  selectedCategories: Category[];
  onCategoryChange: (categories: Category[]) => void;
  width?: CSSProperties["width"];
  fontColor?: CSSProperties["color"];
}

/**
 * Component for selecting categories with emojis.
 */
export const CategorySelect: React.FC<CategorySelectProps> = ({
  selectedCategories,
  onCategoryChange,
  width,
  fontColor,
}) => {
  const { user } = useContext(UserContext);
  const { categories, emojisStyle, favoriteCategories } = user;
  const [selectedCats, setSelectedCats] = useState<Category[]>(selectedCategories);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const muiTheme = useTheme();
  const systemTheme = useSystemTheme();

  const handleCategoryChange = (event: SelectChangeEvent<unknown>): void => {
    const selectedCategoryIds = event.target.value as UUID[];
    if (selectedCategoryIds.length > MAX_CATEGORIES_IN_TASK) {
      showToast(`You cannot add more than ${MAX_CATEGORIES_IN_TASK} categories`, {
        type: "error",
        position: "top-center",
      });

      return;
    }
    const selectedCategories = categories.filter((cat) => selectedCategoryIds.includes(cat.id));
    setSelectedCats(selectedCategories);
    onCategoryChange?.(selectedCategories);
  };

  // group categories by favorite status
  const favoriteCats = categories.filter(
    (cat) => favoriteCategories && favoriteCategories.includes(cat.id),
  );
  const otherCats = categories.filter(
    (cat) => !favoriteCategories || !favoriteCategories.includes(cat.id),
  );

  return (
    <FormControl sx={{ width: width || "100%" }}>
      <FormLabel
        sx={{
          color: fontColor ? `${fontColor}e8` : `${ColorPalette.fontLight}e8`,
          marginLeft: "8px",
          fontWeight: 500,
        }}
      >
        Category
      </FormLabel>

      <StyledSelect
        multiple
        width={width}
        value={selectedCats.map((cat) => cat.id)}
        onChange={handleCategoryChange}
        open={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        IconComponent={() => (
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <ExpandMoreRounded
              sx={{
                marginRight: "14px",
                color: fontColor || ColorPalette.fontLight,
                transform: isOpen ? "rotate(180deg)" : "none",
              }}
            />
          </Box>
        )}
        displayEmpty
        renderValue={() =>
          selectedCats.length > 0 ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "4px 8px" }}>
              {selectedCats.map((category) => (
                <CategoryBadge
                  key={category.id}
                  category={category}
                  sx={{ cursor: "pointer" }}
                  glow={false}
                />
              ))}
            </Box>
          ) : (
            <Box sx={{ color: fontColor }}>Select Categories</Box>
          )
        }
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 450,
              zIndex: 999999,
              padding: "0px 8px",
              background: isDarkMode(user.darkmode, systemTheme, muiTheme.palette.secondary.main)
                ? "#2f2f2f"
                : "#ffffff",
            },
          },
        }}
      >
        {(() => {
          const renderCategoryItem = (category: Category) => (
            <CategoriesMenu
              key={category.id}
              value={category.id}
              clr={category.color}
              tabIndex={0}
              translate="no"
              disable={
                selectedCats.length >= MAX_CATEGORIES_IN_TASK &&
                !selectedCats.some((cat) => cat.id === category.id)
              }
            >
              {selectedCats.some((cat) => cat.id === category.id) && <RadioButtonChecked />}
              {category.emoji && <Emoji unified={category.emoji} emojiStyle={emojisStyle} />}
              &nbsp;
              {category.name}
            </CategoriesMenu>
          );
          const createCategoryGroup = (
            cats: Category[],
            headerText: React.ReactElement | string,
            headerId: string,
          ) => {
            if (cats.length === 0) return [];

            return [
              <StyledListSubheader key={headerId} tabIndex={-1}>
                {headerText}
              </StyledListSubheader>,
              ...cats.map(renderCategoryItem),
            ];
          };

          if (categories && categories.length > 0) {
            return [
              <HeaderMenuItem key="header-info" disabled>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <b>
                    Select Categories{" "}
                    <span
                      style={{
                        transition: ".3s color",
                        color:
                          selectedCats.length >= MAX_CATEGORIES_IN_TASK
                            ? "#f34141"
                            : "currentcolor",
                      }}
                    >
                      {categories.length > 3 && <span>(max {MAX_CATEGORIES_IN_TASK})</span>}
                    </span>
                  </b>
                  <SelectedNames>
                    Selected:{" "}
                    {selectedCats.length > 0 ? (
                      new Intl.ListFormat("en", {
                        style: "long",
                        type: "conjunction",
                      }).format(selectedCats.map((category) => category.name))
                    ) : (
                      <span style={{ fontStyle: "italic" }}>none</span>
                    )}
                  </SelectedNames>
                </div>
              </HeaderMenuItem>,
              ...createCategoryGroup(
                favoriteCats,
                <>
                  <StarRounded color="warning" sx={{ fontSize: "18px" }} />
                  &nbsp;Favorite Categories
                </>,
                "header-favorites",
              ),
              ...createCategoryGroup(
                otherCats,
                favoriteCats.length > 0 ? "Other Categories" : "",
                "header-others",
              ),
              <div key="footer" style={{ margin: "8px" }}>
                <Divider sx={{ mb: "12px", mt: "16px" }} />
                <Link to="/categories">
                  <Button fullWidth variant="outlined" sx={{ mb: "8px", mt: "2px" }}>
                    <EditRounded /> &nbsp; Modify Categories
                  </Button>
                </Link>
              </div>,
            ];
          } else {
            return [
              <NoCategories key="no-categories" disableTouchRipple>
                <p>You don't have any categories</p>
                <Link to="/categories" style={{ width: "100%" }}>
                  <Button fullWidth variant="outlined">
                    <AddRounded /> &nbsp; Create Category
                  </Button>
                </Link>
              </NoCategories>,
            ];
          }
        })()}
      </StyledSelect>
    </FormControl>
  );
};

const StyledSelect = styled(Select)<{ width?: CSSProperties["width"] }>`
  margin: 12px 0;
  border-radius: 16px !important;
  transition: 0.3s all;
  width: ${({ width }) => width || "100%"};

  /* background: #ffffff18; */
  z-index: 999;
  border: none !important;
`;
const CategoriesMenu = styled(MenuItem)<{ clr: string; disable?: boolean }>`
  padding: 12px 16px;
  border-radius: 16px;
  margin: 8px;
  display: flex;
  gap: 4px;
  font-weight: 600;
  transition: 0.2s all;
  color: ${(props) => getFontColor(props.clr || ColorPalette.fontLight)};
  background: ${({ clr }) => clr};
  opacity: ${({ disable }) => (disable ? ".6" : "none")};
  &:hover {
    background: ${({ clr }) => clr};
    opacity: ${({ disable }) => (disable ? "none" : ".8")};
  }

  &:focus {
    opacity: none;
  }

  &:focus-visible {
    border-color: ${({ theme }) => theme.primary} !important;
  }

  &.Mui-selected {
    background: ${({ clr }) => clr};
    color: ${(props) => getFontColor(props.clr || ColorPalette.fontLight)};
    display: flex;
    justify-content: left;
    align-items: center;
    font-weight: 800;
    &:hover {
      background: ${({ clr }) => clr};
      opacity: 0.7;
    }
  }
`;
const HeaderMenuItem = styled(MenuItem)`
  opacity: 1 !important;
  font-weight: 500;
  position: sticky !important;
  top: 0;
  z-index: 99;
  pointer-events: none !important;
  cursor: default !important;
  background-color: ${({ theme }) => (theme.darkmode ? "#2e2e2e" : "#ffffff")};
  line-height: 20px;
`;

const SelectedNames = styled.div`
  opacity: 0.9;
  font-size: 15px;
  word-break: break-all;
  max-width: 300px;
`;

const NoCategories = styled(MenuItem)`
  opacity: 1 !important;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 12px 0;
  gap: 6px;
  cursor: default !important;
  & p {
    margin: 20px 0 32px 0;
  }
  &:hover {
    background: transparent !important;
  }
`;

const StyledListSubheader = styled(ListSubheader)`
  background-color: ${({ theme }) => (theme.darkmode ? "#2e2e2e" : "#ffffff")};
  font-weight: 600;
  position: sticky;
  z-index: 1;
  top: 52px;
  line-height: 28px;
  display: flex;
  align-items: center;
`;
