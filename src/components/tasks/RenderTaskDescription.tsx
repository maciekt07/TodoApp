import React, { JSX, memo } from "react";
import { ShowMoreBtn } from "./tasks.styled";
import { DESCRIPTION_SHORT_LENGTH, URL_REGEX } from "../../constants";
import { Task } from "../../types/user";
import { GitHub, Language, Link, LinkedIn, LinkOff, Reddit, X, YouTube } from "@mui/icons-material";
import { StyledDescriptionLink } from "./tasks.styled";
import { Tooltip } from "@mui/material";

interface RenderTaskDescriptionProps {
  task: Task;
  textHighlighter?: (text: string) => React.ReactNode;
  onExpandClick?: () => void;
  expanded?: boolean;
  enableLinks?: boolean;
}

export const RenderTaskDescription = memo(
  ({
    task,
    textHighlighter = (text) => text,
    onExpandClick,
    expanded = false,
    enableLinks = true,
  }: RenderTaskDescriptionProps) => {
    if (!task || !task.description) {
      return null;
    }

    const { description, color } = task;
    const hasLinks = description.match(URL_REGEX);
    const highlightedDescription =
      expanded || hasLinks ? description : description.slice(0, DESCRIPTION_SHORT_LENGTH);

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
        {task.description &&
          task.description.length > DESCRIPTION_SHORT_LENGTH &&
          !hasLinks &&
          onExpandClick && (
            <ShowMoreBtn onClick={onExpandClick} clr={task.color}>
              {expanded ? "Show less" : "Show more"}
            </ShowMoreBtn>
          )}
      </div>
    );
  },
);

interface DomainMappings {
  regex: RegExp;
  domainName?: string;
  icon: JSX.Element;
}

const domainMappings: DomainMappings[] = [
  { regex: /(m\.)?youtu(\.be|be\.com)/, domainName: "Youtube", icon: <YouTube /> },
  {
    regex: /(twitter\.com|x\.com)/,
    domainName: "X",
    icon: <X sx={{ fontSize: "18px" }} />,
  },
  { regex: /github\.com/, domainName: "Github", icon: <GitHub sx={{ fontSize: "20px" }} /> },
  { regex: /reddit\.com/, domainName: "Reddit", icon: <Reddit /> },
  { regex: /linkedin\.com/, domainName: "LinkedIn", icon: <LinkedIn /> },
  { regex: /localhost/, icon: <Language /> },
  { regex: /.*/, icon: <Link /> }, // Default icon for other domains
];

interface DescriptionLinkProps {
  url: string;
  color: string;
  disabled?: boolean;
  textHighlighter?: (text: string) => React.ReactNode;
}

const DescriptionLink = memo(
  ({ url, color, disabled = false, textHighlighter = (text) => text }: DescriptionLinkProps) => {
    let domain = "";
    let displayName = "";
    let icon = disabled ? <LinkOff sx={{ fontSize: "24px" }} /> : <Link />;

    try {
      const urlObj = new URL(url);
      domain = urlObj.hostname.replace("www.", "");

      if (!disabled) {
        // Find matching domain mapping
        const mapping = domainMappings.find(({ regex }) => domain.match(regex));
        if (mapping) {
          icon = mapping.icon;
          displayName = mapping.domainName || domain;
        }
      }
    } catch (error) {
      console.error(`Invalid URL: ${url}`, error);
    }

    const LinkComponent = (
      <StyledDescriptionLink
        href={disabled ? undefined : url}
        rel={disabled ? undefined : "noreferrer"}
        clr={color}
        data-disabled={disabled}
        disabled={disabled}
      >
        <div>
          {icon} {textHighlighter(displayName || domain)}
        </div>
      </StyledDescriptionLink>
    );

    return <Tooltip title={url}>{LinkComponent}</Tooltip>;
  },
);
