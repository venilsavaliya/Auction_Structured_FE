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
import playerService from "../../../Services/PlayerService/PlayerServices";
import type { MatcheDetail } from "../../../Models/ResponseModels/MatcheDetailResponseModel";
import type { PlayerName } from "../../../Models/ResponseModels/PlayerNameListResponseModel";
import type { PlayerState } from "../../../Models/ResponseModels/PlayerStateResponseModel";
import { buttonStyle } from "../../../ComponentStyles";
import playerMatchStateService from "../../../Services/PlayerMatchStateService/PlayerMatchStateService";
import type { PlayerMatchState } from "../../../Models/ResponseModels/PlayerMatchStateResponseModel";

// Constant style for table headers
const tableHeaderStyle = { color: "white", fontWeight: 600 };

interface ConfigureScorePageProps {}

const ConfigureScorePage: React.FC<ConfigureScorePageProps> = () => {
  const [players, setPlayers] = useState<PlayerState[]>([]);
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

  // Modal state
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<{
    teamA: number[];
    teamB: number[];
  }>({ teamA: [], teamB: [] });

  // Initialize with dummy data
  useEffect(() => {
    // const dummyPlayers: PlayerState[] = [
    //   {
    //     id: "1",
    //     name: "Virat Kohli",
    //     team: "Team A",
    //     runs: 0,
    //     fours: 0,
    //     sixes: 0,
    //     wickets: 0,
    //     maidenOvers: 0,
    //     catches: 0,
    //     stumpings: 0,
    //     runouts: 0,
    //   },
    //   {
    //     id: "2",
    //     name: "Rohit Sharma",
    //     team: "Team A",
    //     runs: 0,
    //     fours: 0,
    //     sixes: 0,
    //     wickets: 0,
    //     maidenOvers: 0,
    //     catches: 0,
    //     stumpings: 0,
    //     runouts: 0,
    //   },
    //   {
    //     id: "3",
    //     name: "MS Dhoni",
    //     team: "Team A",
    //     runs: 0,
    //     fours: 0,
    //     sixes: 0,
    //     wickets: 0,
    //     maidenOvers: 0,
    //     catches: 0,
    //     stumpings: 0,
    //     runouts: 0,
    //   },
    //   {
    //     id: "4",
    //     name: "Jasprit Bumrah",
    //     team: "Team B",
    //     runs: 0,
    //     fours: 0,
    //     sixes: 0,
    //     wickets: 0,
    //     maidenOvers: 0,
    //     catches: 0,
    //     stumpings: 0,
    //     runouts: 0,
    //   },
    //   {
    //     id: "5",
    //     name: "Ravindra Jadeja",
    //     team: "Team B",
    //     runs: 0,
    //     fours: 0,
    //     sixes: 0,
    //     wickets: 0,
    //     maidenOvers: 0,
    //     catches: 0,
    //     stumpings: 0,
    //     runouts: 0,
    //   },
    //   {
    //     id: "6",
    //     name: "KL Rahul",
    //     team: "Team B",
    //     runs: 0,
    //     fours: 0,
    //     sixes: 0,
    //     wickets: 0,
    //     maidenOvers: 0,
    //     catches: 0,
    //     stumpings: 0,
    //     runouts: 0,
    //   },
    // ];

    setPlayers([]);
    fetchMatchData();
  }, [matchId]);

  // Fetch Team A Players Stats
  useEffect(() => {
    if (teamAId && matchId) {
      fetchTeamPlayersStats(teamAId, Number(matchId), "A");
    }
    if (teamBId && matchId) {
      fetchTeamPlayersStats(teamBId, Number(matchId), "B");
    }
  }, [teamAId, matchId,teamBId]);

  const fetchTeamPlayersStats = async (teamId: number, matchId: number, team: "A" | "B") => {
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

  // Fetch Team B Players Stats
  // useEffect(() => {
  //   if (teamBId && matchId) {
  //     playerMatchStateService
  //       .GetPlayerMatchState({
  //         teamId: teamBId,
  //         matchId: Number(matchId),
  //       })
  //       .then((response) => {
  //         if (response.isSuccess && response.data) {
  //           console.log("response team b", response);
  //           setTeamBPlayers(
  //             response.data.map((player) => ({
  //               ...player,
  //             }))
  //           );
  //           setTeamBSelectedPlayersList(
  //             response.data.map((player) => ({
  //               id: player.playerId,
  //               name: player.name,
  //             }))
  //           );
  //         }
  //       });
  //   }
  // }, [teamBId, matchId]);

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
    if (team === "A") {
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
  };

  const handleSave = async () => {
    try {
      // Validate data for both teams
      const allPlayers = [...teamAPlayers, ...teamBPlayers];

      await playerMatchStateService.UpdatePlayerMatchState(allPlayers);

      await fetchTeamPlayersStats(teamAId, Number(matchId), "A");
      await fetchTeamPlayersStats(teamBId, Number(matchId), "B");

      const hasNegativeValues = allPlayers.some(
        (player) =>
          player.runs < 0 ||
          player.fours < 0 ||
          player.sixes < 0 ||
          player.wickets < 0 ||
          player.maidenOvers < 0 ||
          player.catches < 0 ||
          player.stumpings < 0 ||
          player.runOuts < 0
      );

      if (hasNegativeValues) {
        setErrorMessage("All values must be non-negative numbers");
        setShowError(true);
        return;
      }

      // Collect all data for console logging
      const saveData = {
        matchId: matchId,
        matchData: matchData,
        teamA: {
          teamName: teamA,
          teamId: teamAId,
          players: teamAPlayers,
          selectedPlayers: teamASelectedPlayersList,
          totals: {
            runs: teamAPlayers.reduce((sum, player) => sum + player.runs, 0),
            fours: teamAPlayers.reduce((sum, player) => sum + player.fours, 0),
            sixes: teamAPlayers.reduce((sum, player) => sum + player.sixes, 0),
            wickets: teamAPlayers.reduce(
              (sum, player) => sum + player.wickets,
              0
            ),
            maidenOvers: teamAPlayers.reduce(
              (sum, player) => sum + player.maidenOvers,
              0
            ),
            catches: teamAPlayers.reduce(
              (sum, player) => sum + player.catches,
              0
            ),
            stumpings: teamAPlayers.reduce(
              (sum, player) => sum + player.stumpings,
              0
            ),
            runOuts: teamAPlayers.reduce(
              (sum, player) => sum + player.runOuts,
              0
            ),
          },
        },
        teamB: {
          teamName: teamB,
          teamId: teamBId,
          players: teamBPlayers,
          selectedPlayers: teamBSelectedPlayersList,
          totals: {
            runs: teamBPlayers.reduce((sum, player) => sum + player.runs, 0),
            fours: teamBPlayers.reduce((sum, player) => sum + player.fours, 0),
            sixes: teamBPlayers.reduce((sum, player) => sum + player.sixes, 0),
            wickets: teamBPlayers.reduce(
              (sum, player) => sum + player.wickets,
              0
            ),
            maidenOvers: teamBPlayers.reduce(
              (sum, player) => sum + player.maidenOvers,
              0
            ),
            catches: teamBPlayers.reduce(
              (sum, player) => sum + player.catches,
              0
            ),
            stumpings: teamBPlayers.reduce(
              (sum, player) => sum + player.stumpings,
              0
            ),
            runOuts: teamBPlayers.reduce(
              (sum, player) => sum + player.runOuts,
              0
            ),
          },
        },
        selectedPlayerIds: selectedPlayerIds,
        allPlayers: allPlayers,
        overallTotals: {
          runs: allPlayers.reduce((sum, player) => sum + player.runs, 0),
          fours: allPlayers.reduce((sum, player) => sum + player.fours, 0),
          sixes: allPlayers.reduce((sum, player) => sum + player.sixes, 0),
          wickets: allPlayers.reduce((sum, player) => sum + player.wickets, 0),
          maidenOvers: allPlayers.reduce(
            (sum, player) => sum + player.maidenOvers,
            0
          ),
          catches: allPlayers.reduce((sum, player) => sum + player.catches, 0),
          stumpings: allPlayers.reduce(
            (sum, player) => sum + player.stumpings,
            0
          ),
          runOuts: allPlayers.reduce((sum, player) => sum + player.runOuts, 0),
        },
      };

      // Console log all the collected data
      console.log("=== SAVE DATA TRIGGERED ===");
      console.log("Complete Save Data:", saveData);
      console.log("Match ID:", matchId);
      console.log("Match Data:", matchData);
      console.log("Team A Data:", saveData.teamA);
      console.log("Team B Data:", saveData.teamB);
      console.log("Selected Player IDs:", selectedPlayerIds);
      console.log("All Players:", allPlayers);
      console.log("Overall Totals:", saveData.overallTotals);
      console.log("=== END SAVE DATA ===");

      setShowSuccess(true);
    } catch (error) {
      console.error("Error in handleSave:", error);
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
    const newPlayer: PlayerState = {
      id: Date.now(),
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

  const deletePlayer = (playerId: number, team: "A" | "B") => {
    if (team === "A") {
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
    // setSelectedPlayerIds(selected);
    // console.log(
    //   "Selected players:",
    //   selected.teamA,
    //   selected.teamB,
    //   selected.teamA.length + selected.teamB.length
    // );

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
            {/* <Typography variant="h5" fontWeight={600} color={colors.primary}>
              {teamA} vs {teamB}
            </Typography> */}
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                startIcon={<PeopleIcon />}
                onClick={handleOpenPlayerModal}
                sx={{ borderColor: colors.secondary, color: colors.secondary }}
              >
                Select Players ({teamAPlayers.length + teamBPlayers.length})
              </Button>
              {/* <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addPlayer}
                sx={{ borderColor: colors.primary, color: colors.primary }}
              >
                Add Player
              </Button> */}
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
                <TableBody>
                  {teamAPlayers.map((player) => (
                    <TableRow key={player.playerId} hover>
                      <TableCell>
                        <TextField
                          value={player.name}
                          onChange={(e) =>
                            handleInputChange(
                              player.playerId,
                              "name",
                              e.target.value,
                              "A"
                            )
                          }
                          variant="standard"
                          size="small"
                          fullWidth
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
                        <IconButton
                          size="small"
                          onClick={() => deletePlayer(player.playerId, "A")}
                          sx={{ color: colors.activeBg }}
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
                  <TableRow sx={{ bgcolor: colors.activeBg }}>
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
                <TableBody>
                  {teamBPlayers.map((player) => (
                    <TableRow key={player.playerId} hover>
                      <TableCell>
                        <TextField
                          value={player.name}
                          onChange={(e) =>
                            handleInputChange(
                              player.playerId,
                              "name",
                              e.target.value,
                              "B"
                            )
                          }
                          variant="standard"
                          size="small"
                          fullWidth
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
                        <IconButton
                          size="small"
                          onClick={() => deletePlayer(player.playerId, "B")}
                          sx={{ color: colors.activeBg }}
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
