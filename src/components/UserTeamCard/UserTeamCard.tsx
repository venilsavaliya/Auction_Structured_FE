import { Avatar, Box, Paper, Typography } from "@mui/material";
import React, { useEffect } from "react";
import style from "./UserTeamCard.module.scss";
import colors from "../../Colors";
import { formatIndianCurrency } from "../../Utility/Utility";
import type { AuctionParticipant } from "../../Models/ResponseModels/AuctionParticipantResponseModel";

interface UserTeamCardProps {
  user: AuctionParticipant;
  selectedUserId: number;
  onSelect: (userId: number) => void;
  setDisableUserIds: (userId: number[]) => void;
  disabledUserIds: number[];
}

const UserTeamCard: React.FC<UserTeamCardProps> = ({
  user,
  selectedUserId,
  onSelect,
  setDisableUserIds,
  disabledUserIds,
}) => {
  useEffect(() => {
    if (user.totalPlayer == 11) {
      setDisableUserIds([...disabledUserIds, user.userId]);
    }
  }, [user]);

  return (
    <Box
      minWidth={"150px"}
      sx={{
        "&:hover": { cursor: "pointer" },
        pointerEvents: user.totalPlayer === 11 ? "none" : "auto",
        opacity: user.totalPlayer === 11 ? 0.7 : 1,
      }}
      onClick={() => onSelect(user.userId)}
    >
      <Paper
        elevation={8}
        sx={{
          borderRadius: "15px",
        }}
        className={
          selectedUserId === user.userId ? style.selectedUserTeamCard : ""
        }
      >
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
              <Box>
                <Typography align="center" fontWeight={600}>
                  {user.fullName}
                </Typography>
                <Typography align="center" sx={{ fontSize: 14, color: "grey" }}>
                  {user.totalPlayer}/11
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            mt={1}
          >
            <Typography
              fontWeight={600}
              fontSize={15}
              color={colors.primaryDark}
            >
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
