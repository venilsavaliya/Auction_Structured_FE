// LoadingPage.tsx
import React from "react";
import { CircularProgress, Typography, Box } from "@mui/material";

const Loading: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <CircularProgress size={60} thickness={5} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Loading, please wait...
      </Typography>
    </Box>
  );
};

export default Loading;
