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
import playerService from "../../../Services/PlayerService/PlayerServices";
import type { PlayerName } from "../../../Models/ResponseModels/PlayerNameListResponseModel";
import type { SelectChangeEvent } from "@mui/material";
import { toast } from "react-toastify";
import styles from "./scorecard.module.scss";
import { ExtraType, WicketType } from "../../../Constants";
import ballService from "../../../Services/BallService/BallService";
import type { AddBallEventRequestModel } from "../../../Models/RequestModels/AddBallEventRequestModel";
import type { LiveMatchStatusData } from "../../../Models/ResponseModels/LiveMatchStatusResponseModel";
import ScoreInningModal from "../../../components/ScoreInningModal/ScoreInningModal";
import type { InningStateRequestModel } from "../../../Models/RequestModels/InningStateRequestModel";

const ScoreCardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const matchId = id;
  const [liveData, setLiveData] = useState<LiveMatchStatusData | null>(null);
  const [liveLoading, setLiveLoading] = useState(true);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [extraType, setExtraType] = useState<string>("");
  const [extraRun, setExtraRun] = useState<number>(0);
  const [isWicket, setIsWicket] = useState<boolean>(false);
  const [players, setPlayers] = useState<PlayerName[]>([]);
  const [batsman, setBatsman] = useState<number>(0);
  const [nonStriker, setNonStriker] = useState<number>(0);
  const [bowler, setBowler] = useState<number>(0);
  const [wicketBatsman, setWicketBatsman] = useState<string>("");
  const [wicketNonStriker, setWicketNonStriker] = useState<string>("");
  const [wicketBowler, setWicketBowler] = useState<string>("");
  const [quickRun, setQuickRun] = useState<number | null>(null);
  const [wicketType, setWicketType] = useState<string>("");
  const [playerOut, setPlayerOut] = useState<string>("");
  const [fielder, setFielder] = useState<string>("");
  const [matchData, setMatchData] = useState<MatcheDetail | null>(null);
  const [showMoreRunInput, setShowMoreRunInput] = useState(false);
  const [inningModalOpen, setInningModalOpen] = useState(false);
  const [inningModalType, setInningModalType] = useState<
    "start" | "bowler" | "batsman" | null
  >(null);
  const [modalStriker, setModalStriker] = useState<number>(0);
  const [modalNonStriker, setModalNonStriker] = useState<number>(0);
  const [modalBowler, setModalBowler] = useState<number>(0);
  const [isModalStrikerDisabled, setIsModalStrikerDisabled] = useState(false);
  const [inningId, setInningId] = useState<number>(0);
  const [isModalNonStrikerDisabled, setIsModalNonStrikerDisabled] =
    useState(false);
  const [isModalBowlerDisabled, setIsModalBowlerDisabled] = useState(false);

  const [bowlingTeamPlayers, setBowlingTeamPlayers] = useState<PlayerName[]>(
    []
  );
  const [battingTeamPlayers, setBattingTeamPlayers] = useState<PlayerName[]>(
    []
  );
  const [battingTeamId, setBattingTeamId] = useState<number>(0);
  const [bowlingTeamId, setBowlingTeamId] = useState<number>(0);

  const extraTypes: string[] = Object.keys(ExtraType);
  const wicketTypes: string[] = Object.keys(WicketType);

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

  const fetchLiveData = async () => {
    if (!matchId) return;
    setLiveLoading(true);
    setLiveError(null);
    matchService
      .GetLiveMatchStatus(Number(matchId))
      .then((res) => {
        setLiveData(res.data);
        setLiveLoading(false);
      })
      .catch(() => {
        setLiveError("Failed to fetch live match data");
        setLiveLoading(false);
      });
  };

  const handleQuickRunSelect = (run: number) => {
    setQuickRun((prev) => (prev === run ? null : run));
  };

  const handleBatsmanChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value;
    if (value === nonStriker || value === bowler) {
      toast.warn("Batsman, Non Striker, and Bowler must be different players.");
      return;
    }
    setBatsman(Number(value));
  };
  const handleNonStrikerChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value;
    if (value === batsman || value === bowler) {
      toast.warn("Batsman, Non Striker, and Bowler must be different players.");
      return;
    }
    setNonStriker(Number(value));
  };
  const handleBowlerChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value;
    if (value === batsman || value === nonStriker) {
      toast.warn("Batsman, Non Striker, and Bowler must be different players.");
      return;
    }
    setBowler(Number(value));
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

  const handleWicketTypeChange = (event: SelectChangeEvent) => {
    setWicketType(event.target.value as string);
  };
  const handlePlayerOutChange = (event: SelectChangeEvent) => {
    setPlayerOut(event.target.value as string);
  };
  const handleFielderChange = (event: SelectChangeEvent) => {
    setFielder(event.target.value as string);
  };

  const handleSaveBall = () => {
    const ballData = {
      batsman,
      nonStriker,
      bowler,
      quickRun,
      extraType,
      extraRun,
      isWicket,
      wicketType,
      playerOut,
      fielder,
    };
    console.log("Ball Data:", ballData);
  };

  const handleResetBall = () => {
    setBatsman(0);
    setNonStriker(0);
    setBowler(0);
    setQuickRun(null);
    setExtraType("");
    setExtraRun(0);
    setIsWicket(false);
    setWicketType("");
    setPlayerOut("");
    setFielder("");
    setWicketBatsman("");
    setWicketNonStriker("");
    setWicketBowler("");
  };

  const handleAddBall = async () => {
    if (!liveData) return;
    try {
      const inningNumber = liveData.inningNumber;
      const overNumber = Math.floor(liveData.overs) + 1;
      const ballNumber = (liveData.recentBalls?.length ?? 0) + 1;
      const request: AddBallEventRequestModel = {
        matchId: liveData.matchId,
        inningNumber,
        overNumber,
        ballNumber,
        batsmanId: Number(batsman),
        nonStrikerId: Number(nonStriker),
        bowlerId: Number(bowler),
        runsScored: quickRun ?? 0,
        extraType: extraType || null,
        extraRuns: extraRun,
        wicketType: isWicket ? wicketType || null : null,
        dismissedPlayerId: isWicket
          ? playerOut
            ? Number(playerOut)
            : null
          : null,
        fielderId: isWicket ? (fielder ? Number(fielder) : null) : null,
      };
      await ballService.AddBallEvent(request);
      toast.success("Ball entry added successfully!");
      handleResetBall();
      fetchLiveData();
    } catch (error) {
      toast.error("Failed to add ball entry.");
    }
  };

  const handleOpenStartInning = () => {
    setInningModalType("start");
    setInningModalOpen(true);
    setModalStriker(0);
    setModalNonStriker(0);
    setModalBowler(0);
  };
  const handleOpenSelectBowler = () => {
    setInningModalType("bowler");
    setInningModalOpen(true);
    // Pre-fill striker/non-striker from liveData
    setModalStriker(liveData?.currentBatsmen?.[0]?.playerId || 0);
    setModalNonStriker(liveData?.currentBatsmen?.[1]?.playerId || 0);
    setModalBowler(0);
  };

  const handleSelectBatsman = () => {
    setInningModalOpen(true);
    setInningModalType("batsman");
  };
  const handleCloseInningModal = () => {
    setInningModalOpen(false);
  };

  const handleSaveInningModal = () => {
    const request: InningStateRequestModel = {
      id: inningId,
      matchId: liveData?.matchId || 0,
      inningNumber: liveData?.inningNumber || 0,
      battingTeamId: battingTeamId,
      bowlingTeamId: bowlingTeamId,
      strikerId: batsman,
      nonStrikerId: nonStriker,
      bowlerId: bowler,
    };

    if (inningId == 0) {
      matchService.SetInningState(request);
    } else {
      matchService.UpdateInningState(request);
    }
    setInningModalOpen(false);
    fetchLiveData();
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

  // Fetch bowling team players (for Fielder dropdown)
  useEffect(() => {
    if (!liveData) return;

    let bowlingTeamId = 0;
    if (matchData && liveData) {
      if (liveData.battingTeamId && liveData.bowlingTeamId) {
        bowlingTeamId = liveData.bowlingTeamId;
      }
    }
    if (bowlingTeamId) {
      playerService.GetPlayersByTeamId(bowlingTeamId).then((res) => {
        if (res.isSuccess && res.data) {
          setBowlingTeamPlayers(res.data);
        }
      });
    }
  }, [liveData, matchData]);

  // 1. Auto-select batsman, nonStriker, bowler from liveData
  useEffect(() => {
    if (liveData && liveData.currentBatsmen) {
      setBatsman(
        liveData.currentBatsmen.find((batsman) => batsman.isOnStrike)
          ?.playerId || 0
      );
      if (
        liveData?.currentBatsmen.length == 1 &&
        liveData?.currentBatsmen[0].isOnStrike
      ) {
        setIsModalStrikerDisabled(true);
      }
      else if(liveData?.currentBatsmen.length == 1 && !liveData?.currentBatsmen[0].isOnStrike){
        setIsModalNonStrikerDisabled(true);
      }

      if (
        liveData?.currentBatsmen.length == 2
      ) {
        setIsModalNonStrikerDisabled(true);
        setIsModalStrikerDisabled(true);
      }

      setNonStriker(
        liveData.currentBatsmen.find((batsman) => !batsman.isOnStrike)
          ?.playerId || 0
      );

      if (liveData?.inningStateId) {
        setInningId(liveData.inningStateId);
      }
    }
    if (liveData && liveData.currentBowler) {
      setBowler(liveData.currentBowler.playerId);
      setIsModalBowlerDisabled(true);
    }

    if (liveData?.battingTeamId) {
      setBattingTeamId(liveData.battingTeamId);
    }
    if (liveData?.bowlingTeamId) {
      setBowlingTeamId(liveData.bowlingTeamId);
    }
  }, [liveData]);

  useEffect(() => {
    fetchLiveData();
    fetchPlayers();
    fetchMatchDetailById();
  }, [matchId]);

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
                  {liveData
                    ? `${liveData.teamA} Vs ${liveData.teamB}`
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
                    {liveData?.overs}
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Typography fontSize={16}>Score</Typography>
                  <Typography fontSize={30} fontWeight={600}>
                    {liveData?.totalRuns}/{liveData?.totalWickets}
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Typography fontSize={16}>Batting</Typography>
                  <Typography fontSize={18} fontWeight={600}>
                    {liveData ? liveData.teamB : "Batting Team"}
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
                  <Typography fontSize={23}>Over {liveData?.overs}</Typography>
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
                        onClick={() => {
                          setQuickRun(run);
                          setShowMoreRunInput(false);
                        }}
                      >
                        {run}
                      </Button>
                    ))}
                    <Button
                      sx={{ ...buttonStyle, flex: 1, py: 1, fontSize: 18 }}
                      onClick={() => setShowMoreRunInput((prev) => !prev)}
                    >
                      More
                    </Button>
                  </Box>
                </Box>
                <Collapse in={showMoreRunInput} sx={{ width: "100%", mt: 1 }}>
                  <TextField
                    type="number"
                    label="Manual Runs"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: 0 }}
                    value={
                      typeof quickRun === "number" &&
                      ![0, 1, 2, 3, 4, 6].includes(quickRun)
                        ? quickRun
                        : ""
                    }
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      setQuickRun(isNaN(value) ? null : value);
                    }}
                    fullWidth
                  />
                </Collapse>

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
                      <FormControl fullWidth>
                        <InputLabel size="small">{role}</InputLabel>
                        <Select<number>
                          value={
                            role === "Batsman"
                              ? batsman
                              : role === "Non Striker"
                              ? nonStriker
                              : bowler
                          }
                          label={role}
                          size="small"
                          disabled
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
                    <FormControl fullWidth>
                      <InputLabel size="small">Extra Type</InputLabel>
                      <Select
                        value={extraType}
                        label="Extra Type"
                        size="small"
                        onChange={handleExtraTypeChange}
                        MenuProps={selectMenuProps}
                      >
                        {extraTypes.map((et) => (
                          <MenuItem value={et} key={et}>
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
                    <FormControl fullWidth>
                      {/* <InputLabel size="small">Extra Run</InputLabel> */}
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
                    {/* Wicket Type Dropdown */}
                    <Box
                      sx={{ flex: 1 }}
                      display="flex"
                      flexDirection="column"
                      gap={0.5}
                    >
                      <FormControl fullWidth>
                        <InputLabel size="small">Wicket Type</InputLabel>
                        <Select
                          value={wicketType}
                          label="Wicket Type"
                          size="small"
                          onChange={handleWicketTypeChange}
                          MenuProps={selectMenuProps}
                        >
                          {wicketTypes.map((wt) => (
                            <MenuItem value={wt} key={wt}>
                              {wt}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    {/* Player Out Dropdown */}
                    <Box
                      sx={{ flex: 1 }}
                      display="flex"
                      flexDirection="column"
                      gap={0.5}
                    >
                      <FormControl fullWidth>
                        <InputLabel size="small">Player Out</InputLabel>
                        <Select
                          value={playerOut}
                          label="Player Out"
                          size="small"
                          onChange={handlePlayerOutChange}
                          MenuProps={selectMenuProps}
                        >
                          {liveData?.currentBatsmen?.map((batsman) => (
                            <MenuItem
                              value={batsman.playerId}
                              key={batsman.playerId}
                            >
                              {batsman.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    {/* Fielder Dropdown */}
                    <Box
                      sx={{ flex: 1 }}
                      display="flex"
                      flexDirection="column"
                      gap={0.5}
                    >
                      <FormControl fullWidth>
                        <InputLabel size="small">Fielder</InputLabel>
                        <Select
                          value={fielder}
                          label="Fielder"
                          size="small"
                          onChange={handleFielderChange}
                          MenuProps={selectMenuProps}
                        >
                          {bowlingTeamPlayers.map((player) => (
                            <MenuItem value={player.id} key={player.id}>
                              {player.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                </Collapse>

                <Box display="flex" width="100%" gap={1}>
                  <Button
                    sx={{ ...buttonStyle, flex: 10, py: 1.2 }}
                    startIcon={<SaveIcon />}
                    onClick={handleAddBall}
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
                    onClick={handleResetBall}
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
                {liveData?.currentBatsmen &&
                  liveData?.currentBatsmen.length > 0 && (
                    <Box
                      display="flex"
                      flexDirection="column"
                      width="100%"
                      gap={1}
                    >
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        width="100%"
                      >
                        <Typography fontSize={15}>
                          {liveData?.currentBatsmen[0].name}{" "}
                          <span>
                            {liveData?.currentBatsmen[0].isOnStrike ? "*" : ""}
                          </span>
                        </Typography>
                        <Typography fontSize={14}>
                          {liveData?.currentBatsmen[0].runs}(
                          {liveData?.currentBatsmen[0].balls})
                        </Typography>
                      </Box>
                      {liveData?.currentBatsmen.length > 1 && (
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          width="100%"
                        >
                          <Typography fontSize={15}>
                            {liveData?.currentBatsmen[1].name}{" "}
                            <span>
                              {liveData?.currentBatsmen[1].isOnStrike
                                ? "*"
                                : ""}
                            </span>
                          </Typography>
                          <Typography fontSize={14}>
                            {liveData?.currentBatsmen[1].runs}(
                            {liveData?.currentBatsmen[1].balls})
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}

                <Divider sx={{ width: "100%" }} />
                {liveData?.currentBowler && (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Typography fontSize={15}>
                      {liveData?.currentBowler?.name}
                    </Typography>
                    <Typography fontSize={14}>
                      {liveData?.currentBowler.overs}-{" "}
                      {liveData?.currentBowler.runsConceded}-{" "}
                      {liveData?.currentBowler.wickets}
                    </Typography>
                  </Box>
                )}

                {/* Buttons for start inning */}
                {!liveData?.currentBatsmen?.length && (
                  <Box mb={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleOpenStartInning}
                    >
                      Start {liveData?.inningNumber === 2 ? "2nd" : "1st"}{" "}
                      Inning
                    </Button>
                  </Box>
                )}

                {/* button for selecting next batsman */}
                {liveData?.currentBatsmen &&
                  liveData?.currentBatsmen.length == 1 && (
                    <Box mb={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSelectBatsman}
                      >
                        Select Next Batsman
                      </Button>
                    </Box>
                  )}

                {/* button for selecting next bowler */}
                {liveData?.currentBatsmen &&
                  liveData?.currentBatsmen.length == 2 &&
                  !liveData?.currentBowler && (
                    <Box mb={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenSelectBowler}
                      >
                        Select Bowler for Next Over
                      </Button>
                    </Box>
                  )}
              </Box>
            </Paper>
          </Box>
        </Box>

        <ScoreInningModal
          matchId={Number(matchId)}
          open={inningModalOpen}
          onClose={handleCloseInningModal}
          striker={batsman}
          nonStriker={nonStriker}
          bowler={bowler}
          setStriker={setBatsman}
          setNonStriker={setNonStriker}
          setBowler={setBowler}
          isStrikerDisabled={isModalStrikerDisabled}
          isNonStrikerDisabled={isModalNonStrikerDisabled}
          isBowlerDisabled={isModalBowlerDisabled}
          title={
            inningModalType === "bowler"
              ? "Select Bowler For Next Over"
              : inningModalType === "batsman"
              ? "Select Batsman for Next Over"
              : `Start ${liveData?.inningNumber === 2 ? "2nd" : "1st"} Inning`
          }
          onSave={handleSaveInningModal}
          battingTeamPlayers={battingTeamPlayers}
          bowlingTeamPlayers={bowlingTeamPlayers}
          teamAId={matchData?.teamAId || 0}
          teamBId={matchData?.teamBId || 0}
          battingTeamId={liveData?.battingTeamId || 0}
          bowlingTeamId={liveData?.bowlingTeamId || 0}
          setBattingTeamId={setBattingTeamId}
          setBowlingTeamId={setBowlingTeamId}
          isTeamSelectionDisabled={battingTeamId != 0 && bowlingTeamId != 0}
        />
      </Container>
    </>
  );
};

export default ScoreCardPage;
