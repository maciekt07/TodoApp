import { useState } from "react";
import { DateTimePicker } from "@mui/x-date-pickers";
import styled from "@emotion/styled";

interface Props {
  startDate: Date;
  endDate: Date;
  onChange: (startDate: Date, endDate: Date) => void;
}

export const StartEndDate = ({ startDate, endDate, onChange }: Props) => {
  const [startError, setStartError] = useState<string | null>(null);
  const [endError, setEndError] = useState<string | null>(null);

  const handleStartDateChange = (newDate: Date | null) => {
    if (!newDate) return;

    if (newDate > endDate) {
      setStartError("Start date cannot be after end date");
    } else {
      setStartError(null);
      setEndError(null);
      onChange(newDate, endDate);
    }
  };

  const handleEndDateChange = (newDate: Date | null) => {
    if (!newDate) return;

    if (newDate < startDate) {
      setEndError("End date cannot be before start date");
    } else {
      setStartError(null);
      setEndError(null);
      onChange(startDate, newDate);
    }
  };

  return (
    <DatePickerContainer>
      <DateTimePicker
        label="Start Date & Time"
        value={startDate}
        onChange={handleStartDateChange}
        slotProps={{
          textField: {
            fullWidth: true,
            error: !!startError,
            helperText: startError,
          },
        }}
      />
      <DateTimePicker
        label="End Date & Time"
        value={endDate}
        onChange={handleEndDateChange}
        slotProps={{
          textField: {
            fullWidth: true,
            error: !!endError,
            helperText: endError,
          },
        }}
      />
    </DatePickerContainer>
  );
};

const DatePickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  margin: 8px 0;
`;
