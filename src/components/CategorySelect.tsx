import styled from "@emotion/styled";
import { Category } from "../types/user";
import {
  Avatar,
  Box,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { CategoryChip, ColorPalette } from "../styles";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { getFontColorFromHex } from "../utils";
import { CSSProperties, useContext } from "react";
import { MAX_CATEGORIES } from "../constants";
import toast from "react-hot-toast";
import { UserContext } from "../contexts/UserContext";
import { ExpandMoreRounded } from "@mui/icons-material";

interface CategorySelectProps {
  // variant?: "standard" | "outlined" | "filled";
  width?: CSSProperties["width"];
  fontColor?: CSSProperties["color"];
  selectedCategories: Category[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}
/**
 * Component for selecting categories with emojis.
 */

export const CategorySelect: React.FC<CategorySelectProps> = ({
  width,
  fontColor,
  selectedCategories,
  setSelectedCategories,
}) => {
  const { user } = useContext(UserContext);
  const { categories, emojisStyle } = user;
  const handleCategoryChange = (event: SelectChangeEvent<unknown>): void => {
    const selectedCategoryIds = event.target.value as number[];

    if (selectedCategoryIds.length > MAX_CATEGORIES) {
      toast.error(`You cannot add more than ${MAX_CATEGORIES} categories`, {
        position: "top-center",
      });
      return;
    }

    const selectedCategories = categories.filter((cat) => selectedCategoryIds.includes(cat.id));
    setSelectedCategories(selectedCategories);
  };

  return (
    <FormControl sx={{ width: width || "100%" }}>
      <FormLabel
        sx={{
          color: fontColor ? fontColor + "e8" : ColorPalette.fontLight + "e8",
          marginLeft: "8px",
          fontWeight: 500,
        }}
      >
        Category
      </FormLabel>
      <StyledSelect
        multiple
        width={width}
        value={selectedCategories.map((cat) => cat.id)}
        onChange={handleCategoryChange}
        IconComponent={() => (
          <ExpandMoreRounded
            sx={{ marginRight: "14px", color: fontColor || ColorPalette.fontLight }}
          />
        )}
        sx={{ zIndex: 999 }}
        renderValue={() => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selectedCategories.map((cat) => (
              <CategoryChip
                key={cat.id}
                label={<span style={{ fontWeight: "bold" }}>{cat.name}</span>}
                variant="outlined"
                backgroundclr={cat.color}
                glow={false}
                translate="no"
                sx={{ cursor: "pointer" }}
                avatar={
                  cat.emoji ? (
                    <Avatar
                      alt={cat.name}
                      sx={{
                        background: "transparent",
                        borderRadius: "0px",
                      }}
                    >
                      {cat.emoji &&
                        (emojisStyle === EmojiStyle.NATIVE ? (
                          <div>
                            <Emoji size={20} unified={cat.emoji} emojiStyle={EmojiStyle.NATIVE} />
                          </div>
                        ) : (
                          <Emoji size={24} unified={cat.emoji} emojiStyle={emojisStyle} />
                        ))}
                    </Avatar>
                  ) : (
                    <></>
                  )
                }
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
              background: "white",
            },
          },
        }}
      >
        <MenuItem
          disabled
          sx={{
            opacity: "1 !important",
            fontWeight: 500,
            position: "sticky !important",
            top: 0,
            background: "white",
            zIndex: 99,
          }}
        >
          Select Categories (max {MAX_CATEGORIES})
        </MenuItem>

        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <CategoriesMenu
              key={category.id}
              value={category.id}
              clr={category.color}
              translate="no"
            >
              {category.emoji && <Emoji unified={category.emoji} emojiStyle={emojisStyle} />}
              &nbsp;
              {category.name}
            </CategoriesMenu>
          ))
        ) : (
          <MenuItem disabled sx={{ opacity: "1 !important" }}>
            You don't have any categories
          </MenuItem>
        )}
      </StyledSelect>
    </FormControl>
  );
};
const StyledSelect = styled(Select)<{ width?: CSSProperties["width"] }>`
  margin: 12px 0;
  border-radius: 16px;
  transition: 0.3s all;
  width: ${({ width }) => width || "100%"};
  color: white;
  background: #ffffff1c;
`;
const CategoriesMenu = styled(MenuItem)<{ clr?: string }>`
  padding: 8px 12px;
  border-radius: 16px;
  margin: 8px;
  display: flex;
  gap: 4px;
  font-weight: 500;
  transition: 0.2s all;
  color: ${(props) => getFontColorFromHex(props.clr || ColorPalette.fontLight)};
  background: ${({ clr }) => clr || "#bcbcbc"};
  border: 4px solid transparent;
  &:hover {
    background: ${({ clr }) => clr || "#bcbcbc"};
    opacity: 0.7;
  }

  &:focus {
    opacity: none;
  }
  &:focus-visible {
    border-color: ${ColorPalette.purple} !important;
    color: ${ColorPalette.fontDark} !important;
    transform: scale(1.05);
  }

  &.Mui-selected {
    background: ${({ clr }) => clr || "#bcbcbc"};
    color: ${(props) => getFontColorFromHex(props.clr || ColorPalette.fontLight)};
    /* box-shadow: 0 0 14px 4px ${(props) => props.clr || "#bcbcbc"}; */
    border: 4px solid #38b71f;
    display: flex;
    justify-content: left;
    align-items: center;
    font-weight: bold;
    &::after {
      content: "• selected";
      font-size: 14px;
      font-weight: 400;
    }
    &:hover {
      background: ${({ clr }) => clr || "#bcbcbc"};
      opacity: 0.7;
    }
  }
`;
