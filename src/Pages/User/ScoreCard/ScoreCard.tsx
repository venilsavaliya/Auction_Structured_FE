import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Avatar,
  Divider,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  IconButton,
} from "@mui/material";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import SportsBaseballIcon from "@mui/icons-material/SportsBaseball";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import PersonIcon from "@mui/icons-material/Person";
import { useParams } from "react-router-dom";
import matchService from "../../../Services/MatcheService/MatchService";
import type { LiveMatchStatusData } from "../../../Models/ResponseModels/LiveMatchStatusResponseModel";
import { getAbbreviation } from "../../../Utility/Utility";
import colors from "../../../Colors";

// Dummy data for leaderboard - replace with actual API calls
const dummyLeaderboardData = [
  {
    auctionId: 1,
    auctionTitle: "IPL 2024 Mega Auction",
    userPoints: 1250,
    totalParticipants: 45,
    userRank: 3,
    leaderboard: [
      { rank: 1, name: "John Smith", points: 1450, avatar: "JS" },
      { rank: 2, name: "Sarah Johnson", points: 1380, avatar: "SJ" },
      { rank: 3, name: "Mike Wilson", points: 1250, avatar: "MW" },
      { rank: 4, name: "Emma Davis", points: 1180, avatar: "ED" },
      { rank: 5, name: "Alex Brown", points: 1120, avatar: "AB" },
    ],
  },
  {
    auctionId: 2,
    auctionTitle: "T20 World Cup Auction",
    userPoints: 980,
    totalParticipants: 32,
    userRank: 7,
    leaderboard: [
      { rank: 1, name: "David Lee", points: 1200, avatar: "DL" },
      { rank: 2, name: "Lisa Chen", points: 1150, avatar: "LC" },
      { rank: 3, name: "Tom Anderson", points: 1100, avatar: "TA" },
      { rank: 4, name: "Maria Garcia", points: 1050, avatar: "MG" },
      { rank: 5, name: "James Wilson", points: 1000, avatar: "JW" },
      { rank: 6, name: "Anna Taylor", points: 990, avatar: "AT" },
      { rank: 7, name: "Current User", points: 980, avatar: "CU" },
    ],
  },
  {
    auctionId: 3,
    auctionTitle: "Champions League Auction",
    userPoints: 750,
    totalParticipants: 28,
    userRank: 12,
    leaderboard: [
      { rank: 1, name: "Robert Kim", points: 950, avatar: "RK" },
      { rank: 2, name: "Sophie White", points: 920, avatar: "SW" },
      { rank: 3, name: "Kevin Park", points: 890, avatar: "KP" },
      { rank: 4, name: "Rachel Green", points: 850, avatar: "RG" },
      { rank: 5, name: "Daniel Miller", points: 820, avatar: "DM" },
    ],
  },
];

