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
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Checkbox,
  Button,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  EmojiEvents as TrophyIcon,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import colors from "../../../Colors";
import PageTitle from "../../../components/PageTitle/PageTitle";
import auctionParticipantService from "../../../Services/AuctionParticipantService/AuctionParticipantService";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import type {
  AuctionParticipantPlayersResponseModel,
  ParticipantPlayer,
} from "../../../Models/ResponseModels/AuctionParticipantPlayersResponseModel";
import { formatIndianCurrency } from "../../../Utility/Utility";
import { PlayerSkillDictionary } from "../../../constants/PlayerSkill";
import auctionService from "../../../Services/AuctionService/AuctionService";
import { AuctionStatus } from "../../../Constants";
import type { ReshufflePlayerRequestModel } from "../../../Models/RequestModels/ReshufflePlayerRequestModel";
import userTeamService from "../../../Services/UserTeamService/UserTeamService";

const AuctionParticipantPlayersPage: React.FC = () => {
  const { auctionId, participantId } = useParams<{
    auctionId: string;
    participantId: string;
  }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<ParticipantPlayer[]>([]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [isReshuffling, setIsReshuffling] = useState(false);

  // ✅ New state for selected players
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);

  const getAuctionDetail = async (auctionId: number) => {
    var res = await auctionService.GetAuctionById(auctionId);

    var auctioStatus = res.data.auctionStatus;

    if (auctioStatus == AuctionStatus.Reshuffling) {
      setIsReshuffling(true);
    } else {
      setIsReshuffling(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!auctionId || !participantId) return;
      setLoading(true);
      try {
        const res: AuctionParticipantPlayersResponseModel =
          await auctionParticipantService.GetAuctionParticipantPlayersAndDetail(
            {
              auctionId: Number(auctionId),
              userId: Number(participantId),
            }
          );
        setPlayers(res.data.participantsPlayers || []);
        setTotalPlayers(res.data.totalPlayers || 0);
        setTotalPoints(res.data.totalPoints || 0);
        setTotalSpent(res.data.totalAmountSpent || 0);
        getAuctionDetail(Number(auctionId));
      } catch (error) {
        setPlayers([]);
        setTotalPlayers(0);
        setTotalPoints(0);
        setTotalSpent(0);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [auctionId, participantId]);

  const getSkillColor = (skill: string) => {
    switch (skill) {
      case "Batsman":
        return { bg: "#e8f5e8", color: "#2e7d32" };
      case "Bowler":
        return { bg: "#ffebee", color: "#d32f2f" };
      case "All-Rounder":
        return { bg: "#fff3e0", color: "#f57c00" };
      case "WK-Batsman":
        return { bg: "#e3f2fd", color: "#1976d2" };
      default:
        return { bg: "#f5f5f5", color: "#757575" };
    }
  };

  const getPriceDifference = (basePrice: number, boughtPrice: number) => {
    const difference = boughtPrice - basePrice;
    const percentage =
      basePrice > 0 ? ((difference / basePrice) * 100).toFixed(1) : "0.0";
    return { difference, percentage };
  };

  // ✅ Toggle single player selection
  const handleSelectPlayer = (playerId: number) => {
    setSelectedPlayers((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  // ✅ Toggle select all
  const handleSelectAll = () => {
    if (selectedPlayers.length === players.length) {
      setSelectedPlayers([]); // deselect all
    } else {
      setSelectedPlayers(players.map((p) => p.playerId));
    }
  };

  // ✅ Finalize button action
  const handleFinalize = async () => {
    const finalizedPlayers = players.filter((p) =>
      selectedPlayers.includes(p.playerId)
    );

    var requestData: ReshufflePlayerRequestModel[] = finalizedPlayers.map(
      (p) => {
        return {
          AuctionId: Number(auctionId),
          PlayerId: p.playerId,
          PlayerBoughtPrice: p.playerBoughtPrice,
          UserId: Number(participantId),
        };
      }
    );
    console.log("Finalized Players:", requestData);
    // 👉 Here you can call an API or navigate with data
    await userTeamService.MarkPlayerForReshuffle(requestData);
    alert(`${finalizedPlayers.length} players finalized!`);
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

  const averagePoints = totalPlayers > 0 ? totalPoints / totalPlayers : 0;

  return (
    <Box sx={{ p: 0, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <Box sx={{ mb: 2 }}>
        <PageTitle title="Participant Players" />
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Back Button */}
        <Box mb={3}>
          <Chip
            icon={<ArrowBackIcon />}
            label="Back to Participants"
            onClick={() =>
              navigate(`/admin/auctions/${auctionId}/participants`)
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
        {/* Summary Cards */}

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{ bgcolor: colors.primary, color: "white", width: "250px" }}
            >
              <CardContent sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h4" fontWeight={700}>
                  {totalPlayers}
                </Typography>
                <Typography variant="body2">Total Players</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: "#4caf50", color: "white", width: "250px" }}>
              <CardContent sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h4" fontWeight={700}>
                  {totalPoints}
                </Typography>
                <Typography variant="body2">Total Points</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: "#ff9800", color: "white", width: "250px" }}>
              <CardContent sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h4" fontWeight={700}>
                  ₹{formatIndianCurrency(totalSpent)}
                </Typography>
                <Typography variant="body2">Total Spent</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: "#9c27b0", color: "white", width: "250px" }}>
              <CardContent sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h4" fontWeight={700}>
                  {averagePoints.toFixed(1)}
                </Typography>
                <Typography variant="body2">Avg Points</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* Players Table */}
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Box
            sx={{
              p: 3,
              bgcolor: colors.primary,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Player Squad
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <TrophyIcon sx={{ fontSize: 20 }} />
              <Typography variant="subtitle1" fontWeight={600}>
                {totalPoints} pts
              </Typography>
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: colors.activeBg }}>
                  {isReshuffling && (
                    <TableCell padding="checkbox" sx={{ color: "white" }}>
                      <Checkbox
                        sx={{
                          color: colors.primary, // unchecked color
                          "&.Mui-checked": {
                            color: "white", // checked color
                          },
                          "&.MuiCheckbox-indeterminate": {
                            color: "white", // checked color
                          },
                        }}
                        checked={
                          players.length > 0 &&
                          selectedPlayers.length === players.length
                        }
                        indeterminate={
                          selectedPlayers.length > 0 &&
                          selectedPlayers.length < players.length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                  )}

                  <TableCell sx={{ color: "white", fontWeight: 600 }}>
                    Player
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 600 }}
                    align="center"
                  >
                    Skill
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 600 }}
                    align="center"
                  >
                    Base Price
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 600 }}
                    align="center"
                  >
                    Bought Price
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 600 }}
                    align="center"
                  >
                    Points
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 600 }}
                    align="center"
                  >
                    Matches
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {players.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="subtitle1" color="textSecondary">
                        No Players found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  players.map((player) => {
                    const skillColor = getSkillColor(player.playerSkill);
                    const priceInfo = getPriceDifference(
                      player.playerPrice,
                      player.playerBoughtPrice
                    );
                    return (
                      <TableRow
                        key={player.playerId}
                        hover
                        sx={{
                          "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                          "&:hover": { backgroundColor: "#f1f1f1" },
                        }}
                      >
                        {isReshuffling && (
                          <TableCell padding="checkbox">
                            <Checkbox
                              sx={{
                                color: colors.primary, // unchecked color
                                "&.Mui-checked": {
                                  color: colors.primary, // checked color
                                },
                              }}
                              checked={selectedPlayers.includes(
                                player.playerId
                              )}
                              onChange={() =>
                                handleSelectPlayer(player.playerId)
                              }
                            />
                          </TableCell>
                        )}

                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar
                              src={player.playerImage}
                              sx={{ width: 40, height: 40 }}
                            >
                              <PersonIcon />
                            </Avatar>
                            <Box>
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                textAlign={"center"}
                              >
                                <Box
                                  display={"flex"}
                                  justifyContent={"start"}
                                  alignItems={"center"}
                                  gap={1}
                                >
                                  <Box>{player.playerName}</Box>
                                  <Box>
                                  {player.isReshuffled ? (
                                      player.isLeave ? (
                                        <ArrowDropDownIcon
                                          fontSize="large"
                                          sx={{ color: "red" }}
                                        />
                                      ) : (
                                        ""
                                      )
                                    ) : (
                                      ""
                                    )}

                                    {player.isReshuffled ? (
                                      player.isJoined ? (
                                        <ArrowDropUpIcon
                                          fontSize="large"
                                          sx={{ color: "green" }}
                                        />
                                      ) : (
                                       ""
                                      )
                                    ) : (
                                      ""
                                    )}

                                   
                                  </Box>
                                </Box>
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={PlayerSkillDictionary[player.playerSkill]}
                            size="small"
                            sx={{
                              bgcolor: skillColor.bg,
                              color: skillColor.color,
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          ₹{formatIndianCurrency(player.playerPrice)}
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight={600}>
                            ₹{formatIndianCurrency(player.playerBoughtPrice)}
                          </Typography>
                          <Typography
                            variant="caption"
                            color={
                              priceInfo.difference >= 0 ? "error" : "success"
                            }
                            fontWeight={600}
                          >
                            {priceInfo.difference >= 0 ? "+" : ""}
                            {priceInfo.percentage}%
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography fontWeight={700} color={colors.primary}>
                            {player.playerPoints}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {player.playersTotalMatches}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ✅ Finalize Button */}
          {isReshuffling && (
            <Box sx={{ p: 2, textAlign: "right" }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: colors.primary,
                  "&:hover": { bgcolor: "#004080" },
                  borderRadius: 2,
                  px: 3,
                }}
                disabled={selectedPlayers.length === 0}
                onClick={handleFinalize}
              >
                Finalize Selection
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default AuctionParticipantPlayersPage;
