import { Box, Typography } from "@mui/material";
import { type FC } from "react";
// import colors from "../styles/Colors";
import colors from "../../Colors";

// Define prop types
interface InfoRowProps {
  label: string;
  value: string|number; // value can be string, number, JSX, etc.
}

const InfoRow: FC<InfoRowProps> = ({ label, value }) => {
  return (
    <Box sx={{ marginBottom: 2 }} display={"flex"} gap={1}>
      <Typography fontWeight={600} color={colors.secondary}>
        {label}:
      </Typography>
      <Typography>{value}</Typography>
    </Box>
  );
};

export default InfoRow;
