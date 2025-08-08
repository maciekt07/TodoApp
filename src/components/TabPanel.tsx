import { Box, BoxProps } from "@mui/material";
import { createContext, ReactNode, useContext } from "react";

const TabGroupContext = createContext<{ name: string; value: number } | undefined>(undefined);

interface TabGroupProviderProps {
  name: string;
  value: number;
  children: ReactNode;
}

export const TabGroupProvider: React.FC<TabGroupProviderProps> = ({ name, value, children }) => {
  return <TabGroupContext.Provider value={{ name, value }}>{children}</TabGroupContext.Provider>;
};

const useTabGroupContext = () => {
  const context = useContext(TabGroupContext);
  if (!context) {
    throw new Error("TabPanel must be used within a TabGroupProvider.");
  }
  return context;
};

interface TabPanelProps extends BoxProps {
  children?: ReactNode;
  index: number;
}

export function TabPanel({ children, index, ...other }: TabPanelProps) {
  const { name, value } = useTabGroupContext();

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`${name}-tabpanel-${index}`}
      aria-labelledby={`${name}-tab-${index}`}
      style={{ overflowX: "hidden" }}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </Box>
  );
}
