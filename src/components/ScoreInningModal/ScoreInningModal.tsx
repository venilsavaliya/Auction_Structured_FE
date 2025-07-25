import React from "react";
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
} from "@mui/material";
import type { PlayerName } from "../../Models/ResponseModels/PlayerNameListResponseModel";

interface ScoreInningModalProps {
  open: boolean;
  onClose: () => void;
  players: PlayerName[];
  striker: string;
  nonStriker: string;
  bowler: string;
  setStriker: (id: string) => void;
  setNonStriker: (id: string) => void;
  setBowler: (id: string) => void;
  strikerDisabled?: boolean;
  nonStrikerDisabled?: boolean;
  title: string;
  onSave: () => void;
}

const ScoreInningModal: React.FC<ScoreInningModalProps> = ({
  open,
  onClose,
  players,
  striker,
  nonStriker,
  bowler,
  setStriker,
  setNonStriker,
  setBowler,
  strikerDisabled = false,
  nonStrikerDisabled = false,
  title,
  onSave,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <FormControl fullWidth>
            <InputLabel size="small">Striker</InputLabel>
            <Select
              value={striker}
              label="Striker"
              size="small"
              onChange={(e) => setStriker(e.target.value as string)}
              disabled={strikerDisabled}
            >
              {players.map((player) => (
                <MenuItem value={player.id} key={player.id}>
                  {player.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel size="small">Non-Striker</InputLabel>
            <Select
              value={nonStriker}
              label="Non-Striker"
              size="small"
              onChange={(e) => setNonStriker(e.target.value as string)}
              disabled={nonStrikerDisabled}
            >
              {players.map((player) => (
                <MenuItem value={player.id} key={player.id}>
                  {player.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel size="small">Bowler</InputLabel>
            <Select
              value={bowler}
              label="Bowler"
              size="small"
              onChange={(e) => setBowler(e.target.value as string)}
            >
              {players.map((player) => (
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
