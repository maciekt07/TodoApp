import React, { memo, useContext } from "react";
import { URL_REGEX, DESCRIPTION_SHORT_LENGTH } from "../../constants";
import { Task } from "../../types/user";
import { Button, Tooltip } from "@mui/material";
import { TaskContext } from "../../contexts/TaskContext";
import styled from "@emotion/styled";
import { getFontColor } from "../../utils";
import { LinkOffRounded } from "@mui/icons-material";

interface RenderTaskDescriptionProps {
  task: Task;
  textHighlighter?: (text: string) => React.ReactNode;
  enableLinks?: boolean;
  enableMoreButton?: boolean;
}

export const RenderTaskDescription = memo(
  ({
    task,
    textHighlighter = (text) => text,
    enableLinks = true,
    enableMoreButton = false,
  }: RenderTaskDescriptionProps) => {
    const { expandedTasks, toggleShowMore } = useContext(TaskContext);
    if (!task.description) return null;

    const isExpanded = enableMoreButton ? expandedTasks.includes(task.id) : false;

    const { description, color } = task;

    // split the description into parts preserving links
    const parts = description.split(URL_REGEX);

    // calculate effective length where urls count as their domain name length
    const effectiveLength = parts.reduce((length, part, index) => {
      const isURL = index % 2 === 1;
      if (isURL) {
        try {
          const domain = new URL(part).hostname.replace("www.", "");
          return length + domain.length;
        } catch {
          return length + part.length;
        }
      }
      return length + part.length;
    }, 0);

    const shouldShowButton = enableMoreButton && effectiveLength > DESCRIPTION_SHORT_LENGTH;

    let truncatedParts = parts;
    let showMore = false;

    if (!isExpanded && effectiveLength > DESCRIPTION_SHORT_LENGTH) {
      let currentLength = 0;
      let truncateIndex = -1;

      // find where to truncate while keeping links intact
      for (let i = 0; i < parts.length; i++) {
        const isURL = i % 2 === 1;
        const part = parts[i];

        if (isURL) {
          // calculate urls effective displayed length (domain name length)
          let urlEffectiveLength;
          try {
            const domain = new URL(part).hostname.replace("www.", "");
            urlEffectiveLength = domain.length;
          } catch {
            urlEffectiveLength = part.length;
          }

          if (currentLength < DESCRIPTION_SHORT_LENGTH) {
            currentLength += urlEffectiveLength;
            if (currentLength > DESCRIPTION_SHORT_LENGTH) {
              truncateIndex = i;
              break;
            }
          } else {
            truncateIndex = i;
            break;
          }
        } else {
          // for text parts
          if (currentLength + part.length > DESCRIPTION_SHORT_LENGTH) {
            truncateIndex = i;
            const remainingLength = DESCRIPTION_SHORT_LENGTH - currentLength;
            parts[i] = part.slice(0, remainingLength);
            break;
          }
          currentLength += part.length;
        }
      }

      if (truncateIndex !== -1) {
        truncatedParts = parts.slice(0, truncateIndex + 1);
        showMore = true;
      }
    }

    const descriptionWithLinks = truncatedParts.map((part, index) => {
      const isURL = index % 2 === 1;
      return isURL ? (
        <DescriptionLink
          key={index}
          url={part}
          color={color}
          disabled={!enableLinks}
          textHighlighter={textHighlighter}
        />
      ) : (
        <React.Fragment key={index}>{textHighlighter(part)}</React.Fragment>
      );
    });

    return (
      <>
        <ScreenDescription title={!isExpanded && shouldShowButton ? task.description : undefined}>
          {descriptionWithLinks}
          {!isExpanded && showMore && !task.done && "..."}
          {shouldShowButton && !task.done && (
            <ShowMoreBtn onClick={() => toggleShowMore(task.id)} clr={color}>
              {isExpanded ? "Show Less" : "Show More"}
            </ShowMoreBtn>
          )}
        </ScreenDescription>
        <PrintDescription>{task.description}</PrintDescription>
      </>
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
        id="task-description-link"
        clr={color}
        data-disabled={disabled}
        disabled={disabled}
      >
        {/* put a tag inside button to enable link preview on ios */}
        <a
          href={disabled ? undefined : url}
          rel={disabled ? undefined : "noreferrer"}
          target="_blank"
        >
          <div>
            {disabled ? (
              <LinkOffRounded />
            ) : (
              <FaviconImage
                draggable={false}
                alt="favicon"
                src={`https://www.google.com/s2/favicons?sz=96&domain_url=${url}`}
                style={{ width: 20, height: 20, marginRight: 2, borderRadius: 4 }}
              />
            )}
            {textHighlighter(domain)}
          </div>
        </a>
      </StyledDescriptionLink>
    );

    return <Tooltip title={url}>{LinkContent}</Tooltip>;
  },
);

const FaviconImage = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 2px;
  border-radius: 4px;

  -webkit-user-drag: none;

  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const ShowMoreBtn = styled(Button)<{ clr: string }>`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: bolder;
  transition: 0.3s color;
  color: ${({ clr }) => getFontColor(clr)};
  text-shadow: ${({ clr }) => `0 0 8px ${getFontColor(clr) + 45}`};
  text-transform: capitalize;
  border-radius: 6px;
  padding: 0 4px;
  margin: 0 4px;
  @media print {
    color: black;
  }
`;

const StyledDescriptionLink = styled(Button)<{ clr: string }>`
  margin: 0;
  color: ${({ clr }) => getFontColor(clr)};
  padding: 0 4px;
  display: inline-block;
  background: ${({ clr }) => getFontColor(clr)}28;
  backdrop-filter: none !important;
  text-transform: none !important;
  min-width: unset !important;
  user-select: auto !important;
  border-radius: 6px;
  &:hover {
    background: ${({ clr }) => getFontColor(clr)}19;
  }
  & div {
    word-break: break-all;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  @media print {
    color: black;
  }
`;

const ScreenDescription = styled.div`
  @media print {
    display: none !important;
  }
`;

const PrintDescription = styled.div`
  display: none;

  @media print {
    display: block !important;
    color: black !important;
  }
`;
