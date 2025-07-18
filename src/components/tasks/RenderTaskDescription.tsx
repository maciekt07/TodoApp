import React, { memo } from "react";
import { ShowMoreBtn, StyledDescriptionLink } from "./tasks.styled";
import { DESCRIPTION_SHORT_LENGTH, URL_REGEX } from "../../constants";
import { Task } from "../../types/user";
import { Tooltip } from "@mui/material";

interface RenderTaskDescriptionProps {
  task: Task;
  textHighlighter?: (text: string) => React.ReactNode;
  onExpandClick?: () => void;
  expanded?: boolean;
  enableLinks?: boolean;
}

//FIXME: show more button logic
export const RenderTaskDescription = memo(
  ({
    task,
    textHighlighter = (text) => text,
    onExpandClick,
    expanded = false,
    enableLinks = true,
  }: RenderTaskDescriptionProps) => {
    if (!task?.description) return null;

    const { description, color } = task;
    const hasLinks = description.match(URL_REGEX);
    const highlightedDescription = description;
    // const highlightedDescription =
    //       expanded || hasLinks ? description : description.slice(0, DESCRIPTION_SHORT_LENGTH);
    const parts = highlightedDescription.split(URL_REGEX);

    const descriptionWithLinks = parts.map((part, index) => {
      if (index % 2 === 0) {
        return textHighlighter(part);
      } else {
        return (
          <DescriptionLink
            key={index}
            url={part}
            color={color}
            disabled={!enableLinks}
            textHighlighter={textHighlighter}
          />
        );
      }
    });

    return (
      <div>
        {descriptionWithLinks}{" "}
        {description.length > DESCRIPTION_SHORT_LENGTH && !hasLinks && onExpandClick && (
          <ShowMoreBtn onClick={onExpandClick} clr={color}>
            {expanded ? "Show less" : "Show more"}
          </ShowMoreBtn>
        )}
      </div>
    );
  },
);

interface DescriptionLinkProps {
  url: string;
  color: string;
  disabled?: boolean;
  textHighlighter?: (text: string) => React.ReactNode;
}

const DescriptionLink = memo(
  ({ url, color, disabled = false, textHighlighter = (text) => text }: DescriptionLinkProps) => {
    let domain = "";
    try {
      const urlObj = new URL(url);
      domain = urlObj.hostname.replace("www.", "");
    } catch (error) {
      console.error(`Invalid URL: ${url}`, error);
    }

    const LinkContent = (
      <StyledDescriptionLink
        href={disabled ? undefined : url}
        rel={disabled ? undefined : "noreferrer"}
        clr={color}
        data-disabled={disabled}
        disabled={disabled}
      >
        <div>
          <img
            alt="favicon"
            src={`https://www.google.com/s2/favicons?sz=96&domain_url=${url}`}
            style={{ width: 20, height: 20, marginRight: 2, borderRadius: 4 }}
          />
          {textHighlighter(domain)}
        </div>
      </StyledDescriptionLink>
    );

    return <Tooltip title={url}>{LinkContent}</Tooltip>;
  },
);
