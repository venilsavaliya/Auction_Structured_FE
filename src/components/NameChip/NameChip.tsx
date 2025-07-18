import { Box, IconButton } from "@mui/material";
import React from "react";
import ClearIcon from "@mui/icons-material/Clear";
import colors from "../../Colors";
import type { INameChipProps } from "./INameChipProps";


const NameChip: React.FC<INameChipProps> = ({ id, username, onRemoveName }) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        bgcolor: colors.chipBg,
        width: "fit-content",
        borderRadius: "15px",
        pl: "10px",
        pr: "6px",
        py: 1,
        gap: 1,
      }}
    >
      <Box fontSize="12px">{username}</Box>
      <IconButton size="small" onClick={() => onRemoveName(id)} sx={{ p: 0 }}>
        <ClearIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default NameChip;
