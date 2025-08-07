import React from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const ProfilePage: React.FC = () => {
  // Mock user data
  const user = {
    name: "Venil Savaliya",
    email: "venil@example.com",
    role: "Full Stack Developer",
    avatarUrl: "https://i.pravatar.cc/150?img=3", // Or use your image
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Profile
      </Typography>

      <Card elevation={3}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                src={user.avatarUrl}
                alt={user.name}
                sx={{ width: 100, height: 100 }}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="h6">{user.name}</Typography>
              <Typography color="text.secondary">{user.email}</Typography>
              <Typography color="text.secondary">{user.role}</Typography>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                size="small"
              >
                Edit
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Full Name
              </Typography>
              <Typography variant="body1">{user.name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{user.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Role
              </Typography>
              <Typography variant="body1">{user.role}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfilePage;
