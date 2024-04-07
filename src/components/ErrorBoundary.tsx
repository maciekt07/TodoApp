import React, { ErrorInfo } from "react";
import { StyledLink } from "../styles";
import { Emoji } from "emoji-picker-react";
import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from "@mui/material";
import { exportTasksToJson, getFontColor, showToast } from "../utils";
import {
  DeleteForeverRounded,
  DescriptionRounded,
  ErrorOutlineRounded,
  ExpandMoreRounded,
  FileDownload,
} from "@mui/icons-material";
import { UserContext } from "../contexts/UserContext";
import styled from "@emotion/styled";
import { TaskIcon } from ".";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary component that catches and displays errors.
 */

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static contextType = UserContext;
  declare context: React.ContextType<typeof UserContext>;
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error: error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error:", error);
    console.error("Error Info:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const { user } = this.context;

      return (
        <div>
          <ErrorHeader>
            <span>Oops! An error occurred.&nbsp;</span>
            <span>
              <Emoji size={38} unified="1f644" />
            </span>
          </ErrorHeader>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "8px",
            }}
          >
            <TaskIcon scale={0.6} variant="error" />
          </div>
          <h2>
            To fix it, try clearing your local files (cookies and cache) and then refresh the page.
            If the problem persists, please report the issue via{" "}
            <StyledLink href="https://github.com/maciekt07/TodoApp/issues">
              Github Issues
            </StyledLink>
            .
          </h2>
          <Button
            size="large"
            variant="outlined"
            color="warning"
            sx={{ p: "10px 20px", borderRadius: "12px" }}
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              location.reload();
            }}
          >
            <DeleteForeverRounded /> &nbsp; Auto Clear
          </Button>

          <h3>
            <span style={{ color: "#ff3131", display: "inline-block" }}>
              <ErrorOutlineRounded sx={{ verticalAlign: "middle", mb: "4px" }} /> ERROR:
            </span>{" "}
            [{this.state.error?.name}] {this.state.error?.message}
          </h3>

          <ErrorAccordion disableGutters>
            <AccordionSummary expandIcon={<ErrorExpandIcon />}>
              <Typography
                fontWeight={700}
                fontSize={18}
                sx={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <DescriptionRounded /> Error stack
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ opacity: 0.8, fontSize: "12px" }}>
                {this.state.error?.stack?.replace(this.state.error?.message, "")}
              </div>
            </AccordionDetails>
          </ErrorAccordion>

          <pre>
            <Button
              variant="outlined"
              sx={{ m: "14px 6px", p: "12px 20px", borderRadius: "14px" }}
              onClick={() => {
                exportTasksToJson(user.tasks);
                showToast(`Exported all tasks (${user.tasks.length})`);
              }}
            >
              <FileDownload /> &nbsp; Export Tasks To JSON
            </Button>
            <br />
            <code>{JSON.stringify(user, null, 4)}</code>
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
// eslint-disable-next-line react-refresh/only-export-components
const ErrorHeader = styled.h1`
  margin-top: 32px;
  margin-bottom: 32px;
  font-size: 36px;
  color: #ff3131;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    text-align: left;
    justify-content: left;
    font-size: 30px;
    margin-top: 0;
    margin-bottom: 0;
  }
`;

// eslint-disable-next-line react-refresh/only-export-components
const ErrorAccordion = styled(Accordion)`
  /* border: ${({ theme }) => `2px solid ${getFontColor(theme.secondary)}2e`}; */
  color: ${({ theme }) => getFontColor(theme.secondary)};
  border-radius: 14px !important;
  background: ${({ theme }) => getFontColor(theme.secondary) + "18"};
  box-shadow: none;
  padding: 4px;
  margin-bottom: 18px;
`;

// eslint-disable-next-line react-refresh/only-export-components
const ErrorExpandIcon = styled(ExpandMoreRounded)`
  color: ${({ theme }) => getFontColor(theme.secondary)};
  font-size: 32px;
`;
