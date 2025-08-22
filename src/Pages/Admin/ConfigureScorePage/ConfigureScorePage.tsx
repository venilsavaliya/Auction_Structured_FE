import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Tooltip,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import PageTitle from "../../../components/PageTitle/PageTitle";
import colors from "../../../Colors";
import SelectPlayerModal from "../../../components/SelectPlayerModal/SelectPlayerModal";
import { useParams } from "react-router-dom";
import matchService from "../../../Services/MatcheService/MatchService";
import playerService from "../../../Services/PlayerService/PlayerServices";
import type { MatcheDetail } from "../../../Models/ResponseModels/MatcheDetailResponseModel";
import type { PlayerName } from "../../../Models/ResponseModels/PlayerNameListResponseModel";
import type { PlayerState } from "../../../Models/ResponseModels/PlayerStateResponseModel";
import { buttonStyle } from "../../../ComponentStyles";
import playerMatchStateService from "../../../Services/PlayerMatchStateService/PlayerMatchStateService";
import type { PlayerMatchState } from "../../../Models/ResponseModels/PlayerMatchStateResponseModel";
import { toast } from "react-toastify";
import TableSkeleton from "../../../components/TableSkeleton/TableSkeleton";
import NoDataRow from "../../../components/NoDataRow/NoDataRow";

// Constant style for table headers
const tableHeaderStyle = { color: "white", fontWeight: 600 };

interface ConfigureScorePageProps {}

