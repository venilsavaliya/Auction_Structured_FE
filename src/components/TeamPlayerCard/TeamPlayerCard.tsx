import { Box, Divider, Paper, Typography } from "@mui/material";
import React from "react";

import bat_icon from "../../assets/bat_icon.svg"
import ball_icon from "../../assets/ball_icon.svg";
import wk_icon from "../../assets/wk_icon.svg";
import all_rounder_icon from "../../assets/all_rounder_icon.svg";

import colors from "../../Colors";
// Define the expected player type
interface Player {
  id?: number;
  name: string;
  image: string;
  skill: string; // e.g., "Batsman", "Bowler", "AllRounder", "WK-Batsman"
}

interface TeamPlayerCardProps {
  player: Player;
}

const TeamPlayerCard: React.FC<TeamPlayerCardProps> = ({ player }) => {
  return (
    <Box width={"170px"} sx={{ "&:hover": { cursor: "pointer" } }}>
      <Paper elevation={8} sx={{ borderRadius: "15px", width: "170px" }}>
        <Box p={2}>
          <Box display="flex" justifyContent="center">
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box
                height={150}
                width={150}
                overflow="hidden"
                borderColor={colors.lightBg}
                position="relative"
              >
                <img src={player?.image} alt="user" height="150" width="150" style={{objectFit:"contain"}} />
                <Box position="absolute" top={0} right={0}>
                  {player?.skill === "Batsman" && (
                    <img src={bat_icon} height={25} width={25} alt="bat icon" />
                  )}
                  {player?.skill === "Bowler" && (
                    <img
                      src={ball_icon}
                      height={25}
                      width={25}
                      alt="ball icon"
                    />
                  )}
                  {player?.skill === "AllRounder" && (
                    <img
                      src={all_rounder_icon}
                      height={25}
                      width={25}
                      alt="all rounder icon"
                    />
                  )}
                  {player?.skill?.slice(0, 2) === "WK" && (
                    <img src={wk_icon} height={25} width={25} alt="wk icon" />
                  )}
                </Box>
              </Box>

              <Divider sx={{ m: 1, width: "100%" }} />

              <Box>
                <Typography align="center" fontWeight={600} fontSize={14}>
                  {player?.name?.toUpperCase()}
                </Typography>
              </Box>

              <Box>
                <Typography align="center" fontSize={12}>
                  {player?.skill}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default TeamPlayerCard;
