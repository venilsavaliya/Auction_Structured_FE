import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Button,
  Chip,
  Avatar,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  EmojiEvents as TrophyIcon,
  Person as PersonIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import colors from "../../../Colors";
import PageTitle from "../../../components/PageTitle/PageTitle";
import { buttonStyle } from "../../../ComponentStyles";

interface AuctionParticipant {
  id: number;
  fullName: string;
  imageUrl?: string;
  totalPoints: number;
  totalPlayers: number;
  balanceLeft: number;
  rank: number;
  teamName?: string;
  auctionId: number;
  userId: number;
}

const AuctionParticipantsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Dummy data for auction participants
  const [participants] = useState<AuctionParticipant[]>([
    {
      id: 1,
      fullName: "Rahul Sharma",
      imageUrl: "https://via.placeholder.com/70",
      totalPoints: 1250,
      totalPlayers: 11,
      balanceLeft: 250000,
      rank: 1,
      teamName: "Mumbai Warriors",
      auctionId: 1,
      userId: 101,
    },
    {
      id: 2,
      fullName: "Priya Patel",
      imageUrl: "https://via.placeholder.com/70",
      totalPoints: 1180,
      totalPlayers: 10,
      balanceLeft: 180000,
      rank: 2,
      teamName: "Delhi Dynamos",
      auctionId: 1,
      userId: 102,
    },
    {
      id: 3,
      fullName: "Amit Kumar",
      imageUrl: "https://via.placeholder.com/70",
      totalPoints: 1120,
      totalPlayers: 11,
      balanceLeft: 320000,
      rank: 3,
      teamName: "Chennai Kings",
      auctionId: 1,
      userId: 103,
    },
    {
      id: 4,
      fullName: "Sneha Reddy",
      imageUrl: "https://via.placeholder.com/70",
      totalPoints: 1050,
      totalPlayers: 9,
      balanceLeft: 450000,
      rank: 4,
      teamName: "Bangalore Bulls",
      auctionId: 1,
      userId: 104,
    },
    {
      id: 5,
      fullName: "Vikram Singh",
      imageUrl: "https://via.placeholder.com/70",
      totalPoints: 980,
      totalPlayers: 11,
      balanceLeft: 120000,
      rank: 5,
      teamName: "Punjab Lions",
      auctionId: 1,
      userId: 105,
    },
    {
      id: 6,
      fullName: "Anjali Desai",
      imageUrl: "https://via.placeholder.com/70",
      totalPoints: 920,
      totalPlayers: 8,
      balanceLeft: 280000,
      rank: 6,
      teamName: "Rajasthan Royals",
      auctionId: 1,
      userId: 106,
    },
    {
      id: 7,
      fullName: "Rajesh Verma",
      imageUrl: "https://via.placeholder.com/70",
      totalPoints: 890,
      totalPlayers: 10,
      balanceLeft: 210000,
      rank: 7,
      teamName: "Gujarat Titans",
      auctionId: 1,
      userId: 107,
    },
    {
      id: 8,
      fullName: "Meera Iyer",
      imageUrl: "https://via.placeholder.com/70",
      totalPoints: 850,
      totalPlayers: 11,
      balanceLeft: 150000,
      rank: 8,
      teamName: "Kolkata Knights",
      auctionId: 1,
      userId: 108,
    },
  ]);

  // Filter participants based on search term
  const filteredParticipants = participants.filter(
    (participant) =>
      participant.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.teamName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankColor = (rank: number) => {
    if (rank === 1) return "#ffd700"; // Gold
    if (rank === 2) return "#c0c0c0"; // Silver
    if (rank === 3) return "#cd7f32"; // Bronze
    return "transparent";
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) return "🏆";
    return "";
  };

  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleViewDetails = (participant: AuctionParticipant) => {
    console.log("View details for:", participant.fullName);
    // TODO: Navigate to participant details page
  };

  return (
    <Box sx={{ p: 0, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <Box sx={{ mb: 2 }}>
        <PageTitle title="Auction Participants" />
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Search and Stats */}
        <Box mb={3}>
          <Box display="flex" gap={3} alignItems="center" flexWrap="wrap">
            {/* <Box flex={1} maxWidth={300}>
              <TextField
                fullWidth
                placeholder="Search participants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ bgcolor: "white" }}
              />
            </Box> */}
            <Box display="flex" gap={2}>
              <Card
                sx={{ minWidth: 120, bgcolor: colors.activeBg, color: "white" }}
              >
                <CardContent sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h6" fontWeight={700}>
                    {participants.length}
                  </Typography>
                  <Typography variant="body2">Total Participants</Typography>
                </CardContent>
              </Card>
              <Card
                sx={{ minWidth: 120, bgcolor: colors.primary, color: "white" }}
              >
                <CardContent sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h6" fontWeight={700}>
                    {participants
                      .reduce((sum, p) => sum + p.totalPoints, 0)
                      .toLocaleString()}
                  </Typography>
                  <Typography variant="body2">Total Points</Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>

        {/* Top 3 Participants Highlight */}
        <Box mb={3}>
          <Typography
            variant="h6"
            fontWeight={600}
            fontSize={20}
            mb={2}
            color={colors.primary}
          >
            Top Performers
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            {participants.slice(0, 3).map((participant) => (
              <Box key={participant.id} flex={1} maxWidth={300}>
                <Paper
                  elevation={6}
                  sx={{ bgcolor: "#f5f7fa", borderRadius: 2 }}
                >
                  <CardContent sx={{ textAlign: "center" }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mb={1}
                    >
                      <Avatar
                        src={participant.imageUrl}
                        sx={{ width: 50, height: 50, mr: 2 }}
                      >
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          {participant.fullName}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      color={colors.primary}
                    >
                      {participant.totalPoints}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Points
                    </Typography>
                  </CardContent>
                </Paper>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Participants Grid */}
        <Box>
          <Typography
            variant="h6"
            fontWeight={600}
            mb={2}
            color={colors.primary}
          >
            All Participants
          </Typography>
          <Box display="flex" gap={3} flexWrap="wrap">
            {filteredParticipants.map((participant) => (
              <Box key={participant.id} minWidth="280px" maxWidth="320px">
                <Paper
                  elevation={8}
                  sx={{ borderRadius: "15px", position: "relative" }}
                >
                  <Box p={2}>
                    {/* Header with Avatar and Name */}
                    <Box display="flex" justifyContent="center">
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        gap={2}
                      >
                        <Box position="relative">
                          <Box
                            height={70}
                            width={70}
                            borderRadius="50%"
                            overflow="hidden"
                          >
                            <Avatar
                              src={participant.imageUrl}
                              alt="User Avatar"
                              sx={{
                                width: 70,
                                height: 70,
                                borderRadius: "50%",
                                objectFit: "contain",
                              }}
                            />
                          </Box>
                          {participant.rank <= 3 && (
                            <Chip
                              label={participant.rank}
                              size="small"
                              sx={{
                                position: "absolute",
                                top: -5,
                                right: -5,
                                bgcolor: getRankColor(participant.rank),
                                color: "white",
                                fontWeight: 600,
                                fontSize: "10px",
                              }}
                            />
                          )}
                        </Box>
                        <Box textAlign="center">
                          <Typography
                            align="center"
                            fontWeight={600}
                            fontSize={16}
                          >
                            {participant.fullName}
                          </Typography>
                          
                        </Box>
                      </Box>
                    </Box>

                    {/* Stats Section */}
                    <Box
                      display="flex"
                      gap={2}
                      justifyContent="space-between"
                      mt={2}
                    >
                      <Box
                        sx={{ width: "50%" }}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        gap={1}
                      >
                        <Paper
                          elevation={8}
                          sx={{
                            padding: "10px",
                            width: "100%",
                            borderRadius: "10px",
                          }}
                        >
                          <Typography
                            fontWeight={600}
                            sx={{ textWrap: "nowrap" }}
                            fontSize={15}
                          >
                            {participant.totalPoints}
                          </Typography>
                          <Typography fontSize={11}>Total Points</Typography>
                        </Paper>
                      </Box>

                      <Box
                        sx={{ width: "50%" }}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        gap={1}
                      >
                        <Paper
                          elevation={8}
                          sx={{
                            padding: "10px",
                            width: "100%",
                            borderRadius: "10px",
                            height: "100%",
                          }}
                        >
                          <Typography fontWeight={600} fontSize={15}>
                            {participant.totalPlayers}/11
                          </Typography>
                          <Typography fontSize={11}>Players</Typography>
                        </Paper>
                      </Box>
                    </Box>

                    {/* Balance Section */}
                    {/* <Box mt={2}>
                      <Paper
                        elevation={8}
                        sx={{ padding: "10px", borderRadius: "10px" }}
                      >
                        <Typography
                          fontWeight={600}
                          fontSize={15}
                          textAlign="center"
                        >
                          ₹ {formatIndianCurrency(participant.balanceLeft)}
                        </Typography>
                        <Typography fontSize={11} textAlign="center">
                          Balance Left
                        </Typography>
                      </Paper>
                    </Box> */}

                    {/* View Details Button */}
                    <Box mt={2}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleViewDetails(participant)}
                        sx={buttonStyle}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AuctionParticipantsPage;
