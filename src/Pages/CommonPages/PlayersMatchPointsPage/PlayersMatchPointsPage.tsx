import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import colors from "../../../Colors";
import { useParams } from "react-router-dom";
import playerMatchStateService from "../../../Services/PlayerMatchStateService/PlayerMatchStateService";
import type {
  MatchPoints,
  MatchPointsResponseModel,
} from "../../../Models/ResponseModels/MatchPointsResponseModel";
import PageTitle from "../../../components/PageTitle/PageTitle";

interface PlayerMatchPoints {
  id: number;
  name: string;
  imageUrl?: string;
  totalPoints: number;
  runs: number;
  fours: number;
  sixes: number;
  wickets: number;
  catches: number;
  stumpings: number;
  runouts: number;
  maidenOvers: number;
}

interface TeamMatchPoints {
  teamName: string;
  teamId: number;
  players: PlayerMatchPoints[];
  totalTeamPoints: number;
}

const PlayersMatchPointsPage: React.FC = () => {
  const { matchId } = useParams<string>();

  const [matchPoints, setMatchPoints] = useState<MatchPoints | null>(null);

  useEffect(() => {
    if (matchId) {
      playerMatchStateService
        .GetMatchPoints(Number(matchId))
        .then((response) => {
          if (response.isSuccess) {
            setMatchPoints(response.data);
          }
        });
    }
  }, [matchId]);

  console.log("match points", matchPoints);

  // Transform matchPoints data to our component format
  const transformMatchData = (): {
    teamA: TeamMatchPoints;
    teamB: TeamMatchPoints;
  } | null => {
    if (!matchPoints) return null;

    const teamAPlayers = matchPoints.teamAPlayerMatchState || [];
    const teamBPlayers = matchPoints.teamBPlayerMatchState || [];

    const teamA: TeamMatchPoints = {
      teamName: matchPoints.teamAName || "Team A",
      teamId: matchPoints.teamAId || 0,
      totalTeamPoints: matchPoints.teamAPoints || 0,
      players: teamAPlayers.map((player) => ({
        id: player.playerId,
        name: player.name,
        imageUrl: player.imageUrl,
        totalPoints: player.totalPoints,
        runs: player.runs,
        fours: player.fours,
        sixes: player.sixes,
        wickets: player.wickets,
        catches: player.catches,
        stumpings: player.stumpings,
        runouts: player.runOuts,
        maidenOvers: player.maidenOvers,
      })),
    };

    const teamB: TeamMatchPoints = {
      teamName: matchPoints.teamBName || "Team B",
      teamId: matchPoints.teamBId || 0,
      totalTeamPoints: matchPoints.teamBPoints || 0,
      players: teamBPlayers.map((player) => ({
        id: player.playerId,
        name: player.name,
        imageUrl: player.imageUrl,
        totalPoints: player.totalPoints,
        runs: player.runs,
        fours: player.fours,
        sixes: player.sixes,
        wickets: player.wickets,
        catches: player.catches,
        stumpings: player.stumpings,
        runouts: player.runOuts,
        maidenOvers: player.maidenOvers,
      })),
    };

    return { teamA, teamB };
  };

  const matchData = transformMatchData();

  const renderTeamTable = (
    teamData: TeamMatchPoints,
    teamSide: "left" | "right"
  ) => {
    return (
      <Box flex={1}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
          p={2}
          bgcolor={colors.activeBg}
          borderRadius={2}
          color="white"
        >
          <Typography variant="h6" fontWeight={600}>
            {teamData.teamName}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <TrophyIcon sx={{ fontSize: 20 }} />
            <Typography variant="subtitle1" fontWeight={600}>
              {teamData.totalTeamPoints} pts
            </Typography>
          </Box>
        </Box>

        <TableContainer component={Paper} elevation={2}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: colors.activeBg }}>
                <TableCell
                  sx={{ color: "white", fontWeight: 600, width: "40%" }}
                >
                  Player
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: 600, textAlign: "center" }}
                >
                  Points
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: 600, textAlign: "center" }}
                >
                  Runs
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: 600, textAlign: "center" }}
                >
                  Wickets
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teamData.players.map((player) => (
                <TableRow key={player.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        src={player.imageUrl}
                        sx={{ width: 32, height: 32 }}
                      >
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {player.name}
                        </Typography>
                        <Box display="flex" gap={0.5} mt={0.5}>
                          {player.fours > 0 && (
                            <Chip
                              label={`${player.fours} 4s`}
                              size="small"
                              sx={{
                                bgcolor: "#e8f5e8",
                                color: "#2e7d32",
                                fontSize: "10px",
                                height: 20,
                                fontWeight: 600,
                              }}
                            />
                          )}
                          {player.sixes > 0 && (
                            <Chip
                              label={`${player.sixes} 6s`}
                              size="small"
                              sx={{
                                bgcolor: "#fff3e0",
                                color: "#f57c00",
                                fontSize: "10px",
                                height: 20,
                                fontWeight: 600,
                              }}
                            />
                          )}
                          {player.catches > 0 && (
                            <Chip
                              label={`${player.catches} C`}
                              size="small"
                              sx={{
                                bgcolor: "#e3f2fd",
                                color: "#1976d2",
                                fontSize: "10px",
                                height: 20,
                                fontWeight: 600,
                              }}
                            />
                          )}
                          {player.stumpings > 0 && (
                            <Chip
                              label={`${player.stumpings} S`}
                              size="small"
                              sx={{
                                bgcolor: "#f3e5f5",
                                color: "#7b1fa2",
                                fontSize: "10px",
                                height: 20,
                                fontWeight: 600,
                              }}
                            />
                          )}
                          {player.runouts > 0 && (
                            <Chip
                              label={`${player.runouts} RO`}
                              size="small"
                              sx={{
                                bgcolor: "#ffebee",
                                color: "#d32f2f",
                                fontSize: "10px",
                                height: 20,
                                fontWeight: 600,
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      
                      fontWeight={700}
                      color={colors.primary}
                    >
                      {player.totalPoints}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight={600}>
                      {player.runs}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight={600}>
                      {player.wickets}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  // Show loading state if data is not available
  if (!matchData) {
    return (
      <Box sx={{ p: 3, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
        <Typography variant="h4" fontWeight={700} mb={3} color={colors.primary}>
          Loading Match Points...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <PageTitle title="Match Points"/>
      <Typography variant="h6" mb={3} color={colors.primary}>
        {matchData.teamA.teamName} vs {matchData.teamB.teamName}
      </Typography>

      <Box display="flex" gap={3}>
        {/* Team A - Left Side */}
        {renderTeamTable(matchData.teamA, "left")}

        {/* Vertical Divider */}
        <Divider orientation="vertical" flexItem />

        {/* Team B - Right Side */}
        {renderTeamTable(matchData.teamB, "right")}
      </Box>

      {/* Summary Section */}
      {/* <Box mt={4}>
        <Paper elevation={2} sx={{ p: 3, bgcolor: "white" }}>
          <Typography
            variant="h6"
            fontWeight={600}
            mb={2}
            color={colors.primary}
          >
            Match Summary
          </Typography>
          <Box display="flex" gap={3}>
            <Box
              flex={1}
              textAlign="center"
              p={2}
              bgcolor="#f0f8ff"
              borderRadius={2}
            >
              <Typography variant="h5" fontWeight={700} color={colors.primary}>
                {matchData.teamA.totalTeamPoints}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {matchData.teamA.teamName} Total Points
              </Typography>
            </Box>
            <Box
              flex={1}
              textAlign="center"
              p={2}
              bgcolor="#fff3e0"
              borderRadius={2}
            >
              <Typography variant="h5" fontWeight={700} color={colors.primary}>
                {matchData.teamB.totalTeamPoints}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {matchData.teamB.teamName} Total Points
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box> */}
    </Box>
  );
};

export default PlayersMatchPointsPage;
