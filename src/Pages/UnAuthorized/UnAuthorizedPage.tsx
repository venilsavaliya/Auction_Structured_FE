import React from "react";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from "react-router-dom";

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/login"); // Or redirect to dashboard if needed
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Box sx={{ mb: 3 }}>
          <LockIcon color="error" sx={{ fontSize: 60 }} />
        </Box>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
          You do not have permission to view this page.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleRedirect}>
          Go to Login
        </Button>
      </Paper>
    </Container>
  );
};

export default UnauthorizedPage;
