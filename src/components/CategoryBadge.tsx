import { Avatar, Chip, ChipProps, styled } from "@mui/material";
import { getFontColor } from "../utils";
import { fadeIn } from "../styles";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import type { Category } from "../types/user";

interface CategoryBadgeProps extends ChipProps, StyledBadgeProps {
  category: Category;
  /**
   * Array representing emoji sizes: [normal, native]
   */
  emojiSizes?: [number, number];
}
/**
 * Component for displaying a category badge.
 */
export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, emojiSizes, ...props }) => {
  const { user } = useContext(UserContext);
  const { emojisStyle, settings } = user;

  return (
    <StyledCategoryBadge
      key={category.id}
      label={<span style={{ fontWeight: "bold" }}>{category.name}</span>}
      variant="outlined"
      backgroundclr={category.color}
      glow={settings[0].enableGlow}
      translate="no"
      avatar={
        category.emoji ? (
          <Avatar
            alt={category.name}
            sx={{
              background: "transparent",
              borderRadius: "0px",
            }}
          >
            {category.emoji &&
              (emojisStyle === EmojiStyle.NATIVE ? (
                <div>
                  <Emoji
                    size={emojiSizes ? emojiSizes[1] : 18}
                    unified={category.emoji}
                    emojiStyle={EmojiStyle.NATIVE}
                  />
                </div>
              ) : (
                <Emoji
                  size={emojiSizes ? emojiSizes[0] : 20}
                  unified={category.emoji}
                  emojiStyle={emojisStyle}
                />
              ))}
          </Avatar>
        ) : undefined
      }
      {...props}
    />
  );
};

interface StyledBadgeProps {
  backgroundclr?: string;
  borderclr?: string;
  glow?: boolean;
  list?: boolean | string;
}

export const StyledCategoryBadge = styled(Chip)<StyledBadgeProps>`
  color: ${({ backgroundclr }) => getFontColor(backgroundclr || "")};
  background-color: ${({ backgroundclr }) => backgroundclr};
  box-shadow: ${({ glow, backgroundclr }) => (glow ? `0 0 8px 0 ${backgroundclr}` : "none")};
  border: ${({ borderclr }) => (borderclr ? `2px solid ${borderclr}` : "none")};
  font-weight: bold;
  font-size: 14px;
  margin: 6px 0 0 0;
  padding: 8px;
  transition: 0.3s all;
  /* opacity: ${({ list }) => (list ? 1 : 0.9)}; */
  animation: ${fadeIn} 0.5s ease-in;

  &:hover {
    background-color: ${(props) => props.backgroundclr + "!important"};
    /* box-shadow: ${({ list, backgroundclr }) => list && `0 0 8px 0px ${backgroundclr}`}; */
    opacity: ${({ list }) => list && 0.8};
  }

  &:focus-visible {
    opacity: 0.8;
    background-color: ${({ backgroundclr }) => backgroundclr};
  }
  &:focus {
    opacity: none;
  }

  & .MuiChip-deleteIcon {
    color: ${({ backgroundclr }) => getFontColor(backgroundclr || "")};
    transition: 0.3s all;
    width: 22px;
    height: 22px;
    stroke: transparent;
    @media (max-width: 1024px) {
      width: 26px;
      height: 26px;
    }
    &:hover {
      color: ${({ backgroundclr }) => getFontColor(backgroundclr || "")};
      opacity: 0.8;
    }
  }
`;
