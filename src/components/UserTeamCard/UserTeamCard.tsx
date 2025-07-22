import { Avatar, Box, Paper , Typography } from "@mui/material";
import React from "react";
import style from './UserTeamCard.module.scss';
import colors from "../../Colors";
import { formatIndianCurrency } from "../../Utility/Utility";

interface User {
  userId: number;
  fullName: string;
  image?: string;
  purseBalance: number;
}

interface UserTeamCardProps {
  user: User;
  selectedUserId: number;
  onSelect: (userId: number) => void;
}

const UserTeamCard: React.FC<UserTeamCardProps> = ({ user, selectedUserId, onSelect }) => {
  return (
    <Box
      minWidth={"150px"}
      sx={{ "&:hover": { cursor: "pointer" } }}
      onClick={() => onSelect(user.userId)}
    >
      <Paper
        elevation={8}
        sx={{ borderRadius: "15px"}}
        className={selectedUserId === user.userId ? style.selectedUserTeamCard : ""}
      >
        <Box p={2}>
          <Box display={"flex"} justifyContent={"center"}>
            <Box display={"flex"} flexDirection={"column"} alignItems={"center"} gap={2}>
              <Box height={70} width={70} borderRadius={"50%"} overflow={"hidden"}>
                <Avatar
                  src={user.image}
                  alt="Preview"
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    objectFit: "contain",
                  }}
                />
              </Box>
              <Typography align="center" fontWeight={600}>
                {user.fullName}
              </Typography>
            </Box>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            mt={2}
          >
            <Typography fontWeight={600} fontSize={15} color={colors.primaryDark}>
              ₹ {formatIndianCurrency(user.purseBalance)}
            </Typography>
            <Typography fontSize={11}>Balance Left</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default UserTeamCard;
