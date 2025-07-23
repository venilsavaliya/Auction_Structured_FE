import { Avatar, Box, Paper, Typography } from "@mui/material";
import React from "react";

const UserBidCard: React.FC = () => {
  return (
    <Paper elevation={8} sx={{ borderRadius: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            sx={{
              height: "50px",
              width: "50px",
            }}
          />
          <Typography>Venil Savaliya</Typography>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography fontSize={18} fontWeight={600}>
            ₹ 30.0 L
          </Typography>
          <Typography variant="caption">03:05:22</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserBidCard;
