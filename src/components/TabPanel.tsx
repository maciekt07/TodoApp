import { Box, Typography } from "@mui/material";
import React, { createContext, ReactNode, useContext } from "react";

const TabGroupContext = createContext<string | undefined>(undefined);

interface TabGroupProviderProps {
  name: string;
  children: ReactNode;
}

export const TabGroupProvider: React.FC<TabGroupProviderProps> = ({ name, children }) => {
  return <TabGroupContext.Provider value={name}>{children}</TabGroupContext.Provider>;
};

const useTabGroupName = () => {
  const name = useContext(TabGroupContext);
  if (!name) {
    throw new Error("TabPanel must be used within a TabGroupProvider.");
  }
  return name;
};

interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  index: number;
  value: number;
}

export function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  const name = useTabGroupName();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`${name}-tabpanel-${index}`}
      aria-labelledby={`${name}-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
