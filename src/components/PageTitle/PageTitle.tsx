import { Box, Typography } from "@mui/material";
import type { IPageTitleProps } from "./IPageTitleProps";
import colors from "../../Colors";

const PageTitle = ({ title } : IPageTitleProps) => {
  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          color: colors.primary,
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default PageTitle;
