import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import PageTitle from "../../../components/PageTitle/PageTitle";
import TeamPlayerCard from "../../../components/TeamPlayerCard/TeamPlayerCard";
import CricketPoster from "../../../assets/cricket_poster_bg4.jpg";
import { useParams } from "react-router-dom";
import userTeamService from "../../../Services/UserTeamService/UserTeamService";
import type { UserTeamPlayer } from "../../../Models/ResponseModels/UserTeamResponseModel";


const UserTeamPage: React.FC = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const [players, setPlayers] = useState<UserTeamPlayer[]>([]);

  const fetchTeamPlayers = async () => {
    try {
      const requestBody = {
        AuctionId: parseInt(auctionId ?? "0"),
        UserId: 0,
      };
      const res = await userTeamService.GetUserTeams(
        requestBody
      );
      const data = res.items;
      setPlayers(data);
    } catch (error) {
      console.error("Error fetching team players", error);
    }
  };

  useEffect(() => {
    fetchTeamPlayers();
  }, [auctionId]);

  return (
    <Box
      sx={{
        backgroundImage: `url(${CricketPoster})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        minHeight: "100vh",
        width: "100%",
        backgroundAttachment: "fixed",
      }}
    >
      <PageTitle title="My Team" />
      <Box sx={{ px: 10 }}>
        <Typography fontFamily="revert-layer" fontSize={24} my={4}>
          Batsman
        </Typography>
        <Box display="flex" justifyContent="flex-start" gap={4} flexWrap="wrap">
          {players
            .filter((p) => p.skill === "Batsman" || p.skill === "WKBatsman")
            .map((player) => (
              <TeamPlayerCard key={player.playerId} player={player} />
            ))}
        </Box>

        <Typography fontFamily="revert-layer" fontSize={24} my={4}>
          Bowler
        </Typography>
        <Box display="flex" justifyContent="flex-start" gap={4} flexWrap="wrap">
          {players
            .filter((p) => p.skill === "Bowler" || p.skill === "WKBowler")
            .map((player) => (
              <TeamPlayerCard key={player.playerId} player={player} />
            ))}
        </Box>

        <Typography fontFamily="revert-layer" fontSize={24} my={4}>
          All Rounder
        </Typography>
        <Box display="flex" justifyContent="flex-start" gap={4} flexWrap="wrap">
          {players
            .filter((p) => p.skill === "AllRounder")
            .map((player) => (
              <TeamPlayerCard key={player.playerId} player={player} />
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default UserTeamPage;
