import { RecurringIntervals } from "../types/user";
import { useState } from "react";
import { FormGroup, Select, SelectChangeEvent, MenuItem, FormControl, InputLabel } from "@mui/material";

interface RecurringIntervalSelectProps {
    selectedRecurringInterval: string;
    onRecurringChange: (selectedRecurringInterval: string) => void;
}

/**
 * Component for selecting recurring interval.
 */
export const RecurringIntervalSelect: React.FC<RecurringIntervalSelectProps> = ({
    selectedRecurringInterval,
    onRecurringChange
}) => {
    const [recurringInterval, setRecurringInterval] = useState<string>(selectedRecurringInterval);

    const handleRecurringIntervalChange = (event: SelectChangeEvent<unknown>) => {
        const selectedRecurringInterval = event.target.value as string;
        setRecurringInterval(selectedRecurringInterval);
        onRecurringChange?.(selectedRecurringInterval);
    };

      // Array of available dark mode options
    const recurringIntervals: {
        label: string;
        mode: RecurringIntervals;
    }[] = [
        {
        label: "Daily",
        mode: "daily",
        },
        {
        label: "Weekly",
        mode: "weekly",
        },
        {
        label: "Monthly",
        mode: "monthly",
        },
        {
        label: "Yearly",
        mode: "yearly",
        },
    ];
        
    return (
        <FormGroup>
            <FormControl
              size="small"
              variant="outlined"
              sx={{ m: 1, minWidth: 120 }}
            >
              <InputLabel id="recurring-select-label">Interval</InputLabel>
              <Select
                labelId="recurring-select-label"
                label="Interval"
                value={recurringInterval}
                onChange={handleRecurringIntervalChange}
              >
                {recurringIntervals.map((option) => (
                  <MenuItem key={option.mode} value={option.mode}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </FormGroup>
    );
}