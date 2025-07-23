import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import PageTitle from "../../../components/PageTitle/PageTitle";
import { useParams } from "react-router-dom";
import matchService from "../../../Services/MatcheService/MatchService";
import type { MatcheDetail } from "../../../Models/ResponseModels/MatcheDetailResponseModel";
import { getSecondsUntilStart } from "../../../Utility/Utility";
import CountdownTimer from "../../../components/CountDownTimer/CountDownTimer";
import SportsBaseballIcon from "@mui/icons-material/SportsBaseball";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { buttonStyle } from "../../../ComponentStyles";
import colors from "../../../Colors";
import SaveIcon from "@mui/icons-material/Save";
import ReplayIcon from "@mui/icons-material/Replay";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { useSelector } from "react-redux";
import type { RootState } from "../../../Redux/Store";
import type { Player } from "../../../Models/ResponseModels/PlayerDetailResponseModel";
import playerService from "../../../Services/PlayerService/PlayerServices";
import type { PlayerName } from "../../../Models/ResponseModels/PlayerNameListResponseModel";
import type { SelectChangeEvent } from "@mui/material";
import { toast } from "react-toastify";
import styles from "./scorecard.module.scss";

const ScoreCardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [matchData, setMatchData] = useState<MatcheDetail | null>(null);
  const [extraType, setExtraType] = useState<string>("");
  const [extraRun, setExtraRun] = useState<number>(0);
  const [isWicket, setIsWicket] = useState<boolean>(false);
  const [players, setPlayers] = useState<PlayerName[]>([]);
  const [batsman, setBatsman] = useState<string>("");
  const [nonStriker, setNonStriker] = useState<string>("");
  const [bowler, setBowler] = useState<string>("");
  const [wicketBatsman, setWicketBatsman] = useState<string>("");
  const [wicketNonStriker, setWicketNonStriker] = useState<string>("");
  const [wicketBowler, setWicketBowler] = useState<string>("");
  const [quickRun, setQuickRun] = useState<number | null>(null);

  const extraTypes: string[] = ["Wide", "NoBall", "Byes", "LegBye","None"];

  const handleWicketChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsWicket(event.target.checked);
  };

  const handleExtraTypeChange = (event: SelectChangeEvent) => {
    setExtraType(event.target.value as string);
  };
  const handleExtraRunChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setExtraRun(isNaN(value) ? 0 : value);
  };

  const handleQuickRunSelect = (run: number) => {
    setQuickRun((prev) => (prev === run ? null : run));
  };

  const handleBatsmanChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    if (value === nonStriker || value === bowler) {
      toast.warn("Batsman, Non Striker, and Bowler must be different players.");
      return;
    }
    setBatsman(value);
  };
  const handleNonStrikerChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    if (value === batsman || value === bowler) {
      toast.warn("Batsman, Non Striker, and Bowler must be different players.");
      return;
    }
    setNonStriker(value);
  };
  const handleBowlerChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    if (value === batsman || value === nonStriker) {
      toast.warn("Batsman, Non Striker, and Bowler must be different players.");
      return;
    }
    setBowler(value);
  };
  const handleWicketBatsmanChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    if (value === wicketNonStriker || value === wicketBowler) {
      toast.warn(
        "Wicket Batsman, Non Striker, and Bowler must be different players."
      );
      return;
    }
    setWicketBatsman(value);
  };
  const handleWicketNonStrikerChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    if (value === wicketBatsman || value === wicketBowler) {
      toast.warn(
        "Wicket Batsman, Non Striker, and Bowler must be different players."
      );
      return;
    }
    setWicketNonStriker(value);
  };
  const handleWicketBowlerChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    if (value === wicketBatsman || value === wicketNonStriker) {
      toast.warn(
        "Wicket Batsman, Non Striker, and Bowler must be different players."
      );
      return;
    }
    setWicketBowler(value);
  };

  const selectMenuProps = {
    PaperProps: {
      style: {
        maxHeight: 200,
      },
    },
    anchorOrigin: {
      vertical: "bottom" as const,
      horizontal: "left" as const,
    },
    transformOrigin: {
      vertical: "top" as const,
      horizontal: "left" as const,
    },
  };

  // Fetch Players
  const fetchPlayers = async () => {
    const res = await playerService.GetPlayersNameList();
    console.log("players", res);
    if (res.isSuccess && res.data) {
      setPlayers(res.data);
    }
  };

  // Fetch match details
  const fetchMatchDetailById = async () => {
    if (!id) return;
    try {
      const res = await matchService.GetMatchById(Number(id));
      if (res.isSuccess && res.data) {
        setMatchData(res.data);
      }
    } catch (error) {
      setMatchData(null);
    }
  };

  useEffect(() => {
    fetchMatchDetailById();
    fetchPlayers();
  }, [id]);

  if (matchData) {
    const duration = getSecondsUntilStart(matchData.startDate);
    if (duration > 0) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
          gap={2}
        >
          <Typography variant="h4">Match Will Starts In </Typography>
          <CountdownTimer duration={duration} />
        </Box>
      );
    }
  }

  return (
    <>
      <PageTitle title={"Score Dashboard"} />
      <Container sx={{ minWidth: "1400px" }}>
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <Paper elevation={8} sx={{ borderRadius: 2 }}>
            <Box
              width="100%"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              alignItems="center"
              gap={2}
              p={2}
            >
              <Box>
                <Typography fontSize={18} fontWeight={600}>
                  {matchData
                    ? `${matchData.teamAName} Vs ${matchData.teamBName}`
                    : "Match"}
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="space-evenly"
                width="100%"
                alignItems="center"
              >
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Typography fontSize={16}>Inning</Typography>
                  <Typography fontSize={30} fontWeight={600}>
                    1
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Typography fontSize={16}>Over</Typography>
                  <Typography fontSize={30} fontWeight={600}>
                    5.3
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Typography fontSize={16}>Score</Typography>
                  <Typography fontSize={30} fontWeight={600}>
                    42/1
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Typography fontSize={16}>Batting</Typography>
                  <Typography fontSize={18} fontWeight={600}>
                    {matchData ? matchData.teamBName : "Batting Team"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
          <Box display="flex" gap={2}>
            <Paper elevation={8} sx={{ borderRadius: 2, flex: 2 }}>
              <Box
                width="100%"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                alignItems="flex-start"
                gap={2}
                p={2}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-start"
                  gap={1}
                  alignSelf="flex-start"
                >
                  <SportsBaseballIcon />
                  <Typography fontSize={23}>Ball Entry -</Typography>
                  <Typography fontSize={23}>Over 5.3</Typography>
                </Box>

                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start"
                  width="100%"
                  gap={1}
                >
                  <Typography>Quick Runs</Typography>

                  <Box display="flex" gap={1} width="100%">
                    {[0, 1, 2, 3, 4, 6].map((run) => (
                      <Button
                        key={run}
                        sx={{
                          ...buttonStyle,
                          flex: 1,
                          py: 1,
                          fontSize: 18,
                        }}
                        className={quickRun === run ? styles.active : ""}
                        onClick={() => handleQuickRunSelect(run)}
                      >
                        {run}
                      </Button>
                    ))}
                  </Box>
                </Box>

                <Divider sx={{ color: "gray", width: "100%" }} />

                <Box
                  display="flex"
                  justifyContent="space-between"
                  width="100%"
                  gap={1}
                >
                  {["Batsman", "Non Striker", "Bowler"].map((role) => (
                    <Box
                      key={role}
                      sx={{ flex: 1 }}
                      display="flex"
                      flexDirection="column"
                      gap={0.5}
                    >
                      <Typography fontWeight={600} fontSize={14}>
                        {role}
                      </Typography>
                      <FormControl fullWidth>
                        <InputLabel size="small">{role}</InputLabel>
                        <Select
                          value={
                            role === "Batsman"
                              ? batsman
                              : role === "Non Striker"
                              ? nonStriker
                              : bowler
                          }
                          label={role}
                          size="small"
                          onChange={
                            role === "Batsman"
                              ? handleBatsmanChange
                              : role === "Non Striker"
                              ? handleNonStrikerChange
                              : handleBowlerChange
                          }
                          MenuProps={selectMenuProps}
                        >
                          {players.length > 0 &&
                            players.map((player) => (
                              <MenuItem value={player.id} key={player.id}>
                                {player.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Box>
                  ))}
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  width="100%"
                  gap={1}
                  mt={2}
                >
                  <Box
                    sx={{ flex: 1 }}
                    display="flex"
                    flexDirection="column"
                    gap={0.5}
                  >
                    <Typography fontSize={14} fontWeight={600}>
                      Extra Type
                    </Typography>
                    <FormControl fullWidth>
                      <InputLabel size="small">Extra Type</InputLabel>
                      <Select
                        value={extraType}
                        label="Extra Type"
                        size="small"
                        onChange={handleExtraTypeChange}
                        MenuProps={selectMenuProps}
                      >
                        {extraTypes.map((et, index) => (
                          <MenuItem value={et} key={index}>
                            {et}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box
                    sx={{ flex: 1 }}
                    display="flex"
                    flexDirection="column"
                    gap={0.5}
                  >
                    <Typography fontWeight={600} fontSize={14}>
                      Extra Run
                    </Typography>
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        label="Extra Run"
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: 0 }}
                        value={extraRun}
                        onChange={handleExtraRunChange}
                        fullWidth
                      />
                    </FormControl>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center">
                  <Typography fontSize={16} fontWeight={600}>
                    Wicket
                  </Typography>
                  <Checkbox
                    sx={{ my: 0 }}
                    checked={isWicket}
                    onChange={handleWicketChange}
                  />
                </Box>
                <Collapse in={isWicket} sx={{ width: "100%" }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                    gap={1}
                    border={1}
                    px={1}
                    py={2}
                    bgcolor={colors.lightBg}
                    borderRadius={2}
                    borderColor={colors.lightGray}
                  >
                    {["Batsman", "Non Striker", "Bowler"].map((role) => (
                      <Box
                        key={role}
                        sx={{ flex: 1 }}
                        display="flex"
                        flexDirection="column"
                        gap={0.5}
                      >
                        <Typography fontWeight={600} fontSize={14}>
                          {role}
                        </Typography>
                        <FormControl fullWidth>
                          <InputLabel size="small">{role}</InputLabel>
                          <Select
                            value={
                              role === "Batsman"
                                ? wicketBatsman
                                : role === "Non Striker"
                                ? wicketNonStriker
                                : wicketBowler
                            }
                            label={role}
                            size="small"
                            onChange={
                              role === "Batsman"
                                ? handleWicketBatsmanChange
                                : role === "Non Striker"
                                ? handleWicketNonStrikerChange
                                : handleWicketBowlerChange
                            }
                            MenuProps={selectMenuProps}
                          >
                            {players.length > 0 &&
                              players.map((player) => (
                                <MenuItem value={player.id} key={player.id}>
                                  {player.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </Box>
                    ))}
                  </Box>
                </Collapse>

                <Box display="flex" width="100%" gap={1}>
                  <Button
                    sx={{ ...buttonStyle, flex: 10, py: 1.2 }}
                    startIcon={<SaveIcon />}
                  >
                    Save Ball
                  </Button>
                  <Button
                    sx={{
                      flex: 1,
                      py: 1.2,
                      border: 1,
                      borderColor: colors.primary,
                    }}
                  >
                    <ReplayIcon sx={{ color: colors.primary }} />
                  </Button>
                </Box>
                <Box className={styles.ballSummary}>
                  <span className={styles.badge + " " + styles.badgeRun}>
                    <AddCircleOutlineIcon style={{ fontSize: 18 }} />
                    Runs: {quickRun !== null ? quickRun : 0}
                  </span>
                  <span className={styles.badge + " " + styles.badgeWicket}>
                    <EmojiEventsIcon style={{ fontSize: 18 }} />
                    Wicket: {isWicket ? "Yes" : "No"}
                  </span>
                  <span className={styles.badge + " " + styles.badgeExtra}>
                    <AddCircleOutlineIcon style={{ fontSize: 18 }} />
                    Extra: {extraRun}
                  </span>
                  <span className={styles.badge + " " + styles.badgeType}>
                    <AddCircleOutlineIcon style={{ fontSize: 18 }} />
                    Type: {extraType || "None"}
                  </span>
                  {isWicket && (
                    <span className={styles.badge + " " + styles.badgeWicket}>
                      <EmojiEventsIcon style={{ fontSize: 18 }} />
                      Wicket Info:{" "}
                      {`Batsman: ${
                        players.find((p) => String(p.id) === wicketBatsman)
                          ?.name || ""
                      }, Bowler: ${
                        players.find((p) => String(p.id) === wicketBowler)
                          ?.name || ""
                      }`}
                    </span>
                  )}
                </Box>
              </Box>
            </Paper>
            <Paper elevation={8} sx={{ borderRadius: 2, flex: 1 }}>
              <Box
                width="100%"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                alignItems="center"
                gap={2}
                p={2}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  justifyContent="flex-start"
                  width="100%"
                >
                  <PeopleAltIcon />
                  <Typography fontSize={20}>Current Players</Typography>
                </Box>
                <Box display="flex" flexDirection="column" width="100%" gap={1}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Typography fontSize={15}>
                      Rohit Sharma <span>*</span>
                    </Typography>
                    <Typography fontSize={14}>20(12)</Typography>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Typography fontSize={15}>Rohit Sharma</Typography>
                    <Typography fontSize={14}>20(12)</Typography>
                  </Box>
                </Box>
                <Divider sx={{ width: "100%" }} />
                <Box display="flex" justifyContent="space-between" width="100%">
                  <Typography fontSize={15}>Jasprit Bumrah</Typography>
                  <Typography fontSize={14}>2- 0- 12</Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ScoreCardPage;
