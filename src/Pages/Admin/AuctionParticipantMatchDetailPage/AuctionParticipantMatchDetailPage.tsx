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
  LinearProgress,
  Card,
  CardContent,
  Button,
  Tooltip,
  TableSortLabel,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import colors from "../../../Colors";
import PageTitle from "../../../components/PageTitle/PageTitle";
import playerMatchStateService from "../../../Services/PlayerMatchStateService/PlayerMatchStateService";
import userTeamService from "../../../Services/UserTeamService/UserTeamService";
import type { MatchPoints } from "../../../Models/ResponseModels/MatchPointsResponseModel";
import type { UserTeamPlayer } from "../../../Models/ResponseModels/UserTeamResponseModel";
import type { ScoringRule } from "../../../Models/ResponseModels/ScoringRulesResponseModel";
import scoringService from "../../../Services/ScoringService/ScoringService";
import EventInfoModal from "../../../components/EventInfoModal/EventInfoModal";
import { CricketEventType } from "../../../constants/CricketEventType";
import { tableHeaderSortLableStyle } from "../../../ComponentStyles";

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
  isUserPlayer?: boolean;
}

interface TeamMatchPoints {
  teamName: string;
  teamId: number;
  players: PlayerMatchPoints[];
  totalTeamPoints: number;
}

// Helper function to merge user team players with match data
const mergeUserTeamWithMatchData = (
  userTeamPlayers: UserTeamPlayer[],
  matchData: MatchPoints | null
): PlayerMatchPoints[] => {
  if (!userTeamPlayers.length) return [];

  // Get all players from both teams in the match
  const allMatchPlayers = [
    ...(matchData?.teamAPlayerMatchState || []),
    ...(matchData?.teamBPlayerMatchState || []),
  ];

  return userTeamPlayers.map((userPlayer) => {
    // Find if this user player played in the match
    const matchPlayer = allMatchPlayers.find(
      (mp) => mp.playerId === userPlayer.playerId
    );

    if (matchPlayer) {
      // Player played in the match - use actual stats
      return {
        id: userPlayer.playerId,
        name: userPlayer.name,
        imageUrl: userPlayer.image,
        totalPoints: matchPlayer.totalPoints,
        runs: matchPlayer.runs,
        fours: matchPlayer.fours,
        sixes: matchPlayer.sixes,
        wickets: matchPlayer.wickets,
        catches: matchPlayer.catches,
        stumpings: matchPlayer.stumpings,
        runouts: matchPlayer.runOuts,
        maidenOvers: matchPlayer.maidenOvers,
        isUserPlayer: true,
      };
    } else {
      // Player didn't play in the match - set all stats to zero
      return {
        id: userPlayer.playerId,
        name: userPlayer.name,
        imageUrl: userPlayer.image,
        totalPoints: 0,
        runs: 0,
        fours: 0,
        sixes: 0,
        wickets: 0,
        catches: 0,
        stumpings: 0,
        runouts: 0,
        maidenOvers: 0,
        isUserPlayer: true,
      };
    }
  });
};

