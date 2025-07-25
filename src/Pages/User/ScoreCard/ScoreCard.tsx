import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Avatar,
  Divider,
  Stack,
} from "@mui/material";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import SportsBaseballIcon from "@mui/icons-material/SportsBaseball";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useParams } from "react-router-dom";
import matchService from "../../../Services/MatcheService/MatchService";
import type { LiveMatchStatusData } from "../../../Models/ResponseModels/LiveMatchStatusResponseModel";

const ScoreCard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const matchId = id
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
    >
      <Paper
        elevation={6}
        sx={{
          borderRadius: 4,
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
            {data.teamA}
            <span style={{ color: "#888", fontWeight: 400, fontSize: 16 }}>
              {" "}
              vs{" "}
            </span>
            {data.teamB}
          </Typography>
          <Avatar sx={{ bgcolor: "#1976d2", width: 64, height: 64, mb: 2 }}>
            <SportsCricketIcon fontSize="large" />
          </Avatar>
          <Typography variant="h2" fontWeight={900} color="primary">
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
            Run Rate: <span style={{ color: "#1976d2" }}>{data.runRate}</span>
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
            gap={4}
            mb={2}
            flexWrap="wrap"
          >
            {/* Batsmen */}
            <Box minWidth={180} flex={1}>
              <Typography variant="subtitle2" fontWeight={700} mb={1}>
                Batsmen
              </Typography>
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
            {/* Bowler */}
            <Box minWidth={180} flex={1}>
              <Typography variant="subtitle2" fontWeight={700} mb={1}>
                Bowler
              </Typography>
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
          <Divider sx={{ mb: 2 }} />
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
    </Box>
  );
};

export default ScoreCard;
