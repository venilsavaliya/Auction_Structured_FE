import { Avatar, Box, Paper, Typography } from "@mui/material";
import {type FC } from "react";
import colors from "../../Colors";
import type { Player } from "../../Models/ResponseModels/PlayerDetailResponseModel";


interface PlayerCardProps {
  player: Player|null;
}

const PlayerCard: FC<PlayerCardProps> = ({ player }) => {
  return (
    <Box minWidth={"450px"}>
      <Paper elevation={8} sx={{ borderRadius: "10px" }}>
        <Box p={2}>
          <Box display="flex" justifyContent="center">
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <Box
                height={120}
                width={120}
                borderRadius="50%"
                border={2}
                borderColor={colors.lightBg}
                overflow="hidden"
                boxShadow={5}
              >
                <Avatar
                  src={player?.imageUrl}
                  alt="Preview"
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </Box>

              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography align="center" fontSize={22} fontWeight={600}>
                  {player?.name ?? "Player Name"}
                </Typography>
                <Typography fontSize={17}>{player?.skill ?? "Skill"}</Typography>
                <Typography fontSize={15} mt={2}>
                  Age: {player?.age ?? "N/A"}
                </Typography>
              </Box>
            </Box>
          </Box>

          <hr style={{ marginTop: "15px" }} />

          <Box
            mt={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontSize={16} fontWeight={600} color={colors.primary}>
              Base Price
            </Typography>
            <Typography fontSize={20} fontWeight={600} color={colors.activeBg}>
              ₹ {player?.basePrice ?? "0"}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default PlayerCard;
