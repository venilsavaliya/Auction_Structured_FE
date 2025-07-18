import React from "react";
import {
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import type { IMultipleSearchSelectProps } from "./IMultipleSearchSelectProps";

const MultipleSearchSelect: React.FC<IMultipleSearchSelectProps> = ({
  onChange,
  optionList,
  selectedIds,
}) => {
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    // Value might be a string if autofill, otherwise it's a string[]
    onChange(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <Box>
      <FormControl fullWidth margin="normal">
        <InputLabel id="multi-checkbox-label">Select Users</InputLabel>
        <Select
          labelId="multi-checkbox-label"
          multiple
          fullWidth
          value={selectedIds}
          onChange={handleChange}
          input={<OutlinedInput label="Select Users" />}
          renderValue={() => "Select Users"}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 200,
                overflowY: "auto",
              },
            },
          }}
        >
          {optionList.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              <Checkbox checked={selectedIds.includes(user.id)} />
              <ListItemText primary={user.fullName} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default MultipleSearchSelect;
