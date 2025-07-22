import { Avatar, Box, Button, Paper, Typography } from "@mui/material";
import {type FC } from "react";
import { buttonStyle } from "../../ComponentStyles";
import { formatIndianCurrency } from "../../Utility/Utility";
import type { AuctionTeam } from "../../Models/ResponseModels/AuctionTeamResponseModel";

// ----------------------------
// Type for user prop
// ----------------------------


interface UserCardProps {
  user: AuctionTeam;
}

const UserCard: FC<UserCardProps> = ({ user }) => {
  return (
    <Box minWidth={"250px"}>
      <Paper elevation={8} sx={{ borderRadius: "15px" }}>
        <Box p={2}>
          <Box display={"flex"} justifyContent={"center"}>
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              gap={2}
            >
              <Box
                height={70}
                width={70}
                borderRadius={"50%"}
                overflow={"hidden"}
              >
                <Avatar
                  src={user?.imageUrl}
                  alt="Preview"
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    objectFit: "contain",
                  }}
                />
              </Box>
              <Box>
                <Typography align="center" fontWeight={600}>
                  {user?.fullName}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box display="flex" gap={2} justifyContent="space-between" mt={2}>
            <Box
              sx={{ width: "50%" }}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={1}
            >
              <Paper
                elevation={8}
                sx={{ padding: "10px", width: "100%", borderRadius: "10px" }}
              >
                <Typography
                  fontWeight={600}
                  sx={{ textWrap: "nowrap" }}
                  fontSize={15}
                >
                  {user.totalPlayers}/11
                </Typography>
                <Typography fontSize={11}>Total Players</Typography>
              </Paper>
            </Box>

            <Box
              sx={{ width: "50%" }}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={1}
            >
              <Paper
                elevation={8}
                sx={{
                  padding: "10px",
                  width: "100%",
                  borderRadius: "10px",
                  height: "100%",
                }}
              >
                <Typography fontWeight={600} fontSize={15}>
                  ₹ {formatIndianCurrency(user.balanceLeft)}
                </Typography>
                <Typography fontSize={11}>Balance Left</Typography>
              </Paper>
            </Box>
          </Box>

          <Box display="flex" gap={1} mt={2}>
            {/* <Button sx={buttonStyle} fullWidth>Bid History</Button> */}
            <Button sx={buttonStyle} fullWidth>
              Players
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default UserCard;