const ScoreCard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const matchId = id;
  const [data, setData] = useState<LiveMatchStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("matchId", matchId);
    if (!matchId) return;
    setLoading(true);
    setError(null);
    matchService
      .GetLiveMatchStatus(Number(matchId))
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch live match data");
        setLoading(false);
      });
  }, [matchId]);

  if (loading) {
    return (
      <Box
        minHeight="60vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h6">Loading live match data...</Typography>
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box
        minHeight="60vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h6" color="error">
          {error || "No data found."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      minHeight="100vh"
      bgcolor="#f5f7fa"
      display="flex"
      flexDirection="column"
      alignItems="center"
      py={4}
      gap={4}
    >
      {/* Live Scorecard */}
      <Paper
        elevation={6}
        sx={{
          borderRadius: 3,
          p: 0,
          minWidth: 600,
          maxWidth: 1000,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
        }}
      >
        {/* Left: Score Summary */}
        <Box
          flex={1.2}
          bgcolor="#e3ecfa"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={4}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            mb={2}
            sx={{
              fontSize: 18,
              textAlign: "center",
              wordBreak: "break-word",
              maxWidth: 180,
            }}
          >
            {getAbbreviation(data.teamA)}
            <span style={{ color: "#888", fontWeight: 400, fontSize: 16 }}>
              {" "}
              vs{" "}
            </span>
            {getAbbreviation(data.teamB)}
          </Typography>
          <Typography variant="h2" fontWeight={800} color={colors.primary}>
            {data.totalRuns}/{data.totalWickets}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" mb={2}>
            Overs: {data.overs}
          </Typography>
          <Chip
            label={data.matchStatus}
            color="success"
            sx={{ fontWeight: 600, fontSize: 15, mb: 2 }}
          />
          <Typography variant="body1" fontWeight={600}>
            Run Rate: <span style={{ color: colors.primary }}>{data.runRate}</span>
          </Typography>
          {data.target && (
            <Typography variant="body1" fontWeight={600}>
              Target: <span style={{ color: "#d32f2f" }}>{data.target}</span>
            </Typography>
          )}
        </Box>
        {/* Right: Details */}
        <Box
          flex={2}
          p={4}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box
            display="flex"
            flexDirection="column"
            gap={1}
            mb={2}
            flexWrap="wrap"
          >
            {/* Batsmen */}
            <Box minWidth={180} flex={1}>
              {data.currentBatsmen.map((batsman) => (
                <Box
                  key={batsman.playerId}
                  display="flex"
                  alignItems="center"
                  gap={1}
                  mb={0.5}
                >
                  <SportsCricketIcon
                    sx={{
                      fontSize: 18,
                      color: batsman.isOnStrike ? "#1976d2" : "#888",
                      mr: 0.5,
                    }}
                  />
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    sx={{ fontSize: 15 }}
                  >
                    {batsman.name}
                    {batsman.isOnStrike ? " *" : ""}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {batsman.runs}({batsman.balls})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    4s: {batsman.fours} 6s: {batsman.sixes}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Divider sx={{ mb: 2 }} />
            {/* Bowler */}
            <Box minWidth={180} flex={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <SportsBaseballIcon
                  sx={{ fontSize: 18, color: "#43a047", mr: 0.5 }}
                />
                <Typography
                  variant="body1"
                  fontWeight={600}
                  sx={{ fontSize: 15 }}
                >
                  {data.currentBowler.name}
                </Typography>
              </Box>
              <Box display="flex" gap={1}>
                <Typography variant="body2" fontWeight={600}>
                  {data.currentBowler.overs} overs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {data.currentBowler.runsConceded} runs,{" "}
                  {data.currentBowler.wickets} wickets
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight={700} mb={1}>
              Recent Balls
            </Typography>
            <Stack direction="row" spacing={1}>
              {data.recentBalls.map((ball, idx) => (
                <Chip
                  key={idx}
                  label={ball.result}
                  color={
                    ball.result === "4"
                      ? "success"
                      : ball.result === "6"
                      ? "warning"
                      : "default"
                  }
                  sx={{ fontWeight: 700, fontSize: 16, minWidth: 36 }}
                />
              ))}
            </Stack>
          </Box>
        </Box>
      </Paper>

      {/* Leaderboard Section */}
      <Paper
        elevation={6}
        sx={{
          borderRadius: 4,
          p: 0,
          minWidth: 600,
          maxWidth: 1000,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Box
          bgcolor={colors.primary}
          color="white"
          p={3}
          display="flex"
          alignItems="center"
          gap={2}
        >
          <LeaderboardIcon sx={{ fontSize: 28 }} />
          <Typography variant="h5" fontWeight={700}>
            My Auction Leaderboards
          </Typography>
        </Box>

        <Box p={0}>
          {dummyLeaderboardData.map((auction, index) => (
            <Accordion
              key={auction.auctionId}
              sx={{
                "&:before": { display: "none" },
                boxShadow: "none",
                borderBottom: "1px solid #e0e0e0",
                "&:last-child": { borderBottom: "none" },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  px: 3,
                  py: 2,
                  "&:hover": { bgcolor: "#f8f9fa" },
                }}
              >
                <Box display="flex" alignItems="center" gap={2} flex={1}>
                  <Avatar
                    sx={{
                      bgcolor: auction.userRank <= 3 ? "#ffd700" : "#1976d2",
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    {auction.userRank}
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="h6" fontWeight={600}>
                      {auction.auctionTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {auction.totalParticipants} participants
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="h6" fontWeight={700} color="primary">
                      {auction.userPoints} pts
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rank #{auction.userRank}
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ p: 0 }}>
                <List sx={{ p: 0 }}>
                  {auction.leaderboard.map((player, playerIndex) => (
                    <ListItem
                      key={player.rank}
                      sx={{
                        px: 3,
                        py: 1.5,
                        bgcolor:
                          player.name === "Current User"
                            ? "#e3f2fd"
                            : "transparent",
                        borderLeft:
                          player.name === "Current User"
                            ? "4px solid #1976d2"
                            : "none",
                      }}
                    >
                      <ListItemAvatar>
                        <Badge
                          badgeContent={player.rank}
                          color={
                            player.rank === 1
                              ? "warning"
                              : player.rank === 2
                              ? "default"
                              : player.rank === 3
                              ? "error"
                              : "primary"
                          }
                          sx={{
                            "& .MuiBadge-badge": {
                              fontSize: 12,
                              fontWeight: 700,
                              minWidth: 20,
                              height: 20,
                            },
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor:
                                player.rank === 1
                                  ? "#ffd700"
                                  : player.rank === 2
                                  ? "#c0c0c0"
                                  : player.rank === 3
                                  ? "#cd7f32"
                                  : "#1976d2",
                              color: "white",
                              fontWeight: 700,
                              width: 32,
                              height: 32,
                            }}
                          >
                            {player.avatar}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>

                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            fontWeight={600}
                            sx={{
                              color:
                                player.name === "Current User"
                                  ? "#1976d2"
                                  : "inherit",
                            }}
                          >
                            {player.name}
                            {player.name === "Current User" && " (You)"}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {player.points} points
                          </Typography>
                        }
                      />

                      <Box textAlign="right">
                        <Typography variant="body2" color="text.secondary">
                          #{player.rank}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default ScoreCard;
