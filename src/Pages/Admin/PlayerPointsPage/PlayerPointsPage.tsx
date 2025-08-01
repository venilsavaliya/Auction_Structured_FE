import React, { useState, useEffect } from "react";
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
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  TableSortLabel,
  Pagination,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Search as SearchIcon,
  EmojiEvents as TrophyIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  SportsCricket as CricketIcon,
} from "@mui/icons-material";
import colors from "../../../Colors";
import PageTitle from "../../../components/PageTitle/PageTitle";
import seasonService from "../../../Services/Seasonservice/SeasonService";
import type { SeasonResponseModel } from "../../../Models/ResponseModels/SeasonListResponseModel";
import { toast } from "react-toastify";

interface PlayerSeasonPoints {
  id: number;
  name: string;
  teamName: string;
  imageUrl?: string;
  totalPoints: number;
  matchesPlayed: number;
  averagePoints: number;
  highestScore: number;
  runs: number;
  wickets: number;
  catches: number;
  stumpings: number;
  runouts: number;
  fours: number;
  sixes: number;
  maidenOvers: number;
  rank: number;
}

const PlayerPointsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeason, setSelectedSeason] = useState<number>(2024);
  const [sortBy, setSortBy] = useState<keyof PlayerSeasonPoints>("totalPoints");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [seasons, setSeasons] = useState<SeasonResponseModel[]>([]);

  const fetchSeasons = async () => {
    try {
      const res = await seasonService.GetSeasons();
      setSeasons(res.items);
      // Set the first season as selected if available
      if (res.items.length > 0) {
        setSelectedSeason(res.items[0].id);
      }
    } catch (error) {
      toast.error("Failed to fetch seasons");
    }
  };

  useEffect(() => {
    fetchSeasons();
  }, []);

  // Dummy data for demonstration
  const [players] = useState<PlayerSeasonPoints[]>([
    {
      id: 1,
      name: "Virat Kohli",
      teamName: "Royal Challengers Bangalore",
      imageUrl: "https://via.placeholder.com/40",
      totalPoints: 1250,
      matchesPlayed: 14,
      averagePoints: 89.3,
      highestScore: 156,
      runs: 890,
      wickets: 0,
      catches: 8,
      stumpings: 0,
      runouts: 2,
      fours: 45,
      sixes: 12,
      maidenOvers: 0,
      rank: 1,
    },
    {
      id: 2,
      name: "Rohit Sharma",
      teamName: "Mumbai Indians",
      imageUrl: "https://via.placeholder.com/40",
      totalPoints: 1180,
      matchesPlayed: 14,
      averagePoints: 84.3,
      highestScore: 142,
      runs: 820,
      wickets: 0,
      catches: 6,
      stumpings: 0,
      runouts: 1,
      fours: 38,
      sixes: 15,
      maidenOvers: 0,
      rank: 2,
    },
    {
      id: 3,
      name: "Jasprit Bumrah",
      teamName: "Mumbai Indians",
      imageUrl: "https://via.placeholder.com/40",
      totalPoints: 1120,
      matchesPlayed: 14,
      averagePoints: 80.0,
      highestScore: 95,
      runs: 45,
      wickets: 28,
      catches: 3,
      stumpings: 0,
      runouts: 1,
      fours: 2,
      sixes: 0,
      maidenOvers: 4,
      rank: 3,
    },
    {
      id: 4,
      name: "KL Rahul",
      teamName: "Lucknow Super Giants",
      imageUrl: "https://via.placeholder.com/40",
      totalPoints: 1080,
      matchesPlayed: 14,
      averagePoints: 77.1,
      highestScore: 138,
      runs: 750,
      wickets: 0,
      catches: 5,
      stumpings: 0,
      runouts: 0,
      fours: 32,
      sixes: 18,
      maidenOvers: 0,
      rank: 4,
    },
    {
      id: 5,
      name: "Ravindra Jadeja",
      teamName: "Chennai Super Kings",
      imageUrl: "https://via.placeholder.com/40",
      totalPoints: 1050,
      matchesPlayed: 14,
      averagePoints: 75.0,
      highestScore: 85,
      runs: 420,
      wickets: 18,
      catches: 12,
      stumpings: 0,
      runouts: 3,
      fours: 18,
      sixes: 8,
      maidenOvers: 2,
      rank: 5,
    },
    {
      id: 6,
      name: "MS Dhoni",
      teamName: "Chennai Super Kings",
      imageUrl: "https://via.placeholder.com/40",
      totalPoints: 980,
      matchesPlayed: 14,
      averagePoints: 70.0,
      highestScore: 78,
      runs: 380,
      wickets: 0,
      catches: 8,
      stumpings: 6,
      runouts: 1,
      fours: 15,
      sixes: 12,
      maidenOvers: 0,
      rank: 6,
    },
    {
      id: 7,
      name: "Hardik Pandya",
      teamName: "Gujarat Titans",
      imageUrl: "https://via.placeholder.com/40",
      totalPoints: 920,
      matchesPlayed: 14,
      averagePoints: 65.7,
      highestScore: 72,
      runs: 320,
      wickets: 12,
      catches: 4,
      stumpings: 0,
      runouts: 2,
      fours: 14,
      sixes: 10,
      maidenOvers: 0,
      rank: 7,
    },
    {
      id: 8,
      name: "Yuzvendra Chahal",
      teamName: "Rajasthan Royals",
      imageUrl: "https://via.placeholder.com/40",
      totalPoints: 890,
      matchesPlayed: 14,
      averagePoints: 63.6,
      highestScore: 68,
      runs: 25,
      wickets: 25,
      catches: 2,
      stumpings: 0,
      runouts: 0,
      fours: 1,
      sixes: 0,
      maidenOvers: 3,
      rank: 8,
    },
    {
      id: 9,
      name: "Rishabh Pant",
      teamName: "Delhi Capitals",
      imageUrl: "https://via.placeholder.com/40",
      totalPoints: 850,
      matchesPlayed: 14,
      averagePoints: 60.7,
      highestScore: 89,
      runs: 580,
      wickets: 0,
      catches: 3,
      stumpings: 8,
      runouts: 1,
      fours: 28,
      sixes: 14,
      maidenOvers: 0,
      rank: 9,
    },
    {
      id: 10,
      name: "Mohammed Shami",
      teamName: "Gujarat Titans",
      imageUrl: "https://via.placeholder.com/40",
      totalPoints: 820,
      matchesPlayed: 14,
      averagePoints: 58.6,
      highestScore: 45,
      runs: 35,
      wickets: 22,
      catches: 1,
      stumpings: 0,
      runouts: 0,
      fours: 2,
      sixes: 0,
      maidenOvers: 2,
      rank: 10,
    },
  ]);

  // Filter and sort players
  const filteredPlayers = players
    .filter(
      (player) =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.teamName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredPlayers.length / rowsPerPage);
  const paginatedPlayers = filteredPlayers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleSort = (property: keyof PlayerSeasonPoints) => {
    const isAsc = sortBy === property && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(property);
  };

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

  return (
    <Box sx={{ p: 0, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <Box sx={{ mb: 2 }}>
        <PageTitle title="Season Player Points" />
      </Box>

      <Box sx={{ p: 0 }}>
        {/* Search and Stats */}
        <Box mb={3}>
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <Box flex={1} maxWidth={200}>
              <TextField
                fullWidth
                placeholder="Search players..."
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
            <Box minWidth={150}>
              <FormControl fullWidth sx={{ bgcolor: "white" }}>
                <InputLabel>Season</InputLabel>
                <Select
                  value={selectedSeason}
                  label="Season"
                  onChange={(e) => setSelectedSeason(e.target.value as number)}
                >
                  {seasons.map((season) => (
                    <MenuItem key={season.id} value={season.id}>
                      {season.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>

        {/* Top 3 Players Highlight */}
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
            {players.slice(0, 3).map((player, index) => (
              <Box key={player.id} flex={1} maxWidth={250}>
                <Paper
                  elevation={6}
                  sx={{
                    bgcolor: "#f5f7fa", // lighter background for 3D look
                    position: "relative",
                    borderRadius: 2,
                  }}
                >
                  <CardContent sx={{ textAlign: "center" }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mb={1}
                    >
                      <Avatar
                        src={player.imageUrl}
                        sx={{ width: 40, height: 40, mr: 2 }}
                      >
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          {player.name}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      color={colors.primary}
                    >
                      {player.totalPoints}
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

        {/* Players Table */}
        <Paper elevation={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: colors.activeBg }}>
                  <TableCell
                    sx={{ color: "white", fontWeight: 600, width: "50px" }}
                  >
                    Rank
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>
                    Player
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    <TableSortLabel
                      active={sortBy === "totalPoints"}
                      direction={sortOrder}
                      onClick={() => handleSort("totalPoints")}
                      sx={{ color: "white" }}
                    >
                      Total Points
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    <TableSortLabel
                      active={sortBy === "matchesPlayed"}
                      direction={sortOrder}
                      onClick={() => handleSort("matchesPlayed")}
                      sx={{ color: "white" }}
                    >
                      Matches
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    <TableSortLabel
                      active={sortBy === "averagePoints"}
                      direction={sortOrder}
                      onClick={() => handleSort("averagePoints")}
                      sx={{ color: "white" }}
                    >
                      Avg Points
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    Runs
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    Wickets
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    Performance
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPlayers.map((player) => (
                  <TableRow key={player.id} hover>
                    <TableCell>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Chip
                          label={player.rank}
                          size="small"
                          sx={{
                            bgcolor: getRankColor(player.rank),
                            color: player.rank <= 3 ? "white" : "inherit",
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    </TableCell>
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
                          <Typography variant="caption" color="text.secondary">
                            {player.teamName}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color={colors.primary}
                      >
                        {player.totalPoints}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={600}>
                        {player.matchesPlayed}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={600}>
                        {player.averagePoints.toFixed(1)}
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
                    <TableCell align="center">
                      <Box display="flex" gap={0.5} justifyContent="center">
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
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PlayerPointsPage;
