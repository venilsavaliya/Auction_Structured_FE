import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Divider,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import PageTitle from "../../../components/PageTitle/PageTitle";
import colors from "../../../Colors";
import SelectPlayerModal from "../../../components/SelectPlayerModal/SelectPlayerModal";
import { useParams } from "react-router-dom";
import matchService from "../../../Services/MatcheService/MatchService";

interface PlayerStats {
  id: string;
  name: string;
  team: string;
  runs: number;
  fours: number;
  sixes: number;
  wickets: number;
  maidenOvers: number;
  catches: number;
  stumpings: number;
  runouts: number;
}

interface ConfigureScorePageProps {}

const ConfigureScorePage: React.FC<ConfigureScorePageProps> = () => {
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [teamAPlayers, setTeamAPlayers] = useState<PlayerStats[]>([]);
  const [teamBPlayers, setTeamBPlayers] = useState<PlayerStats[]>([]);
  const [teamA, setTeamA] = useState<string>("");
  const [teamB, setTeamB] = useState<string>("");
  const [teamAId, setTeamAId] = useState<number>(0);
  const [teamBId, setTeamBId] = useState<number>(0);
  const { matchId } = useParams<string>();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Modal state
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<{ teamA: number[]; teamB: number[] }>({ teamA: [], teamB: [] });

  // Initialize with dummy data
  useEffect(() => {
    const dummyPlayers: PlayerStats[] = [
      {
        id: "1",
        name: "Virat Kohli",
        team: "Team A",
        runs: 0,
        fours: 0,
        sixes: 0,
        wickets: 0,
        maidenOvers: 0,
        catches: 0,
        stumpings: 0,
        runouts: 0,
      },
      {
        id: "2",
        name: "Rohit Sharma",
        team: "Team A",
        runs: 0,
        fours: 0,
        sixes: 0,
        wickets: 0,
        maidenOvers: 0,
        catches: 0,
        stumpings: 0,
        runouts: 0,
      },
      {
        id: "3",
        name: "MS Dhoni",
        team: "Team A",
        runs: 0,
        fours: 0,
        sixes: 0,
        wickets: 0,
        maidenOvers: 0,
        catches: 0,
        stumpings: 0,
        runouts: 0,
      },
      {
        id: "4",
        name: "Jasprit Bumrah",
        team: "Team B",
        runs: 0,
        fours: 0,
        sixes: 0,
        wickets: 0,
        maidenOvers: 0,
        catches: 0,
        stumpings: 0,
        runouts: 0,
      },
      {
        id: "5",
        name: "Ravindra Jadeja",
        team: "Team B",
        runs: 0,
        fours: 0,
        sixes: 0,
        wickets: 0,
        maidenOvers: 0,
        catches: 0,
        stumpings: 0,
        runouts: 0,
      },
      {
        id: "6",
        name: "KL Rahul",
        team: "Team B",
        runs: 0,
        fours: 0,
        sixes: 0,
        wickets: 0,
        maidenOvers: 0,
        catches: 0,
        stumpings: 0,
        runouts: 0,
      },
    ];
    setPlayers(dummyPlayers);
    fetchMatchData();
  }, [matchId]);

  const fetchMatchData = async()=>{
    const response = await matchService.GetMatchById(Number(matchId));
    if(response.isSuccess && response.data){
      setTeamA(response.data.teamAName);
      setTeamB(response.data.teamBName);
      setTeamAId(response.data.teamAId);
      setTeamBId(response.data.teamBId);
    }
  }

  const handleInputChange = (
    playerId: string,
    field: keyof PlayerStats,
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === playerId ? { ...player, [field]: numValue } : player
      )
    );
  };

  const handleSave = () => {
    try {
      // Validate data
      const hasNegativeValues = players.some(
        (player) =>
          player.runs < 0 ||
          player.fours < 0 ||
          player.sixes < 0 ||
          player.wickets < 0 ||
          player.maidenOvers < 0 ||
          player.catches < 0 ||
          player.stumpings < 0 ||
          player.runouts < 0
      );

      if (hasNegativeValues) {
        setErrorMessage("All values must be non-negative numbers");
        setShowError(true);
        return;
      }

      // Here you would typically save to backend
      console.log("Saving player stats:", players);
      console.log("Selected player IDs:", selectedPlayerIds);
      setShowSuccess(true);
    } catch (error) {
      setErrorMessage("Failed to save data");
      setShowError(true);
    }
  };

  const handleReset = () => {
    setPlayers((prev) =>
      prev.map((player) => ({
        ...player,
        runs: 0,
        fours: 0,
        sixes: 0,
        wickets: 0,
        maidenOvers: 0,
        catches: 0,
        stumpings: 0,
        runouts: 0,
      }))
    );
    setSelectedPlayerIds({ teamA: [], teamB: [] });
  };

  const addPlayer = () => {
    const newPlayer: PlayerStats = {
      id: Date.now().toString(),
      name: "",
      team: "Team A",
      runs: 0,
      fours: 0,
      sixes: 0,
      wickets: 0,
      maidenOvers: 0,
      catches: 0,
      stumpings: 0,
      runouts: 0,
    };
    setPlayers((prev) => [...prev, newPlayer]);
  };

  const deletePlayer = (playerId: string) => {
    setPlayers((prev) => prev.filter((player) => player.id !== playerId));
  };

  const getTeamPlayers = (teamName: string) => {
    return players.filter((player) => player.team === teamName);
  };

  const getTeamTotals = (teamName: string) => {
    const teamPlayers = getTeamPlayers(teamName);
    return {
      runs: teamPlayers.reduce((sum, player) => sum + player.runs, 0),
      fours: teamPlayers.reduce((sum, player) => sum + player.fours, 0),
      sixes: teamPlayers.reduce((sum, player) => sum + player.sixes, 0),
      wickets: teamPlayers.reduce((sum, player) => sum + player.wickets, 0),
      maidenOvers: teamPlayers.reduce(
        (sum, player) => sum + player.maidenOvers,
        0
      ),
      catches: teamPlayers.reduce((sum, player) => sum + player.catches, 0),
      stumpings: teamPlayers.reduce((sum, player) => sum + player.stumpings, 0),
      runouts: teamPlayers.reduce((sum, player) => sum + player.runouts, 0),
    };
  };

  const handleOpenPlayerModal = () => {
    setShowPlayerModal(true);
  };

  const handleClosePlayerModal = () => {
    setShowPlayerModal(false);
  };

  const handlePlayerSelection = (selected: { teamA: number[]; teamB: number[] }) => {
    setSelectedPlayerIds(selected);
    console.log("Selected players:", selected.teamA, selected.teamB , selected.teamA.length + selected.teamB.length);
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <PageTitle title="Configure Player Statistics" />

      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          p: 3,
          mb: 3,
          bgcolor: "white",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" fontWeight={600} color={colors.primary}>
            Match Statistics Configuration
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<PeopleIcon />}
              onClick={handleOpenPlayerModal}
              sx={{ borderColor: colors.secondary, color: colors.secondary }}
            >
              Select Players ({selectedPlayerIds.teamA.length + selectedPlayerIds.teamB.length})
            </Button>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addPlayer}
              sx={{ borderColor: colors.primary, color: colors.primary }}
            >
              Add Player
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleReset}
              sx={{ borderColor: colors.secondary, color: colors.secondary }}
            >
              Reset All
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{ bgcolor: colors.primary }}
            >
              Save Data
            </Button>
          </Box>
        </Box>

        {/* Team Names */}
        <Box display="flex" gap={3} mb={3}>
          <TextField
            fullWidth
            label="Team A Name"
            value={teamA}
            onChange={(e) => setTeamA(e.target.value)}
            variant="outlined"
            size="small"
          />
          <TextField
            fullWidth
            label="Team B Name"
            value={teamB}
            onChange={(e) => setTeamB(e.target.value)}
            variant="outlined"
            size="small"
          />
        </Box>

        {/* Selected Players Summary */}
        {selectedPlayerIds.teamA.length + selectedPlayerIds.teamB.length > 0 && (
          <Box
            mb={3}
            p={2}
            bgcolor="#f8f9fa"
            borderRadius={2}
            border="1px solid #e0e0e0"
          >
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Selected Players ({selectedPlayerIds.teamA.length + selectedPlayerIds.teamB.length})
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {selectedPlayerIds.teamA.map((playerId) => {
                const player = players.find(
                  (p) => p.id === playerId.toString()
                );
                return (
                  <Chip
                    key={playerId}
                    label={player?.name || `Player ${playerId}`}
                    size="small"
                    sx={{
                      bgcolor: colors.primary,
                      color: "white",
                      fontSize: 11,
                    }}
                  />
                );
              })}
              {selectedPlayerIds.teamB.map((playerId) => {
                const player = players.find(
                  (p) => p.id === playerId.toString()
                );
                return (
                  <Chip
                    key={playerId}
                    label={player?.name || `Player ${playerId}`}
                    size="small"
                    sx={{
                      bgcolor: colors.primary,
                      color: "white",
                      fontSize: 11,
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        )}

        {/* Team A Stats */}
        <Box mb={4}>
          <Typography
            variant="h6"
            fontWeight={600}
            mb={2}
            color={colors.primary}
          >
            {teamA} Players
          </Typography>
          <TableContainer component={Paper} elevation={1}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: colors.primary }}>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>
                    Player
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 600 }}
                    align="center"
                  >
                    Runs
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 600 }}
                    align="center"
                  >
                    4s
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 600 }}
                    align="center"
                  >
                    6s
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 600 }}
                    align="center"
                  >
                    Wickets
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 600 }}
                    align="center"
                  >
                    Maiden Overs
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 600 }}
                    align="center"
                  >
                    Catches
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 600 }}
                    align="center"
                  >
                    Stumpings
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 600 }}
                    align="center"
                  >
                    Runouts
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 600 }}
                    align="center"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getTeamPlayers("Team A").map((player) => (
                  <TableRow key={player.id} hover>
                    <TableCell>
                      <TextField
                        value={player.name}
                        onChange={(e) =>
                          handleInputChange(player.id, "name", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="text"
                        value={player.runs}
                        onChange={(e) =>
                          handleInputChange(player.id, "runs", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="text"
                        value={player.fours}
                        onChange={(e) =>
                          handleInputChange(player.id, "fours", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="text"
                        value={player.sixes}
                        onChange={(e) =>
                          handleInputChange(player.id, "sixes", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="text"
                        value={player.wickets}
                        onChange={(e) =>
                          handleInputChange(
                            player.id,
                            "wickets",
                            e.target.value
                          )
                        }
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="text"
                        value={player.maidenOvers}
                        onChange={(e) =>
                          handleInputChange(
                            player.id,
                            "maidenOvers",
                            e.target.value
                          )
                        }
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="text"
                        value={player.catches}
                        onChange={(e) =>
                          handleInputChange(
                            player.id,
                            "catches",
                            e.target.value
                          )
                        }
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="text"
                        value={player.stumpings}
                        onChange={(e) =>
                          handleInputChange(
                            player.id,
                            "stumpings",
                            e.target.value
                          )
                        }
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="text"
                        value={player.runouts}
                        onChange={(e) =>
                          handleInputChange(
                            player.id,
                            "runouts",
                            e.target.value
                          )
                        }
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => deletePlayer(player.id)}
                        sx={{ color: colors.error }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Team A Totals */}
                <TableRow sx={{ bgcolor: "#f0f8ff" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Team A Total</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {getTeamTotals("Team A").runs}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {getTeamTotals("Team A").fours}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {getTeamTotals("Team A").sixes}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {getTeamTotals("Team A").wickets}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {getTeamTotals("Team A").maidenOvers}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {getTeamTotals("Team A").catches}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {getTeamTotals("Team A").stumpings}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {getTeamTotals("Team A").runouts}
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Team B Stats */}
        <Box mb={4}>
          <Typography
            variant="h6"
            fontWeight={600}
            mb={2}
            color={colors.primary}
          >
            {teamB} Players
          </Typography>
          <TableContainer component={Paper} elevation={1}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: colors.primary }}>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>
                    Player
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 600 }}
                    align="center"
                  >
                    Runs
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 600 }}
                    align="center"
                  >
                    4s
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 600 }}
                    align="center"
                  >
                    6s
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 600 }}
                    align="center"
                  >
                    Wickets
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 600 }}
                    align="center"
                  >
                    Maiden Overs
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 600 }}
                    align="center"
                  >
                    Catches
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 600 }}
                    align="center"
                  >
                    Stumpings
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 600 }}
                    align="center"
                  >
                    Runouts
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 600 }}
                    align="center"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getTeamPlayers("Team B").map((player) => (
                  <TableRow key={player.id} hover>
                    <TableCell>
                      <TextField
                        value={player.name}
                        onChange={(e) =>
                          handleInputChange(player.id, "name", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="text"
                        value={player.runs}
                        onChange={(e) =>
                          handleInputChange(player.id, "runs", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="text"
                        value={player.fours}
                        onChange={(e) =>
                          handleInputChange(player.id, "fours", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="text"
                        value={player.sixes}
                        onChange={(e) =>
                          handleInputChange(player.id, "sixes", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="text"
                        value={player.wickets}
                        onChange={(e) =>
                          handleInputChange(
                            player.id,
                            "wickets",
                            e.target.value
                          )
                        }
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="text"
                        value={player.maidenOvers}
                        onChange={(e) =>
                          handleInputChange(
                            player.id,
                            "maidenOvers",
                            e.target.value
                          )
                        }
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="text"
                        value={player.catches}
                        onChange={(e) =>
                          handleInputChange(
                            player.id,
                            "catches",
                            e.target.value
                          )
                        }
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="text"
                        value={player.stumpings}
                        onChange={(e) =>
                          handleInputChange(
                            player.id,
                            "stumpings",
                            e.target.value
                          )
                        }
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="text"
                        value={player.runouts}
                        onChange={(e) =>
                          handleInputChange(
                            player.id,
                            "runouts",
                            e.target.value
                          )
                        }
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => deletePlayer(player.id)}
                        sx={{ color: colors.error }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Team B Totals */}
                <TableRow sx={{ bgcolor: "#f0f8ff" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Team B Total</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {getTeamTotals("Team B").runs}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {getTeamTotals("Team B").fours}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {getTeamTotals("Team B").sixes}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {getTeamTotals("Team B").wickets}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {getTeamTotals("Team B").maidenOvers}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {getTeamTotals("Team B").catches}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {getTeamTotals("Team B").stumpings}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {getTeamTotals("Team B").runouts}
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>

      {/* Select Player Modal */}
      <SelectPlayerModal
        open={showPlayerModal}
        onClose={handleClosePlayerModal}
        onConfirm={handlePlayerSelection}
        title="Select Players for Match"
        teamA={teamA}
        teamB={teamB}
        maxSelections={11}
        teamAId={teamAId}
        teamBId={teamBId}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success">
          Player statistics saved successfully!
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={4000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setShowError(false)} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConfigureScorePage;
