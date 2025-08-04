import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  LinearProgress,
  Badge,
} from "@mui/material";
import {
  Person as PersonIcon,
  EmojiEvents as TrophyIcon,
  TrendingUp as TrendingUpIcon,
  SportsCricket as CricketIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Visibility as ViewIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import colors from "../../../Colors";
import PageTitle from "../../../components/PageTitle/PageTitle";
import auctionParticipantService from "../../../Services/AuctionParticipantService/AuctionParticipantService";
import type { AuctionParticipantMatchPerformance } from "../../../Models/ResponseModels/AuctionParticipantMatchPerformanceResponseModel";

interface MatchPerformance {
  id: number;
  matchTitle: string;
  date: string;
  venue: string;
  userPoints: number;
  totalMatchPoints: number;
  userRank: number;
  totalParticipants: number;
  status: "completed" | "live" | "upcoming";
  playerContributions: PlayerContribution[];
}

interface PlayerContribution {
  playerId: number;
  playerName: string;
  role: "Batsman" | "Bowler" | "All-Rounder" | "Wicket-Keeper";
  points: number;
  performance: string;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
}

interface UserDetail {
  id: number;
  fullName: string;
  imageUrl: string;
  teamName: string;
  totalPoints: number;
  totalMatches: number;
  averagePoints: number;
  bestScore: number;
  rank: number;
  totalParticipants: number;
  purseBalance: number;
  playersCount: number;
  captainPoints: number;
  viceCaptainPoints: number;
}

const AuctionParticipantDetailPage: React.FC = () => {
  const { auctionId, participantId: userId } = useParams<{
    auctionId: string;
    participantId: string;
  }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [matchPerformances, setMatchPerformances] = useState<
    AuctionParticipantMatchPerformance[]
  >([]);

  // Dummy data for user details
  const dummyUserDetail: UserDetail = {
    id: 101,
    fullName: "Rahul Sharma",
    imageUrl: "https://via.placeholder.com/150",
    teamName: "Mumbai Warriors",
    totalPoints: 1250,
    totalMatches: 8,
    averagePoints: 156.25,
    bestScore: 245,
    rank: 1,
    totalParticipants: 12,
    purseBalance: 250000,
    playersCount: 11,
    captainPoints: 180,
    viceCaptainPoints: 120,
  };

  useEffect(() => {
    const fetchData = async () => {

      console.log("auctionId",auctionId,"userId",userId);
      if (!auctionId || !userId) return;
      
      setLoading(true);
      try {
        // Fetch match performance data from service
        const response = await auctionParticipantService.GetAuctionParticipantMatchPerformance(
          Number(auctionId),
          Number(userId)
        );
        
        if (response.isSuccess && response.data) {
          setMatchPerformances(response.data);
        }
        
        // For now, keep dummy user detail until we have a service for it
        setUserDetail(dummyUserDetail);
      } catch (error) {
        console.error("Failed to fetch match performance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auctionId, userId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "live":
        return "error";
      case "upcoming":
        return "warning";
      default:
        return "default";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Batsman":
        return "#4caf50";
      case "Bowler":
        return "#f44336";
      case "All-Rounder":
        return "#ff9800";
      case "Wicket-Keeper":
        return "#2196f3";
      default:
        return "#757575";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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

  if (!userDetail) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error" variant="h6">
          User not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <Box sx={{ mb: 2 }}>
        <PageTitle title={`${userDetail.fullName} - Performance Details`} />
      </Box>

      <Box sx={{ p: 3 }}>
        {/* User Profile Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Box display="flex" gap={3} alignItems="center" flexWrap="wrap">
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              sx={{ minWidth: 200 }}
            >
              <Badge
                badgeContent={userDetail.rank}
                color="primary"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "1rem",
                    fontWeight: "bold",
                  },
                }}
              >
                <Avatar
                  src={userDetail.imageUrl}
                  sx={{ width: 120, height: 120, mb: 2 }}
                >
                  <PersonIcon sx={{ fontSize: 60 }} />
                </Avatar>
              </Badge>
              <Typography variant="h5" fontWeight={600} textAlign="center">
                {userDetail.fullName}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                {userDetail.teamName}
              </Typography>
            </Box>

            <Box flex={1}>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Card
                  sx={{
                    flex: 1,
                    minWidth: 150,
                    bgcolor: colors.primary,
                    color: "white",
                  }}
                >
                  <CardContent sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h4" fontWeight={700}>
                      {userDetail.totalPoints}
                    </Typography>
                    <Typography variant="body2">Total Points</Typography>
                  </CardContent>
                </Card>
                <Card
                  sx={{
                    flex: 1,
                    minWidth: 150,
                    bgcolor: colors.activeBg,
                    color: "white",
                  }}
                >
                  <CardContent sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h4" fontWeight={700}>
                      {userDetail.averagePoints}
                    </Typography>
                    <Typography variant="body2">Avg Points</Typography>
                  </CardContent>
                </Card>
                <Card
                  sx={{
                    flex: 1,
                    minWidth: 150,
                    bgcolor: "#ff9800",
                    color: "white",
                  }}
                >
                  <CardContent sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h4" fontWeight={700}>
                      {userDetail.bestScore}
                    </Typography>
                    <Typography variant="body2">Best Score</Typography>
                  </CardContent>
                </Card>
                <Card
                  sx={{
                    flex: 1,
                    minWidth: 150,
                    bgcolor: "#4caf50",
                    color: "white",
                  }}
                >
                  <CardContent sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h4" fontWeight={700}>
                      {userDetail.playersCount}
                    </Typography>
                    <Typography variant="body2">Players</Typography>
                  </CardContent>
                </Card>
              </Box>

              <Box mt={2} display="flex" gap={2} flexWrap="wrap">
                <Paper
                  sx={{ flex: 1, minWidth: 200, p: 2, bgcolor: "#f8f9fa" }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Rank
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    #{userDetail.rank} of {userDetail.totalParticipants}
                  </Typography>
                </Paper>
                <Paper
                  sx={{ flex: 1, minWidth: 200, p: 2, bgcolor: "#f8f9fa" }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Balance Left
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {formatIndianCurrency(userDetail.purseBalance)}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Match Performance Section */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            mb={3}
            color={colors.primary}
          >
            Match-wise Performance
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Match</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Your Points</TableCell>
                  <TableCell align="center">Rank</TableCell>
                  <TableCell align="center">Share %</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {matchPerformances.map((match) => (
                  <TableRow key={match.matchId} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {match.teamName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(match.date)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color={colors.primary}
                      >
                        {match.userPoints}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`#${match.rank}`}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={600}>
                        {match.share.toFixed(1)}%
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Match Details">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() =>
                            navigate(
                              `/admin/auctions/${auctionId}/participants/${userId}/match/${match.matchId}`
                            )
                          }
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Summary Stats */}
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
                {matchPerformances.length}
              </Typography>
              <Typography variant="body2">Total Matches</Typography>
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
                {matchPerformances.filter((m) => m.rank === 1).length}
              </Typography>
              <Typography variant="body2">Top Rank Wins</Typography>
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
                {matchPerformances.reduce((sum, m) => sum + m.userPoints, 0)}
              </Typography>
              <Typography variant="body2">Total Points</Typography>
            </Paper>
            <Paper
              sx={{
                flex: 1,
                minWidth: 150,
                p: 2,
                textAlign: "center",
                bgcolor: "#2196f3",
                color: "white",
              }}
            >
              <Typography variant="h6" fontWeight={700}>
                {matchPerformances.length > 0
                  ? (matchPerformances.reduce((sum, m) => sum + m.userPoints, 0) /
                      matchPerformances.length).toFixed(1)
                  : "0.0"}
              </Typography>
              <Typography variant="body2">Avg Points</Typography>
            </Paper>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AuctionParticipantDetailPage;
