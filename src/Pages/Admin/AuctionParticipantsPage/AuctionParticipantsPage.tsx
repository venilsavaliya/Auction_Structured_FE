import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  EmojiEvents as TrophyIcon,
  Person as PersonIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import colors from "../../../Colors";
import PageTitle from "../../../components/PageTitle/PageTitle";
import { buttonStyle } from "../../../ComponentStyles";
import auctionParticipantService from "../../../Services/AuctionParticipantService/AuctionParticipantService";
import auctionService from "../../../Services/AuctionService/AuctionService";
import GroupsIcon from "@mui/icons-material/Groups";
import type { AuctionDetailResponseModel } from "../../../Models/ResponseModels/AuctionDetailResponseModel";
import { AuctionStatus } from "../../../Constants";

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
  const [participants, setParticipants] = useState<AuctionParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [auction, setAuction] = useState<AuctionDetailResponseModel>();
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const auctionId = parseInt(id ?? "0");
  const navigate = useNavigate();

  // Fetch Auction By Id

  const fetchAuction = async (id: number) => {
    var auction = await auctionService.GetAuctionById(id);
    setAuction(auction);
  };

  // Fetch season id from auction id
  const fetchSeasonId = async (): Promise<number> => {
    const response = await auctionService.GetSeasonIdFromAuctionId(auctionId);
    if (response.isSuccess && response.data) {
      return new Promise<number>((resolve, reject) => {
        resolve(response.data);
      });
    }
    return new Promise<number>((resolve, reject) => {
      reject(0);
    });
  };

  // Fetch auction participants data
  const fetchParticipants = async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, we'll use seasonId as 1, but this should come from the auction details
      const seasonId = await fetchSeasonId();

      const request = {
        auctionId: auctionId,
        seasonId: seasonId,
      };

      const response =
        await auctionParticipantService.GetAuctionParticipantDetail(request);

      if (response.isSuccess && response.items) {
        // Transform the data to match our interface
        const transformedParticipants: AuctionParticipant[] =
          response.items.map((item, index) => ({
            id: item.id,
            fullName: item.userName,
            imageUrl: item.imageUrl,
            totalPoints: item.points,
            totalPlayers: item.totalPlayers,
            balanceLeft: 0, // This might need to come from a different endpoint
            rank: index + 1, // Calculate rank based on points
            teamName: `Team ${item.userName}`, // This might need to come from a different endpoint
            auctionId: item.auctionId,
            userId: item.userId,
          }));

        // Sort by points in descending order
        transformedParticipants.sort((a, b) => b.totalPoints - a.totalPoints);

        // Update ranks after sorting
        transformedParticipants.forEach((participant, index) => {
          participant.rank = index + 1;
        });

        setParticipants(transformedParticipants);
      } else {
        setError("Failed to fetch participants data");
      }
    } catch (err) {
      console.error("Error fetching participants:", err);
      setError("Failed to fetch participants data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auctionId > 0) {
      fetchParticipants();
      fetchAuction(auctionId);
    }
  }, [auctionId]);

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

  const handleViewDetails = (auctionId: number, userId: number) => {
    // TODO: Navigate to participant details page
    navigate(`/admin/auctions/${auctionId}/participant/${userId}/detail`);
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
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button variant="contained" onClick={fetchParticipants} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <Box sx={{ mb: 2 }}>
        <PageTitle title="Auction Participants" />
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Search and Stats */}
        <Box mb={3}>
          <Box
            display="flex"
            gap={3}
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
          >
            <Box flex={1} maxWidth={300}>
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
            </Box>
            <Box display="flex" gap={2}>
              <Card
                sx={{ minWidth: 120, bgcolor: colors.activeBg, color: "white" }}
              >
                <CardContent sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h6" fontWeight={700} fontSize={22}>
                    {participants.length}
                  </Typography>
                  <Typography variant="body2" fontSize={12}>
                    Total Participants
                  </Typography>
                </CardContent>
              </Card>
              {auction?.data.auctionStatus != AuctionStatus.Scheduled && (
                <Card
                  sx={{
                    minWidth: 120,
                    bgcolor: colors.primary,
                    color: "white",
                  }}
                >
                  <CardContent sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h6" fontWeight={700} fontSize={22}>
                      {participants
                        .reduce((sum, p) => sum + p.totalPoints, 0)
                        .toLocaleString()}
                    </Typography>
                    <Typography variant="body2" fontSize={12}>
                      Total Points
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Box>
        </Box>

        {/* Top 3 Participants Highlight */}
        {auction?.data.auctionStatus != AuctionStatus.Scheduled && (
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
        )}

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
          {filteredParticipants.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No participants found
              </Typography>
            </Box>
          ) : (
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
                            { auction?.data.auctionStatus != AuctionStatus.Scheduled && participant.rank <= 3 && (
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

                      {/* View Details Button */}
                      {auction?.data.auctionStatus !=
                        AuctionStatus.Scheduled && (
                        <Box
                          mt={2}
                          display="flex"
                          justifyContent="center"
                          gap={1}
                          alignItems="center"
                        >
                          <Box sx={{ flex: 1 }}>
                            <Button
                              variant="contained"
                              fullWidth
                              onClick={() =>
                                handleViewDetails(auctionId, participant.userId)
                              }
                              sx={buttonStyle}
                            >
                              View Details
                            </Button>
                          </Box>
                          <Box>
                            <Tooltip title="View Players" arrow>
                              <IconButton
                                sx={{ color: colors.secondary, p: 0 }}
                                onClick={() =>
                                  navigate(
                                    `/admin/auctions/${auctionId}/participants/${participant.userId}/players`
                                  )
                                }
                              >
                                <GroupsIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Paper>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AuctionParticipantsPage;