const AuctionParticipantMatchDetailPage: React.FC = () => {
  const { auctionId, participantId, matchId } = useParams<{
    auctionId: string;
    participantId: string;
    matchId: string;
  }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [matchPoints, setMatchPoints] = useState<MatchPoints | null>(null);
  const [userTeamPlayers, setUserTeamPlayers] = useState<UserTeamPlayer[]>([]);
  const [userPlayers, setUserPlayers] = useState<PlayerMatchPoints[]>([]);
  const [scoringRules, setScoringRules] = useState<ScoringRule[]>([]);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = useState<keyof PlayerMatchPoints | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!matchId || !auctionId || !participantId) return;

      setLoading(true);
      try {
        // Fetch user team players
        const userTeamResponse = await userTeamService.GetUserTeams({
          AuctionId: Number(auctionId),
          UserId: Number(participantId),
        });

        if (userTeamResponse.isSuccess && userTeamResponse.items) {
          setUserTeamPlayers(userTeamResponse.items);
        }

        // Fetch match points data
        const matchResponse = await playerMatchStateService.GetMatchPoints(
          Number(matchId)
        );

        if (matchResponse.isSuccess && matchResponse.data) {
          setMatchPoints(matchResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [matchId, auctionId, participantId]);

  const fetchScoringRules = async () => {
    var response = await scoringService.GetScoringRules();
    console.log("scorign rules", scoringRules);
    setScoringRules(response.data);
  };

  const sortData = (players: PlayerMatchPoints[]) => {
    if (!orderBy) {
      // no sorting yet, just return original order
      return players;
    }

    return [...players].sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];

      if (aVal === undefined || bVal === undefined) return 0;

      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });
  };

  const handleRequestSort = (property: keyof PlayerMatchPoints) => {
    if (orderBy === property) {
      // toggle asc/desc
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      // first time sorting by this column
      setOrderBy(property);
      setOrder("asc");
    }
  };

  useEffect(() => {
    fetchScoringRules();
  }, []);

  // Merge user team data with match data whenever either changes
  useEffect(() => {
    if (userTeamPlayers.length > 0) {
      const mergedUserPlayers = mergeUserTeamWithMatchData(
        userTeamPlayers,
        matchPoints
      );
      setUserPlayers(mergedUserPlayers);
    }
  }, [userTeamPlayers, matchPoints]);

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
        isUserPlayer: userPlayers.some((up) => up.id === player.playerId),
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
        isUserPlayer: userPlayers.some((up) => up.id === player.playerId),
      })),
    };

    return { teamA, teamB };
  };

  const getPointsBreakdown = (
    player: PlayerMatchPoints,
    scoringRules: ScoringRule[]
  ) => {
    const breakdown: { label: string; value: number; points: number }[] = [];

    scoringRules.forEach((rule) => {
      const statValue = (player as any)[CricketEventType[rule.eventType]] ?? 0; // e.g., player["runs"]
      if (typeof rule.eventType)
        if (statValue > 0) {
          breakdown.push({
            label: `${rule.eventType} x ${statValue}`,
            value: statValue,
            points: statValue * rule.points,
          });
        }
    });
    return breakdown;
  };

  const matchData = transformMatchData();

  const renderPlayerTable = (
    players: PlayerMatchPoints[],
    title: string,
    isUserTeam: boolean = false,
    teamPlayerLabel: boolean = false,
    scoringRules: ScoringRule[]
  ) => {
    return (
      <Box flex={1}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
          p={2}
          bgcolor={isUserTeam ? colors.activeBg : colors.activeBg}
          borderRadius={2}
          color="white"
        >
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <TrophyIcon sx={{ fontSize: 20 }} />
            <Typography variant="subtitle1" fontWeight={600}>
              {players.reduce((sum, p) => sum + p.totalPoints, 0)} pts
            </Typography>
          </Box>
        </Box>

        <TableContainer component={Paper} elevation={2}>
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{ bgcolor: isUserTeam ? colors.primary : colors.activeBg }}
              >
                <TableCell
                  sx={{ color: "white", fontWeight: 600, width: "40%" }}
                >
                  Player
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: 600, textAlign: "center" }}
                >
                  <TableSortLabel
                    active={orderBy === "totalPoints"}
                    direction={orderBy === "totalPoints" ? order : "asc"}
                    onClick={() => handleRequestSort("totalPoints")}
                    sx={tableHeaderSortLableStyle}
                  >
                    Points
                  </TableSortLabel>
                </TableCell>
                {/* Runs column with sorting */}
                <TableCell
                  sx={{ color: "white", fontWeight: 600, textAlign: "center" }}
                >
                  <TableSortLabel
                    active={orderBy === "runs"}
                    direction={orderBy === "runs" ? order : "asc"}
                    onClick={() => handleRequestSort("runs")}
                    sx={tableHeaderSortLableStyle}
                  >
                    Runs
                  </TableSortLabel>
                </TableCell>

                {/* Wickets column with sorting */}
                <TableCell
                  sx={{ color: "white", fontWeight: 600, textAlign: "center" }}
                >
                  <TableSortLabel
                    active={orderBy === "wickets"}
                    direction={orderBy === "wickets" ? order : "asc"}
                    onClick={() => handleRequestSort("wickets")}
                    sx={tableHeaderSortLableStyle}
                  >
                    Wickets
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {players.length == 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No Players Found !
                  </TableCell>
                </TableRow>
              )}
              {sortData(players).map((player) => {
                const breakdown = getPointsBreakdown(player, scoringRules);
                console.log("breakdown", breakdown);
                return (
                  <TableRow
                    key={player.id}
                    hover
                    sx={{
                      bgcolor: player.isUserPlayer ? "#f0f8ff" : "inherit",
                      "&:hover": {
                        bgcolor: player.isUserPlayer ? "#e3f2fd" : "#f5f5f5",
                      },
                    }}
                  >
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
                            {teamPlayerLabel && player.isUserPlayer && (
                              <Chip
                                label="Your Player"
                                size="small"
                                sx={{
                                  ml: 1,
                                  bgcolor: colors.primary,
                                  color: "white",
                                  fontSize: "10px",
                                  height: 18,
                                  fontWeight: 600,
                                }}
                              />
                            )}
                            {player.isUserPlayer &&
                              player.totalPoints === 0 && (
                                <Chip
                                  label="Didn't Play"
                                  size="small"
                                  sx={{
                                    ml: 1,
                                    bgcolor: "#ffebee",
                                    color: "#d32f2f",
                                    fontSize: "10px",
                                    height: 18,
                                    fontWeight: 600,
                                  }}
                                />
                              )}
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
                      <Tooltip
                        title={
                          <Box p={1}>
                            {breakdown.map((b, i) => (
                              <Box
                                key={i}
                                display="flex"
                                justifyContent="space-between"
                                fontSize="12px"
                                mb={0.5}
                                gap={3}
                              >
                                <span>{b.label}</span>
                                <span>+{b.points}</span>
                              </Box>
                            ))}
                            <Box
                              mt={1}
                              borderTop="1px solid #ccc"
                              display="flex"
                              justifyContent="space-between"
                              fontWeight={700}
                              gap={3}
                            >
                              <span>Total</span>
                              <span>{player.totalPoints}</span>
                            </Box>
                          </Box>
                        }
                        arrow
                        placement="top"
                      >
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          color={colors.primary}
                          sx={{ cursor: "pointer" }}
                        >
                          {player.totalPoints}
                        </Typography>
                      </Tooltip>
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
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <LinearProgress sx={{ width: "50%" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <Box sx={{ mb: 2 }}>
        <PageTitle title="Match Player Details" />
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Back Button */}
        <Box mb={3}>
          <Chip
            icon={<ArrowBackIcon />}
            label="Back to Participant Details"
            onClick={() =>
              navigate(
                `/admin/auctions/${auctionId}/participant/${participantId}/detail`
              )
            }
            sx={{
              cursor: "pointer",
              "&:hover": {
                bgcolor: colors.primary,
                color: "white",
              },
            }}
          />
        </Box>

        {/* Match Info */}
        {matchData && (
          <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography
              variant="h5"
              fontWeight={600}
              mb={2}
              color={colors.primary}
            >
              {matchData.teamA.teamName} vs {matchData.teamB.teamName}
            </Typography>
            <Box display="flex" gap={3}>
              <Card sx={{ flex: 1, bgcolor: colors.primary, color: "white" }}>
                <CardContent sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h6" fontWeight={700}>
                    {matchData.teamA.totalTeamPoints}
                  </Typography>
                  <Typography variant="body2">
                    {matchData.teamA.teamName} Points
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ flex: 1, bgcolor: colors.activeBg, color: "white" }}>
                <CardContent sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h6" fontWeight={700}>
                    {matchData.teamB.totalTeamPoints}
                  </Typography>
                  <Typography variant="body2">
                    {matchData.teamB.teamName} Points
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Paper>
        )}

        {/* User's Team Players Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              mb={3}
              color={colors.primary}
            >
              Your Team Players
            </Typography>

            <Button
              onClick={() => setInfoModalOpen(true)}
              variant="outlined"
              sx={{ color: colors.activeBg }}
            >
              point info
            </Button>
          </Box>

          {renderPlayerTable(
            userPlayers,
            "Your Team Players",
            true,
            false,
            scoringRules
          )}

          {/* User Team Summary */}
          {userPlayers.length > 0 && (
            <Box mt={3} display="flex" gap={2} flexWrap="wrap">
              <Paper
                sx={{
                  flex: 1,
                  minWidth: 150,
                  p: 2,
                  textAlign: "center",
                  bgcolor: colors.primary,
                  color: "white",
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  {userPlayers.reduce((sum, p) => sum + p.totalPoints, 0)}
                </Typography>
                <Typography variant="body2">Total Points</Typography>
              </Paper>
              <Paper
                sx={{
                  flex: 1,
                  minWidth: 150,
                  p: 2,
                  textAlign: "center",
                  bgcolor: "#4caf50",
                  color: "white",
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  {userPlayers.filter((p) => p.totalPoints > 0).length}
                </Typography>
                <Typography variant="body2">Players Played</Typography>
              </Paper>
              <Paper
                sx={{
                  flex: 1,
                  minWidth: 150,
                  p: 2,
                  textAlign: "center",
                  bgcolor: "#ff9800",
                  color: "white",
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  {userPlayers.filter((p) => p.totalPoints === 0).length}
                </Typography>
                <Typography variant="body2">Didn't Play</Typography>
              </Paper>
            </Box>
          )}
        </Paper>

        {/* All Match Players Section */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            mb={3}
            color={colors.primary}
          >
            All Match Players
          </Typography>

          {matchData ? (
            <Box display="flex" gap={3}>
              {/* Team A - Left Side */}
              {renderPlayerTable(
                matchData.teamA.players,
                matchData.teamA.teamName,
                false,
                true,
                scoringRules
              )}

              {/* Vertical Divider */}
              <Divider orientation="vertical" flexItem />

              {/* Team B - Right Side */}
              {renderPlayerTable(
                matchData.teamB.players,
                matchData.teamB.teamName,
                false,
                true,
                scoringRules
              )}
            </Box>
          ) : (
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
            >
              No match data available
            </Typography>
          )}
        </Paper>
      </Box>

      <EventInfoModal
        open={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        events={scoringRules}
        title="Auction Event Points"
      />
    </Box>
  );
};

export default AuctionParticipantMatchDetailPage;
