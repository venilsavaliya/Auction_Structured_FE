import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  type SelectChangeEvent,
} from "@mui/material";
import type { PlayerName } from "../../Models/ResponseModels/PlayerNameListResponseModel";
import type { TeamDetail } from "../../Models/ResponseModels/TeamDetailResponseModel";
import playerService from "../../Services/PlayerService/PlayerServices";
import teamService from "../../Services/TeamService/TeamServices";
import type { team } from "../../Models/ResponseModels/TeamsResponseModel";
import ballService from "../../Services/BallService/BallService";

interface ScoreInningModalProps {
  open: boolean;
  onClose: () => void;
  battingTeamPlayers: PlayerName[];
  bowlingTeamPlayers: PlayerName[];
  striker: number;
  nonStriker: number;
  bowler: number;
  setStriker: (id: number) => void;
  setNonStriker: (id: number) => void;
  setBowler: (id: number) => void;
  strikerDisabled?: boolean;
  nonStrikerDisabled?: boolean;
  title: string;
  onSave: () => void;
  // Team selection props
  teamAId: number;
  teamBId: number;
  teams?: TeamDetail[];
  battingTeamId: number;
  bowlingTeamId: number;
  setBattingTeamId: (id: number) => void;
  setBowlingTeamId: (id: number) => void;
  isTeamSelectionDisabled: boolean;
  isStrikerDisabled: boolean;
  isNonStrikerDisabled: boolean;
  isBowlerDisabled: boolean;
  matchId: number;
}

const ScoreInningModal: React.FC<ScoreInningModalProps> = ({
  open,
  onClose,
  striker,
  nonStriker,
  bowler,
  setStriker,
  setNonStriker,
  setBowler,
  title,
  onSave,
  teamAId,
  teamBId,
  battingTeamId,
  bowlingTeamId,
  setBattingTeamId,
  setBowlingTeamId,
  isTeamSelectionDisabled = false,
  isStrikerDisabled = false,
  isNonStrikerDisabled = false,
  isBowlerDisabled = false,
  matchId,
}) => {
  const [battingTeamPlayers, setBattingTeamPlayers] = useState<PlayerName[]>(
    []
  );
  const [bowlingTeamPlayers, setBowlingTeamPlayers] = useState<PlayerName[]>(
    []
  );
  const [teams, setTeams] = useState<team[]>([]);
  const [outPlayers, setOutPlayers] = useState<number[]>([]);

  const handleBattingTeamChange = (e: SelectChangeEvent<number>) => {
    setBattingTeamId(e.target.value);
    playerService.GetPlayersByTeamId(e.target.value).then((res) => {
      if (res.isSuccess) {
        setBattingTeamPlayers(res.data);
      }
    });
  };

  const handleBowlingTeamChange = (e: SelectChangeEvent<number>) => {
    setBowlingTeamId(e.target.value);
    playerService.GetPlayersByTeamId(e.target.value).then((res) => {
      if (res.isSuccess) {
        setBowlingTeamPlayers(res.data);
      }
    });
  };

  const fetchTeams = async () => {
    const res = await teamService.GetAllTeams();
    setTeams(res.items);
  };

  useEffect(() => {
    if (open && battingTeamId && bowlingTeamId) {
      playerService.GetPlayersByTeamId(battingTeamId).then((res) => {
        if (res.isSuccess) {
          console.log("res.data", res.data);
          setBattingTeamPlayers(res.data);
        }
      });
      playerService.GetPlayersByTeamId(bowlingTeamId).then((res) => {
        if (res.isSuccess) {
          setBowlingTeamPlayers(res.data);
        }
      });
    }

    if (
      striker == null ||
      striker == 0 ||
      nonStriker == null ||
      nonStriker == 0
    ) {
      ballService.GetOutPlayersList(matchId).then((res) => {
        // console.log("response of out players",res)
        if (res.isSuccess) {
          setOutPlayers(res.data);
        }
      });
    }
    fetchTeams();
  }, [open, battingTeamId, bowlingTeamId]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          {/* Team Selection Fields - Only show if teams are provided */}
          {teams && (
            <>
              <FormControl fullWidth>
                <InputLabel size="small">Batting Team</InputLabel>
                <Select
                  value={battingTeamId || ""}
                  label="Batting Team"
                  size="small"
                  onChange={(e) => handleBattingTeamChange(e)}
                  disabled={isTeamSelectionDisabled} // Disable if team ID is already set
                >
                  <MenuItem value={teamAId} key={teamAId}>
                    {teams?.find((team) => team.id === teamAId)?.name}
                  </MenuItem>
                  <MenuItem value={teamBId} key={teamBId}>
                    {teams?.find((team) => team.id === teamBId)?.name}
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel size="small">Bowling Team</InputLabel>
                <Select
                  value={bowlingTeamId || ""}
                  label="Bowling Team"
                  size="small"
                  onChange={(e) => handleBowlingTeamChange(e)}
                  disabled={isTeamSelectionDisabled} // Disable if team ID is already set
                >
                  <MenuItem value={teamAId} key={teamAId}>
                    {teams?.find((team) => team.id === teamAId)?.name}
                  </MenuItem>
                  <MenuItem value={teamBId} key={teamBId}>
                    {teams?.find((team) => team.id === teamBId)?.name}
                  </MenuItem>
                </Select>
              </FormControl>
            </>
          )}
          <FormControl fullWidth>
            <InputLabel size="small">Striker</InputLabel>
            <Select
              value={striker}
              label="Striker"
              size="small"
              onChange={(e) => setStriker(e.target.value as number)}
              disabled={isStrikerDisabled}
            >
              {battingTeamPlayers.map((player: PlayerName) => {
                const isOut = outPlayers?.some(
                  (outPlayerId) => outPlayerId === player.id
                );

                return (
                  <MenuItem
                    value={player.id}
                    key={player.id}
                    disabled={isOut || player.id == nonStriker}
                  >
                    {player.name}
                    {player.id == nonStriker ? " (Non-Striker)" : ""}
                    {isOut ? " (Out)" : ""}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel size="small">Non-Striker</InputLabel>
            <Select
              value={nonStriker}
              label="Non-Striker"
              size="small"
              onChange={(e) => setNonStriker(e.target.value as number)}
              disabled={isNonStrikerDisabled}
            >
              {battingTeamPlayers.map((player: PlayerName) => {
                const isOut = outPlayers?.some(
                  (outPlayerId) => outPlayerId === player.id
                );

                return (
                  <MenuItem
                    value={player.id}
                    key={player.id}
                    disabled={isOut || player.id == striker}
                  >
                    {player.name}
                    {player.id == striker ? " (Striker)" : ""}
                    {isOut ? " (Out)" : ""}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel size="small">Bowler</InputLabel>
            <Select
              value={bowler}
              label="Bowler"
              size="small"
              onChange={(e) => setBowler(e.target.value as number)}
              disabled={isBowlerDisabled}
            >
              {bowlingTeamPlayers.map((player: PlayerName) => (
                <MenuItem value={player.id} key={player.id}>
                  {player.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={onSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScoreInningModal;
