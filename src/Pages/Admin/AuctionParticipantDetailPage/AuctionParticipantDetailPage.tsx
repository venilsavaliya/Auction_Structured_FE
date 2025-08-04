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
  const { auctionId, userId } = useParams<{
    auctionId: string;
    userId: string;
  }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [matchPerformances, setMatchPerformances] = useState<
    MatchPerformance[]
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

  // Dummy data for match performances
  const dummyMatchPerformances: MatchPerformance[] = [
    {
      id: 1,
      matchTitle: "Mumbai Warriors vs Delhi Dynamos",
      date: "2024-01-15",
      venue: "Wankhede Stadium, Mumbai",
      userPoints: 245,
      totalMatchPoints: 1200,
      userRank: 1,
      totalParticipants: 12,
      status: "completed",
      playerContributions: [
        {
          playerId: 1,
          playerName: "Virat Kohli",
          role: "Batsman",
          points: 85,
          performance: "89 runs, 2 catches",
          isCaptain: true,
        },
        {
          playerId: 2,
          playerName: "Jasprit Bumrah",
          role: "Bowler",
          points: 72,
          performance: "3 wickets, 2 maidens",
          isViceCaptain: true,
        },
        {
          playerId: 3,
          playerName: "Rohit Sharma",
          role: "Batsman",
          points: 45,
          performance: "52 runs, 1 catch",
        },
      ],
    },
    {
      id: 2,
      matchTitle: "Mumbai Warriors vs Chennai Kings",
      date: "2024-01-18",
      venue: "M. A. Chidambaram Stadium, Chennai",
      userPoints: 198,
      totalMatchPoints: 1100,
      userRank: 2,
      totalParticipants: 12,
      status: "completed",
      playerContributions: [
        {
          playerId: 1,
          playerName: "Virat Kohli",
          role: "Batsman",
          points: 65,
          performance: "78 runs, 1 catch",
          isCaptain: true,
        },
        {
          playerId: 4,
          playerName: "MS Dhoni",
          role: "Wicket-Keeper",
          points: 58,
          performance: "45 runs, 2 stumpings",
          isViceCaptain: true,
        },
        {
          playerId: 5,
          playerName: "Ravindra Jadeja",
          role: "All-Rounder",
          points: 42,
          performance: "35 runs, 2 wickets",
        },
      ],
    },
    {
      id: 3,
      matchTitle: "Mumbai Warriors vs Bangalore Bulls",
      date: "2024-01-22",
      venue: "M. Chinnaswamy Stadium, Bangalore",
      userPoints: 167,
      totalMatchPoints: 950,
      userRank: 1,
      totalParticipants: 12,
      status: "completed",
      playerContributions: [
        {
          playerId: 2,
          playerName: "Jasprit Bumrah",
          role: "Bowler",
          points: 78,
          performance: "4 wickets, 1 maiden",
          isCaptain: true,
        },
        {
          playerId: 6,
          playerName: "KL Rahul",
          role: "Wicket-Keeper",
          points: 52,
          performance: "67 runs, 1 stumping",
          isViceCaptain: true,
        },
        {
          playerId: 7,
          playerName: "Hardik Pandya",
          role: "All-Rounder",
          points: 37,
          performance: "28 runs, 1 wicket",
        },
      ],
    },
    {
      id: 4,
      matchTitle: "Mumbai Warriors vs Punjab Lions",
      date: "2024-01-25",
      venue: "IS Bindra Stadium, Mohali",
      userPoints: 189,
      totalMatchPoints: 1050,
      userRank: 1,
      totalParticipants: 12,
      status: "completed",
      playerContributions: [
        {
          playerId: 1,
          playerName: "Virat Kohli",
          role: "Batsman",
          points: 92,
          performance: "103 runs, 1 catch",
          isCaptain: true,
        },
        {
          playerId: 8,
          playerName: "Mohammed Shami",
          role: "Bowler",
          points: 61,
          performance: "3 wickets, 1 maiden",
          isViceCaptain: true,
        },
        {
          playerId: 9,
          playerName: "Shreyas Iyer",
          role: "Batsman",
          points: 36,
          performance: "45 runs, 1 catch",
        },
      ],
    },
    {
      id: 5,
      matchTitle: "Mumbai Warriors vs Rajasthan Royals",
      date: "2024-01-28",
      venue: "Sawai Mansingh Stadium, Jaipur",
      userPoints: 156,
      totalMatchPoints: 980,
      userRank: 2,
      totalParticipants: 12,
      status: "completed",
      playerContributions: [
        {
          playerId: 2,
          playerName: "Jasprit Bumrah",
          role: "Bowler",
          points: 68,
          performance: "3 wickets, 2 maidens",
          isCaptain: true,
        },
        {
          playerId: 10,
          playerName: "Sanju Samson",
          role: "Wicket-Keeper",
          points: 48,
          performance: "52 runs, 1 stumping",
          isViceCaptain: true,
        },
        {
          playerId: 11,
          playerName: "Yuzvendra Chahal",
          role: "Bowler",
          points: 40,
          performance: "2 wickets, 1 maiden",
        },
      ],
    },
    {
      id: 6,
      matchTitle: "Mumbai Warriors vs Gujarat Titans",
      date: "2024-02-01",
      venue: "Narendra Modi Stadium, Ahmedabad",
      userPoints: 223,
      totalMatchPoints: 1150,
      userRank: 1,
      totalParticipants: 12,
      status: "completed",
      playerContributions: [
        {
          playerId: 1,
          playerName: "Virat Kohli",
          role: "Batsman",
          points: 95,
          performance: "112 runs, 1 catch",
          isCaptain: true,
        },
        {
          playerId: 12,
          playerName: "Rashid Khan",
          role: "Bowler",
          points: 68,
          performance: "4 wickets, 1 maiden",
          isViceCaptain: true,
        },
        {
          playerId: 13,
          playerName: "David Warner",
          role: "Batsman",
          points: 60,
          performance: "78 runs, 1 catch",
        },
      ],
    },
    {
      id: 7,
      matchTitle: "Mumbai Warriors vs Kolkata Knights",
      date: "2024-02-05",
      venue: "Eden Gardens, Kolkata",
      userPoints: 178,
      totalMatchPoints: 1020,
      userRank: 3,
      totalParticipants: 12,
      status: "completed",
      playerContributions: [
        {
          playerId: 2,
          playerName: "Jasprit Bumrah",
          role: "Bowler",
          points: 75,
          performance: "3 wickets, 2 maidens",
          isCaptain: true,
        },
        {
          playerId: 14,
          playerName: "Andre Russell",
          role: "All-Rounder",
          points: 58,
          performance: "45 runs, 2 wickets",
          isViceCaptain: true,
        },
        {
          playerId: 15,
          playerName: "Sunil Narine",
          role: "Bowler",
          points: 45,
          performance: "2 wickets, 1 maiden",
        },
      ],
    },
    {
      id: 8,
      matchTitle: "Mumbai Warriors vs Hyderabad Sunrisers",
      date: "2024-02-08",
      venue: "Rajiv Gandhi Stadium, Hyderabad",
      userPoints: 201,
      totalMatchPoints: 1080,
      userRank: 1,
      totalParticipants: 12,
      status: "completed",
      playerContributions: [
        {
          playerId: 1,
          playerName: "Virat Kohli",
          role: "Batsman",
          points: 88,
          performance: "95 runs, 2 catches",
          isCaptain: true,
        },
        {
          playerId: 16,
          playerName: "Kane Williamson",
          role: "Batsman",
          points: 67,
          performance: "82 runs, 1 catch",
          isViceCaptain: true,
        },
        {
          playerId: 17,
          playerName: "Bhuvneshwar Kumar",
          role: "Bowler",
          points: 46,
          performance: "3 wickets, 1 maiden",
        },
      ],
    },
    {
      id: 9,
      matchTitle: "Mumbai Warriors vs Lucknow Super Giants",
      date: "2024-02-12",
      venue: "BRSABV Ekana Stadium, Lucknow",
      userPoints: 165,
      totalMatchPoints: 990,
      userRank: 2,
      totalParticipants: 12,
      status: "completed",
      playerContributions: [
        {
          playerId: 2,
          playerName: "Jasprit Bumrah",
          role: "Bowler",
          points: 72,
          performance: "4 wickets, 1 maiden",
          isCaptain: true,
        },
        {
          playerId: 18,
          playerName: "KL Rahul",
          role: "Wicket-Keeper",
          points: 55,
          performance: "68 runs, 1 stumping",
          isViceCaptain: true,
        },
        {
          playerId: 19,
          playerName: "Marcus Stoinis",
          role: "All-Rounder",
          points: 38,
          performance: "42 runs, 1 wicket",
        },
      ],
    },
    {
      id: 10,
      matchTitle: "Mumbai Warriors vs Delhi Dynamos",
      date: "2024-02-15",
      venue: "Arun Jaitley Stadium, Delhi",
      userPoints: 234,
      totalMatchPoints: 1180,
      userRank: 1,
      totalParticipants: 12,
      status: "completed",
      playerContributions: [
        {
          playerId: 1,
          playerName: "Virat Kohli",
          role: "Batsman",
          points: 98,
          performance: "108 runs, 2 catches",
          isCaptain: true,
        },
        {
          playerId: 20,
          playerName: "Rishabh Pant",
          role: "Wicket-Keeper",
          points: 76,
          performance: "85 runs, 2 stumpings",
          isViceCaptain: true,
        },
        {
          playerId: 21,
          playerName: "Kagiso Rabada",
          role: "Bowler",
          points: 60,
          performance: "3 wickets, 1 maiden",
        },
      ],
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUserDetail(dummyUserDetail);
      setMatchPerformances(dummyMatchPerformances);
      setLoading(false);
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

        {/* Performance Stats */}
        {/* <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            mb={2}
            color={colors.primary}
          >
            Performance Statistics
          </Typography>
          <Box display="flex" gap={3} flexWrap="wrap" justifyContent="center">
            <Box textAlign="center" flex={1} minWidth={150}>
              <Typography variant="h4" fontWeight={700} color={colors.primary}>
                {userDetail.totalMatches}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Matches Played
              </Typography>
            </Box>
            <Box textAlign="center" flex={1} minWidth={150}>
              <Typography variant="h4" fontWeight={700} color="#ff9800">
                {userDetail.captainPoints}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Captain Points
              </Typography>
            </Box>
            <Box textAlign="center" flex={1} minWidth={150}>
              <Typography variant="h4" fontWeight={700} color="#2196f3">
                {userDetail.viceCaptainPoints}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Vice Captain Points
              </Typography>
            </Box>
          </Box>
        </Paper> */}

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
                  {/* <TableCell>Venue</TableCell> */}
                  {/* <TableCell>Status</TableCell> */}
                  <TableCell align="center">Your Points</TableCell>
                  <TableCell align="center">Rank</TableCell>
                  <TableCell align="center">Share %</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {matchPerformances.map((match) => (
                  <TableRow key={match.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {match.matchTitle}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(match.date)}
                      </Typography>
                    </TableCell>
                    {/* <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {match.venue}
                      </Typography>
                    </TableCell> */}
                    {/* <TableCell>
                      <Chip
                        label={match.status.toUpperCase()}
                        color={getStatusColor(match.status) as any}
                        size="small"
                      />
                    </TableCell> */}
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
                        label={`#${match.userRank}`}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={600}>
                        {(
                          (match.userPoints / match.totalMatchPoints) *
                          100
                        ).toFixed(1)}
                        %
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Match Details">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() =>
                            navigate(
                              `/admin/auctions/${auctionId}/participants/${userId}/match/${match.id}`
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
                {matchPerformances.filter((m) => m.userRank === 1).length}
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
                {(
                  matchPerformances.reduce((sum, m) => sum + m.userPoints, 0) /
                  matchPerformances.length
                ).toFixed(1)}
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