const ConfigureScorePage: React.FC<ConfigureScorePageProps> = () => {
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [teamAPlayers, setTeamAPlayers] = useState<PlayerMatchState[]>([]);
  const [teamBPlayers, setTeamBPlayers] = useState<PlayerMatchState[]>([]);
  const [teamA, setTeamA] = useState<string>("");
  const [teamB, setTeamB] = useState<string>("");
  const [teamAId, setTeamAId] = useState<number>(0);
  const [teamBId, setTeamBId] = useState<number>(0);
  const { matchId } = useParams<string>();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [matchData, setMatchData] = useState<MatcheDetail | null>(null);
  const [teamAPlayersList, setTeamAPlayersList] = useState<PlayerName[]>([]);
  const [teamBPlayersList, setTeamBPlayersList] = useState<PlayerName[]>([]);
  const [teamASelectedPlayersList, setTeamASelectedPlayersList] = useState<
    PlayerName[]
  >([]);
  const [teamBSelectedPlayersList, setTeamBSelectedPlayersList] = useState<
    PlayerName[]
  >([]);

  // Handler to reorder array
  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    var result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    result = result.map((player, index) => ({
      ...player,
      orderNumber: index + 1,
    }));

    return result;
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = reorder(
      teamAPlayers,
      result.source.index,
      result.destination.index
    );

    setTeamAPlayers(items);
    setTeamAPlayers(() => {
      const players = items;
      return players;
    });

    // handleSave(true); // true tells that save order change
  };
  const handleDragEndForTeamB = (result: DropResult) => {
    if (!result.destination) return;

    const items = reorder(
      teamBPlayers,
      result.source.index,
      result.destination.index
    );

    setTeamBPlayers(items);

    // 👉 Call API here to save order in DB
    // updatePlayerOrderInDb(items.map((p, index) => ({ id: p.playerId, order: index + 1 })));
  };

  // Modal state
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<{
    teamA: number[];
    teamB: number[];
  }>({ teamA: [], teamB: [] });

  // Initialize with dummy data
  useEffect(() => {
    setPlayers([]);
    fetchMatchData();
  }, [matchId]);

  // Fetch Team A Players Stats
  useEffect(() => {
    const loadData = async () => {
      setLoading(true); // start loading

      try {
        if (teamAId && matchId) {
          await fetchTeamPlayersStats(teamAId, Number(matchId), "A");
        }
        if (teamBId && matchId) {
          await fetchTeamPlayersStats(teamBId, Number(matchId), "B");
        }
      } catch (error) {
        console.error("Error loading players:", error);
      } finally {
        setLoading(false); // stop loading no matter success or error
      }
    };

    if (matchId && (teamAId || teamBId)) {
      loadData();
    }
  }, [teamAId, matchId, teamBId]);

  const fetchTeamPlayersStats = async (
    teamId: number,
    matchId: number,
    team: "A" | "B"
  ) => {
    const response = await playerMatchStateService.GetPlayerMatchState({
      teamId: teamId,
      matchId: matchId,
    });

    if (response.isSuccess && response.data) {
      if (team === "A") {
        setTeamAPlayers(
          response.data.map((player) => ({
            ...player,
          }))
        );
        setTeamASelectedPlayersList(
          response.data.map((player) => ({
            id: player.playerId,
            name: player.name,
          }))
        );
      } else {
        setTeamBPlayers(
          response.data.map((player) => ({
            ...player,
          }))
        );
        setTeamBSelectedPlayersList(
          response.data.map((player) => ({
            id: player.playerId,
            name: player.name,
          }))
        );
      }
    }
    return response;
  };

  useEffect(() => {
    if (teamAId) {
      fetchPlayersByTeamId(teamAId).then((players) => {
        if (players) {
          setTeamAPlayersList(players);
        }
      });
    }
    if (teamBId) {
      fetchPlayersByTeamId(teamBId).then((players) => {
        if (players) {
          setTeamBPlayersList(players);
        }
      });
    }
  }, [teamAId, teamBId]);

  const fetchMatchData = async () => {
    const response = await matchService.GetMatchById(Number(matchId));
    if (response.isSuccess && response.data) {
      setTeamA(response.data.teamAName);
      setTeamB(response.data.teamBName);
      setTeamAId(response.data.teamAId);
      setTeamBId(response.data.teamBId);
      setMatchData(response.data);
    }
  };

  const fetchPlayersByTeamId = async (teamId: number) => {
    const response = await playerService.GetPlayersByTeamId(teamId);
    if (response.isSuccess && response.data) {
      return response.data;
    }
  };

  const handleInputChange = (
    playerId: number,
    field: keyof PlayerMatchState,
    value: string,
    team: "A" | "B"
  ) => {
    const numValue = parseInt(value) || 0;
    console.log("triggred", numValue, field, playerId, team);

    if (team == "A") {
      setTeamAPlayers((prev) =>
        prev.map((player) =>
          player.playerId === playerId
            ? { ...player, [field]: numValue }
            : player
        )
      );
    } else {
      setTeamBPlayers((prev) =>
        prev.map((player) =>
          player.playerId === playerId
            ? { ...player, [field]: numValue }
            : player
        )
      );
    }

    // Real-time validation for runs, fours, and sixes
    if (field === "runs" || field === "fours" || field === "sixes") {
      const currentPlayer =
        team === "A"
          ? teamAPlayers.find((p) => p.playerId === playerId)
          : teamBPlayers.find((p) => p.playerId === playerId);

      if (currentPlayer) {
        const updatedPlayer = { ...currentPlayer, [field]: numValue };
        const totalRuns = updatedPlayer.runs;
        const foursCount = updatedPlayer.fours;
        const sixesCount = updatedPlayer.sixes;

        // Calculate runs from boundaries
        const runsFromBoundaries = foursCount * 4 + sixesCount * 6;

        // Show warning if runs from boundaries exceed total runs
        if (runsFromBoundaries > totalRuns) {
          toast.warning(
            `${updatedPlayer.name}: Runs from boundaries (${runsFromBoundaries}) exceed total runs (${totalRuns})`,
            {
              style: {
                fontSize: "13px",
              },
            }
          );
        }
      }
    }
  };

  const validatePlayerStats = (
    players: PlayerMatchState[]
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    const teamATotalWickets = teamAPlayers.reduce(
      (acc, player) => acc + player.wickets,
      0
    );
    const teamBTotalWickets = teamBPlayers.reduce(
      (acc, player) => acc + player.wickets,
      0
    );

    if (teamATotalWickets > 10 || teamBTotalWickets > 10) {
      if (teamATotalWickets > 10) {
        errors.push(`${teamA}: Total wickets taken cannot be greater than 10`);
      }
      if (teamBTotalWickets > 10) {
        errors.push(`${teamB}: Total wickets taken cannot be greater than 10`);
      }
    }

    players.forEach((player) => {
      const totalRuns = player.runs;
      const foursCount = player.fours;
      const sixesCount = player.sixes;

      // Calculate runs from boundaries
      const runsFromBoundaries = foursCount * 4 + sixesCount * 6;

      // Check if runs from boundaries exceed total runs
      if (runsFromBoundaries > totalRuns) {
        errors.push(
          `${player.name}: Runs from boundaries (${runsFromBoundaries}) exceed total runs (${totalRuns})`
        );
      }

      // Check if there are negative values
      if (totalRuns < 0 || foursCount < 0 || sixesCount < 0) {
        errors.push(`${player.name}: Cannot have negative values`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const handleSave = async () => {
    try {
      // Validate data for both teams
      const allPlayers = [...teamAPlayers, ...teamBPlayers];

      // Validate player statistics
      const validation = validatePlayerStats(allPlayers);

      if (!validation.isValid) {
        validation.errors.forEach((error) => {
          toast.error(error, {
            style: {
              fontSize: "13px",
            },
          });
        });
        return;
      }

      await playerMatchStateService.UpdatePlayerMatchState(allPlayers);

      await fetchTeamPlayersStats(teamAId, Number(matchId), "A");
      await fetchTeamPlayersStats(teamBId, Number(matchId), "B");

      toast.success("Data saved successfully");
    } catch (error) {
      console.error("Error in handleSave:", error);
      toast.error("Failed to save data");
    }
  };

  const handleReset = async () => {
    await fetchTeamPlayersStats(teamAId, Number(matchId), "A");
    await fetchTeamPlayersStats(teamBId, Number(matchId), "B");
    toast.success("Data reset successfully");
  };

  const deletePlayer = (playerId: number, team: "A" | "B") => {
    if (team == "A") {
      setTeamAPlayers((prev) =>
        prev.filter((player) => player.playerId !== playerId)
      );
      setTeamASelectedPlayersList((prev) =>
        prev.filter((player) => player.id !== playerId)
      );
    } else {
      setTeamBPlayers((prev) =>
        prev.filter((player) => player.playerId !== playerId)
      );
      setTeamBSelectedPlayersList((prev) =>
        prev.filter((player) => player.id !== playerId)
      );
    }
  };

  const handleOpenPlayerModal = () => {
    setShowPlayerModal(true);
  };

  const handleClosePlayerModal = () => {
    setShowPlayerModal(false);
  };

  const handlePlayerSelection = (selected: {
    teamA: number[];
    teamB: number[];
  }) => {
    console.log("selected", selected);
    setTeamASelectedPlayersList(
      selected.teamA
        .map((id) => teamAPlayersList.find((p) => p.id === id))
        .filter((p): p is PlayerName => p !== undefined)
    );
    setTeamBSelectedPlayersList(
      selected.teamB
        .map((id) => teamBPlayersList.find((p) => p.id === id))
        .filter((p): p is PlayerName => p !== undefined)
    );

    const filteredTeamAPlayers = teamAPlayers.filter((p) =>
      selected.teamA.includes(p.playerId)
    );
    const filteredTeamBPlayers = teamBPlayers.filter((p) =>
      selected.teamB.includes(p.playerId)
    );

    // Add new players to the list
    const newTeamAPlayersdata = selected.teamA
      .map((id) => teamAPlayersList.find((p) => p.id === id))
      .filter((p): p is PlayerName => p !== undefined)
      .filter(
        (p) => !filteredTeamAPlayers.map((p) => p.playerId).includes(p.id)
      );

    const newTeamBPlayersdata = selected.teamB
      .map((id) => teamBPlayersList.find((p) => p.id === id))
      .filter((p): p is PlayerName => p !== undefined)
      .filter(
        (p) => !filteredTeamBPlayers.map((p) => p.playerId).includes(p.id)
      );

    const newTeamAPlayers = newTeamAPlayersdata.map((player) => {
      return {
        id: 0,
        playerId: player.id,
        name: player.name,
        matchId: Number(matchId),
        teamId: teamAId,
        runs: 0,
        fours: 0,
        sixes: 0,
        wickets: 0,
        maidenOvers: 0,
        catches: 0,
        stumpings: 0,
        runOuts: 0,
        orderNumber: 0,
      };
    });
    const newTeamBPlayers = newTeamBPlayersdata.map((player) => {
      return {
        id: 0,
        playerId: player.id,
        name: player.name,
        matchId: Number(matchId),
        teamId: teamBId,
        runs: 0,
        fours: 0,
        sixes: 0,
        wickets: 0,
        maidenOvers: 0,
        catches: 0,
        stumpings: 0,
        runOuts: 0,
        orderNumber: 0,
      };
    });
    setTeamAPlayers([...filteredTeamAPlayers, ...newTeamAPlayers]);
    setTeamBPlayers([...filteredTeamBPlayers, ...newTeamBPlayers]);
  };

  return (
    <>
      <PageTitle title="Configure Player Statistics" />
      <Box sx={{ p: 3, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
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
            justifyContent="flex-end"
            alignItems="center"
            mb={3}
          >
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                startIcon={<PeopleIcon />}
                onClick={handleOpenPlayerModal}
                sx={{ borderColor: colors.secondary, color: colors.secondary }}
              >
                Select Players ({teamAPlayers.length + teamBPlayers.length})
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
                sx={buttonStyle}
              >
                Save Data
              </Button>
            </Box>
          </Box>

          {/* Team Names */}

          {/* Selected Players Summary */}
          {selectedPlayerIds.teamA.length + selectedPlayerIds.teamB.length >
            0 && (
            <Box
              mb={3}
              p={2}
              bgcolor="#f8f9fa"
              borderRadius={2}
              border="1px solid #e0e0e0"
            >
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Selected Players (
                {selectedPlayerIds.teamA.length +
                  selectedPlayerIds.teamB.length}
                )
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {teamASelectedPlayersList.map((player) => {
                  return (
                    <Chip
                      key={player.id}
                      label={player?.name}
                      size="small"
                      sx={{
                        bgcolor: colors.primary,
                        color: "white",
                        fontSize: 11,
                      }}
                    />
                  );
                })}
                {teamBSelectedPlayersList.map((player) => {
                  return (
                    <Chip
                      key={player.id}
                      label={player?.name}
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
                  <TableRow sx={{ bgcolor: colors.activeBg }}>
                    <TableCell sx={tableHeaderStyle}>Order</TableCell>
                    <TableCell sx={tableHeaderStyle}>Player</TableCell>
                    <TableCell sx={tableHeaderStyle} align="center">
                      Runs
                    </TableCell>
                    <TableCell sx={tableHeaderStyle} align="center">
                      4s
                    </TableCell>
                    <TableCell sx={tableHeaderStyle} align="center">
                      6s
                    </TableCell>
                    <TableCell sx={tableHeaderStyle} align="center">
                      Wickets
                    </TableCell>
                    <TableCell sx={tableHeaderStyle} align="center">
                      Maiden Overs
                    </TableCell>
                    <TableCell sx={tableHeaderStyle} align="center">
                      Catches
                    </TableCell>
                    <TableCell sx={tableHeaderStyle} align="center">
                      Stumpings
                    </TableCell>
                    <TableCell sx={tableHeaderStyle} align="center">
                      Runouts
                    </TableCell>
                    <TableCell sx={tableHeaderStyle} align="center">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                {loading == true ? (
                  <TableSkeleton />
                ) : teamAPlayers.length == 0 ? (
                  <NoDataRow colSpan={11} />
                ) : (
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="teamAPlayers">
                      {(provided) => (
                        <TableBody
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {teamAPlayers.map((player, index) => (
                            <Draggable
                              key={player.playerId}
                              draggableId={player.playerId.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <TableRow
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  hover
                                  sx={{
                                    backgroundColor: snapshot.isDragging
                                      ? "#f0f0f0"
                                      : "inherit",
                                  }}
                                >
                                  <TableCell align="center">
                                    {index + 1}
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      value={player.name}
                                      variant="standard"
                                      size="small"
                                      fullWidth
                                      InputProps={{
                                        disableUnderline: true,
                                      }}
                                      sx={{
                                        "& .MuiInputBase-input": {
                                          fontSize: "14px",
                                          padding: "2px 0",
                                        },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <TextField
                                      type="text"
                                      value={player.runs}
                                      onChange={(e) =>
                                        handleInputChange(
                                          player.playerId,
                                          "runs",
                                          e.target.value,
                                          "A"
                                        )
                                      }
                                      variant="outlined"
                                      size="small"
                                      inputProps={{
                                        min: 0,
                                        style: { textAlign: "center" },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <TextField
                                      type="text"
                                      value={player.fours}
                                      onChange={(e) =>
                                        handleInputChange(
                                          player.playerId,
                                          "fours",
                                          e.target.value,
                                          "A"
                                        )
                                      }
                                      variant="outlined"
                                      size="small"
                                      inputProps={{
                                        min: 0,
                                        style: { textAlign: "center" },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <TextField
                                      type="text"
                                      value={player.sixes}
                                      onChange={(e) =>
                                        handleInputChange(
                                          player.playerId,
                                          "sixes",
                                          e.target.value,
                                          "A"
                                        )
                                      }
                                      variant="outlined"
                                      size="small"
                                      inputProps={{
                                        min: 0,
                                        style: { textAlign: "center" },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <TextField
                                      type="text"
                                      value={player.wickets}
                                      onChange={(e) =>
                                        handleInputChange(
                                          player.playerId,
                                          "wickets",
                                          e.target.value,
                                          "A"
                                        )
                                      }
                                      variant="outlined"
                                      size="small"
                                      inputProps={{
                                        min: 0,
                                        style: { textAlign: "center" },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <TextField
                                      type="text"
                                      value={player.maidenOvers}
                                      onChange={(e) =>
                                        handleInputChange(
                                          player.playerId,
                                          "maidenOvers",
                                          e.target.value,
                                          "A"
                                        )
                                      }
                                      variant="outlined"
                                      size="small"
                                      inputProps={{
                                        min: 0,
                                        style: { textAlign: "center" },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <TextField
                                      type="text"
                                      value={player.catches}
                                      onChange={(e) =>
                                        handleInputChange(
                                          player.playerId,
                                          "catches",
                                          e.target.value,
                                          "A"
                                        )
                                      }
                                      variant="outlined"
                                      size="small"
                                      inputProps={{
                                        min: 0,
                                        style: { textAlign: "center" },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <TextField
                                      type="text"
                                      value={player.stumpings}
                                      onChange={(e) =>
                                        handleInputChange(
                                          player.playerId,
                                          "stumpings",
                                          e.target.value,
                                          "A"
                                        )
                                      }
                                      variant="outlined"
                                      size="small"
                                      inputProps={{
                                        min: 0,
                                        style: { textAlign: "center" },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <TextField
                                      type="text"
                                      value={player.runOuts}
                                      onChange={(e) =>
                                        handleInputChange(
                                          player.playerId,
                                          "runOuts",
                                          e.target.value,
                                          "A"
                                        )
                                      }
                                      variant="outlined"
                                      size="small"
                                      inputProps={{
                                        min: 0,
                                        style: { textAlign: "center" },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <Box display={"flex"} gap={1}>
                                      <Tooltip title="Delete Player" arrow>
                                        <IconButton
                                          size="small"
                                          onClick={() =>
                                            deletePlayer(player.playerId, "A")
                                          }
                                          sx={{ color: colors.activeBg }}
                                        >
                                          <DeleteIcon />
                                        </IconButton>
                                      </Tooltip>

                                      <Tooltip title="Drag to Reorder" arrow>
                                        <IconButton
                                          size="small"
                                          {...provided.dragHandleProps}
                                        >
                                          <DragIndicatorIcon />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </TableBody>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
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
                  <TableRow sx={{ bgcolor: colors.activeBg }}>
                    <TableCell sx={tableHeaderStyle}>Order</TableCell>
                    <TableCell sx={tableHeaderStyle}>Player</TableCell>
                    <TableCell sx={tableHeaderStyle} align="center">
                      Runs
                    </TableCell>
                    <TableCell sx={tableHeaderStyle} align="center">
                      4s
                    </TableCell>
                    <TableCell sx={tableHeaderStyle} align="center">
                      6s
                    </TableCell>
                    <TableCell sx={tableHeaderStyle} align="center">
                      Wickets
                    </TableCell>
                    <TableCell sx={tableHeaderStyle} align="center">
                      Maiden Overs
                    </TableCell>
                    <TableCell sx={tableHeaderStyle} align="center">
                      Catches
                    </TableCell>
                    <TableCell sx={tableHeaderStyle} align="center">
                      Stumpings
                    </TableCell>
                    <TableCell sx={tableHeaderStyle} align="center">
                      Runouts
                    </TableCell>
                    <TableCell sx={tableHeaderStyle} align="center">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                {loading == true ? (
                  <TableSkeleton />
                ) : teamBPlayers.length == 0 ? (
                  <NoDataRow colSpan={11} />
                ) : (
                  <DragDropContext onDragEnd={handleDragEndForTeamB}>
                    <Droppable droppableId="teamAPlayers">
                      {(provided) => (
                        <TableBody
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {teamBPlayers.map((player, index) => (
                            <Draggable
                              key={player.playerId}
                              draggableId={player.playerId.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <TableRow
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  hover
                                  sx={{
                                    backgroundColor: snapshot.isDragging
                                      ? "#f0f0f0"
                                      : "inherit",
                                  }}
                                >
                                  <TableCell align="center">
                                    {index + 1}
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      value={player.name}
                                      variant="standard"
                                      size="small"
                                      fullWidth
                                      InputProps={{
                                        disableUnderline: true,
                                      }}
                                      sx={{
                                        "& .MuiInputBase-input": {
                                          fontSize: "14px",
                                          padding: "2px 0",
                                        },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <TextField
                                      type="text"
                                      value={player.runs}
                                      onChange={(e) =>
                                        handleInputChange(
                                          player.playerId,
                                          "runs",
                                          e.target.value,
                                          "B"
                                        )
                                      }
                                      variant="outlined"
                                      size="small"
                                      inputProps={{
                                        min: 0,
                                        style: { textAlign: "center" },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <TextField
                                      type="text"
                                      value={player.fours}
                                      onChange={(e) =>
                                        handleInputChange(
                                          player.playerId,
                                          "fours",
                                          e.target.value,
                                          "B"
                                        )
                                      }
                                      variant="outlined"
                                      size="small"
                                      inputProps={{
                                        min: 0,
                                        style: { textAlign: "center" },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <TextField
                                      type="text"
                                      value={player.sixes}
                                      onChange={(e) =>
                                        handleInputChange(
                                          player.playerId,
                                          "sixes",
                                          e.target.value,
                                          "B"
                                        )
                                      }
                                      variant="outlined"
                                      size="small"
                                      inputProps={{
                                        min: 0,
                                        style: { textAlign: "center" },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <TextField
                                      type="text"
                                      value={player.wickets}
                                      onChange={(e) =>
                                        handleInputChange(
                                          player.playerId,
                                          "wickets",
                                          e.target.value,
                                          "B"
                                        )
                                      }
                                      variant="outlined"
                                      size="small"
                                      inputProps={{
                                        min: 0,
                                        style: { textAlign: "center" },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <TextField
                                      type="text"
                                      value={player.maidenOvers}
                                      onChange={(e) =>
                                        handleInputChange(
                                          player.playerId,
                                          "maidenOvers",
                                          e.target.value,
                                          "B"
                                        )
                                      }
                                      variant="outlined"
                                      size="small"
                                      inputProps={{
                                        min: 0,
                                        style: { textAlign: "center" },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <TextField
                                      type="text"
                                      value={player.catches}
                                      onChange={(e) =>
                                        handleInputChange(
                                          player.playerId,
                                          "catches",
                                          e.target.value,
                                          "B"
                                        )
                                      }
                                      variant="outlined"
                                      size="small"
                                      inputProps={{
                                        min: 0,
                                        style: { textAlign: "center" },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <TextField
                                      type="text"
                                      value={player.stumpings}
                                      onChange={(e) =>
                                        handleInputChange(
                                          player.playerId,
                                          "stumpings",
                                          e.target.value,
                                          "B"
                                        )
                                      }
                                      variant="outlined"
                                      size="small"
                                      inputProps={{
                                        min: 0,
                                        style: { textAlign: "center" },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <TextField
                                      type="text"
                                      value={player.runOuts}
                                      onChange={(e) =>
                                        handleInputChange(
                                          player.playerId,
                                          "runOuts",
                                          e.target.value,
                                          "B"
                                        )
                                      }
                                      variant="outlined"
                                      size="small"
                                      inputProps={{
                                        min: 0,
                                        style: { textAlign: "center" },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <Box display={"flex"} gap={1}>
                                      <Tooltip title="Delete Player" arrow>
                                        <IconButton
                                          size="small"
                                          onClick={() =>
                                            deletePlayer(player.playerId, "A")
                                          }
                                          sx={{ color: colors.activeBg }}
                                        >
                                          <DeleteIcon />
                                        </IconButton>
                                      </Tooltip>

                                      <Tooltip title="Drag to Reorder" arrow>
                                        <IconButton
                                          size="small"
                                          {...provided.dragHandleProps}
                                        >
                                          <DragIndicatorIcon />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </TableBody>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
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
          teamASelectedPlayers={teamASelectedPlayersList}
          teamBSelectedPlayers={teamBSelectedPlayersList}
          setTeamASelectedPlayers={setTeamASelectedPlayersList}
          setTeamBSelectedPlayers={setTeamBSelectedPlayersList}
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
    </>
  );
};

export default ConfigureScorePage;
