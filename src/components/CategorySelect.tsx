import styled from "@emotion/styled";
import { Category, User } from "../types/user";
import { Avatar, Box, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { CategoryChip, ColorPalette } from "../styles";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { getFontColorFromHex } from "../utils";
import { CSSProperties } from "react";
import { MAX_CATEGORIES } from "../constants";
import toast from "react-hot-toast";

interface CategorySelectProps {
  user: User;
  // variant?: "standard" | "outlined" | "filled";
  width?: CSSProperties["width"];
  selectedCategories: Category[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}
/**
 * Component for selecting categories with emojis.
 */

export const CategorySelect = ({
  user,
  width,
  selectedCategories,
  setSelectedCategories,
}: CategorySelectProps): JSX.Element => {
  const handleCategoryChange = (event: SelectChangeEvent<unknown>): void => {
    const selectedCategoryIds = event.target.value as number[];

    if (selectedCategoryIds.length > MAX_CATEGORIES) {
      toast.error(`You cannot add more than ${MAX_CATEGORIES} categories`, {
        position: "top-center",
      });
      return;
    }

    const selectedCategories = user.categories.filter((cat) =>
      selectedCategoryIds.includes(cat.id)
    );
    setSelectedCategories(selectedCategories);
  };

  return (
    <>
      <StyledSelect
        multiple
        width={width}
        value={selectedCategories.map((cat) => cat.id)}
        onChange={handleCategoryChange}
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
                        (user.emojisStyle === EmojiStyle.NATIVE ? (
                          <div>
                            <Emoji size={20} unified={cat.emoji} emojiStyle={EmojiStyle.NATIVE} />
                          </div>
                        ) : (
                          <Emoji size={24} unified={cat.emoji} emojiStyle={user.emojisStyle} />
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
              maxHeight: 400,
              zIndex: 999999,
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

        {user.categories && user.categories.length > 0 ? (
          user.categories.map((category) => (
            <CategoriesMenu key={category.id} value={category.id} clr={category.color}>
              {category.emoji && <Emoji unified={category.emoji} emojiStyle={user.emojisStyle} />}
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
    </>
  );
};
const StyledSelect = styled(Select)<{ width?: CSSProperties["width"] }>`
  margin: 12px 0;
  border-radius: 16px;
  transition: 0.3s all;
  width: ${({ width }) => width || "100%"};
  color: white;
  /* border: 3px solid ${ColorPalette.purple}; */
  & * {
    border-color: ${ColorPalette.purple};
  }
`;
const CategoriesMenu = styled(MenuItem)<{ clr?: string }>`
  padding: 12px 20px;
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

  &.Mui-selected {
    background: ${({ clr }) => clr || "#bcbcbc"};
    color: ${(props) => getFontColorFromHex(props.clr || ColorPalette.fontLight)};
    /* box-shadow: 0 0 14px 4px ${(props) => props.clr || "#bcbcbc"}; */
    border: 4px solid ${ColorPalette.purple};
    font-weight: bold;
    &::before {
      content: "•";
    }
    &:hover {
      background: ${({ clr }) => clr || "#bcbcbc"};
      opacity: 0.7;
    }
  }
`;
