import styled from "@emotion/styled";
import { Category, UUID } from "../types/user";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { ColorPalette } from "../styles";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { getFontColor, showToast } from "../utils";
import { CSSProperties, useContext, useState } from "react";
import { MAX_CATEGORIES } from "../constants";
import { UserContext } from "../contexts/UserContext";
import { ExpandMoreRounded, RadioButtonChecked } from "@mui/icons-material";
import { CategoryBadge } from ".";
import { useNavigate } from "react-router-dom";

interface CategorySelectProps {
  selectedCategories: Category[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  width?: CSSProperties["width"];
  fontColor?: CSSProperties["color"];
}

/**
 * Component for selecting categories with emojis.
 */
export const CategorySelect: React.FC<CategorySelectProps> = ({
  selectedCategories,
  setSelectedCategories,
  width,
  fontColor,
}) => {
  const { user } = useContext(UserContext);
  const { categories, emojisStyle } = user;
  const [selectedCats, setSelectedCats] = useState<Category[]>(selectedCategories);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const n = useNavigate();

  const handleCategoryChange = (event: SelectChangeEvent<unknown>): void => {
    const selectedCategoryIds = event.target.value as UUID[];
    if (selectedCategoryIds.length > MAX_CATEGORIES) {
      showToast(`You cannot add more than ${MAX_CATEGORIES} categories`, {
        type: "error",
        position: "top-center",
      });

      return;
    }
    const selectedCategories = categories.filter((cat) => selectedCategoryIds.includes(cat.id));
    setSelectedCategories(selectedCategories);
    setSelectedCats(selectedCategories);
  };

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
        renderValue={() => (
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
        )}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 450,
              zIndex: 999999,
              padding: "0px 8px",
            },
          },
        }}
      >
        <HeaderMenuItem disabled>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <b>
              Select Categories{" "}
              <span
                style={{
                  transition: ".3s color",
                  color: selectedCats.length >= MAX_CATEGORIES ? "#f34141" : "currentcolor",
                }}
              >
                (max {MAX_CATEGORIES})
              </span>
            </b>
            {selectedCats.length > 0 && (
              <SelectedNames>
                Selected{" "}
                {selectedCats.length > 0 &&
                  new Intl.ListFormat("en", {
                    style: "long",
                    type: "conjunction",
                  }).format(selectedCats.map((category) => category.name))}
              </SelectedNames>
            )}
          </div>
        </HeaderMenuItem>

        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <CategoriesMenu
              key={category.id}
              value={category.id}
              clr={category.color}
              translate="no"
              disable={
                selectedCats.length >= MAX_CATEGORIES &&
                !selectedCats.some((cat) => cat.id === category.id)
              }
            >
              {selectedCats.some((cat) => cat.id === category.id) && <RadioButtonChecked />}
              {category.emoji && emojisStyle === EmojiStyle.NATIVE ? (
                <div>
                  <Emoji unified={category.emoji} emojiStyle={EmojiStyle.NATIVE} size={26} />
                </div>
              ) : (
                category.emoji && <Emoji unified={category.emoji} emojiStyle={emojisStyle} />
              )}
              &nbsp;
              {category.name}
            </CategoriesMenu>
          ))
        ) : (
          <NoCategories disableTouchRipple>
            <p>You don't have any categories</p>
            <Button
              onClick={() => {
                n("/categories");
              }}
            >
              Add Category
            </Button>
          </NoCategories>
        )}
      </StyledSelect>
    </FormControl>
  );
};

const StyledSelect = styled(Select)<{ width?: CSSProperties["width"] }>`
  margin: 12px 0;
  border-radius: 16px !important;
  transition: 0.3s all;
  width: ${({ width }) => width || "100%"};
  color: white;
  background: #ffffff18;
  z-index: 999;
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
  background: #ffffffce;
  backdrop-filter: blur(6px);
  z-index: 99;
  pointer-events: none;
`;

const SelectedNames = styled.span`
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
  &:hover {
    background: transparent !important;
  }
`;
