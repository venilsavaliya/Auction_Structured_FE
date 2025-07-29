import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Checkbox,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Paper,
  IconButton,
  Badge,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import colors from "../../Colors";
import playerService from "../../Services/PlayerService/PlayerServices";
import type { PlayerSummary } from "../../Models/ResponseModels/PlayerSummaryResponseModel";
import { buttonStyle } from "../../ComponentStyles";
import styles from "./SelectPlayerModal.module.scss";

interface SelectPlayerModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selected: { teamA: number[]; teamB: number[] }) => void;
  title?: string;
  teamA: string;
  teamB: string;
  teamAId: number;
  teamBId: number;
  maxSelections?: number;
}

const SelectPlayerModal: React.FC<SelectPlayerModalProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Select Players",
  teamA,
  teamB,
  teamAId,
  teamBId,
  maxSelections = 11,
}) => {
  const [selectedTeamA, setSelectedTeamA] = useState<number[]>([]);
  const [selectedTeamB, setSelectedTeamB] = useState<number[]>([]);
  const [teamAPlayers, setTeamAPlayers] = useState<PlayerSummary[]>([]);
  const [teamBPlayers, setTeamBPlayers] = useState<PlayerSummary[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch players from service
  useEffect(() => {
    if (open) {
      fetchPlayers();
    }
  }, [open]);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      // Fetch all players
      const response = await playerService.GetPlayerSummaryListByTeamId(
        teamAId
      );
      if (response.isSuccess && response.data) {
        setTeamAPlayers(response.data);
      }

      const responseB = await playerService.GetPlayerSummaryListByTeamId(
        teamBId
      );
      if (responseB.isSuccess && responseB.data) {
        setTeamBPlayers(responseB.data);
      }
    } catch (error) {
      console.error("Failed to fetch players:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerToggle = (playerId: number, team: "A" | "B") => {
    if (team === "A") {
      setSelectedTeamA((prev) => {
        if (prev.includes(playerId)) {
          return prev.filter((id) => id !== playerId);
        } else {
          if (prev.length >= maxSelections) return prev;
          return [...prev, playerId];
        }
      });
    } else {
      setSelectedTeamB((prev) => {
        if (prev.includes(playerId)) {
          return prev.filter((id) => id !== playerId);
        } else {
          if (prev.length >= maxSelections) return prev;
          return [...prev, playerId];
        }
      });
    }
  };

  const handleConfirm = () => {
    onConfirm({ teamA: selectedTeamA, teamB: selectedTeamB });
    onClose();
  };

  const handleClose = () => {
    setSelectedTeamA([]);
    setSelectedTeamB([]);
    onClose();
  };

  const renderPlayerList = (
    players: PlayerSummary[],
    teamName: string,
    team: "A" | "B"
  ) => {
    const selected = team === "A" ? selectedTeamA : selectedTeamB;
    return (
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        sx={{ overflow: "auto", textWrap: "nowrap" }}
      >
        <Typography
          variant="h6"
          fontWeight={500}
          mb={2}
          color={colors.primaryDark}
        >
          {teamName} ({players.length} players)
        </Typography>
        <Paper
          elevation={1}
          sx={{
            flex: 1,
            overflow: "auto",
            maxHeight: 400,
            bgcolor: "#fafafa",
          }}
          className={styles.scrollContainer}
        >
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height={200}
            >
              <CircularProgress />
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {players.map((player) => (
                <ListItem
                  key={player.id}
                  disablePadding
                  sx={{
                    borderBottom: "1px solid #e0e0e0",
                    "&:last-child": { borderBottom: "none" },
                  }}
                >
                  <ListItemButton
                    onClick={() => handlePlayerToggle(player.id, team)}
                    sx={{
                      py: 0.5,
                      px: 2,
                      "&:hover": { bgcolor: "#f0f8ff" },
                      bgcolor: selected.includes(player.id)
                        ? "#e3f2fd"
                        : "transparent",
                    }}
                  >
                    <Checkbox
                      checked={selected.includes(player.id)}
                      sx={{
                        color: colors.primary,
                        "&.Mui-checked": {
                          color: colors.primary,
                        },
                      }}
                    />
                    <ListItemAvatar>
                      <Badge
                        badgeContent={
                          selected.includes(player.id) ? (
                            <CheckCircleIcon
                              sx={{ fontSize: 16, color: colors.primary }}
                            />
                          ) : null
                        }
                      >
                        <Avatar
                          src={player.imageUrl || undefined}
                          sx={{
                            color: "white",
                            fontWeight: 600,
                            width: 40,
                            height: 40,
                            border: "1px solid #e0e0e0",
                          }}
                        >
                          {!player.imageUrl &&
                            player.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography fontSize={15} fontWeight={600}>
                          {player.name}
                        </Typography>
                      }
                      secondary={
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1}
                          mt={0.5}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontSize={11}
                          >
                            {player.skill}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: 600,
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: colors.activeBg,
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box p={3}>
          <Box display="flex" gap={1} maxHeight={300}>
            {/* Team A Panel */}
            {renderPlayerList(teamAPlayers, teamA, "A")}
            {/* Vertical Divider */}
            <Divider orientation="vertical" flexItem />
            {/* Team B Panel */}
            {renderPlayerList(teamBPlayers, teamB, "B")}
          </Box>

          {/* Selection Summary */}
          <Box
            mt={3}
            p={2}
            bgcolor="#f8f9fa"
            borderRadius={2}
            border="1px solid #e0e0e0"
          >
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Selection Summary
            </Typography>
            <Box display="flex" alignItems="center" gap={2} flexWrap={"wrap"}>
              <Typography variant="body2" color="text.secondary">
                Team A Selected: {selectedTeamA.length}/{maxSelections}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Team B Selected: {selectedTeamB.length}/{maxSelections}
              </Typography>
              {selectedTeamA.length > 0 && (
                <Box display="flex" gap={1} flexWrap="wrap">
                  {selectedTeamA.map((playerId) => {
                    const player = teamAPlayers.find((p) => p.id === playerId);
                    return (
                      <Chip
                        key={playerId}
                        label={player?.name || `Player ${playerId}`}
                        size="small"
                        sx={{
                          bgcolor: colors.activeBg,
                          color: "white",
                          fontSize: 11,
                        }}
                      />
                    );
                  })}
                </Box>
              )}
              {selectedTeamB.length > 0 && (
                <Box display="flex" gap={1} flexWrap="wrap">
                  {selectedTeamB.map((playerId) => {
                    const player = teamBPlayers.find((p) => p.id === playerId);
                    return (
                      <Chip
                        key={playerId}
                        label={player?.name || `Player ${playerId}`}
                        size="small"
                        sx={{
                          bgcolor: colors.activeBg,
                          color: "white",
                          fontSize: 11,
                        }}
                      />
                    );
                  })}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{ borderColor: colors.secondary, color: colors.secondary }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={selectedTeamA.length === 0 && selectedTeamB.length === 0}
          sx={buttonStyle}
        >
          Confirm Selection ({selectedTeamA.length + selectedTeamB.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectPlayerModal;
