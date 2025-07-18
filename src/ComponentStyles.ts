import type { SxProps, Theme } from "@mui/material/styles";
import colors from "./Colors";

// Button style with proper type
export const buttonStyle: SxProps<Theme> = {
  bgcolor: colors.secondary,
  color: colors.textPrimary,
  borderRadius: "4px",
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    bgcolor: colors.primary,
  },
};

// Switch style with proper type
export const switchStyle: SxProps<Theme> = {
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: colors.secondary, // thumb color when checked
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: colors.primary, // track color when checked
  },
  "& .MuiSwitch-track": {
    backgroundColor: colors.accent, // track color when unchecked
  },
  "& .MuiSwitch-switchBase:not(.Mui-checked) .MuiSwitch-thumb": {
    backgroundColor: colors.textSecondary, // thumb color when unchecked
  },
};

export const tableHeaderCellStyle = {
  color: "white",
  fontWeight: "bold",
  backgroundColor: colors.secondary,

};

export const tableHeaderSortLableStyle = {
  color: "inherit",
  "&.Mui-active": {
    color: "white",
  },
  "&:hover": {
    color: "white", // text on hover
    ".MuiTableSortLabel-icon": {
      color: "white", // icon on hover
    },
  },
  "& .MuiTableSortLabel-icon": {
    color: "white !important",
  },
};

export const PaginationButtonStyle = {
  ".MuiTablePagination-toolbar": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    px: 2,
  },
  ".MuiTablePagination-actions": {
    display: "flex",
    gap: "8px",
  },
  ".MuiIconButton-root": {
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "6px",
    backgroundColor: "#f5f5f5",
    transition: "0.2s",
    "&:hover": {
      backgroundColor: "#e0e0e0",
    },
  },
  ".MuiTablePagination-selectLabel": {
    marginRight: "8px",
  },
  ".MuiInputBase-root": {
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "2px 8px",
    backgroundColor: "#f5f5f5",
  },
  ".MuiSelect-select": {
    padding: "8px 12px",
  },
}
