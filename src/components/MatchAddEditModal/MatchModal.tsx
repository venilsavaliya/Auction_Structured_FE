import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
// import axios from "../../../api/axios";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { buttonStyle } from "../../ComponentStyles";
import { toLocalInputDateTime } from "../../Utility/Utility";
import type { MatchFormInputs } from "../../Models/FormInterfaces/MatchFormInputs";
import matchSchema from "../../Schemas/MatchSchema";
import teamService from "../../Services/TeamService/TeamServices";
import matchService from "../../Services/MatcheService/MatchService";
import seasonService from "../../Services/Seasonservice/SeasonService";
import type { AddMatchRequestModel } from "../../Models/RequestModels/AddMatchRequestModel";
import type { UpdateMatchRequestModel } from "../../Models/RequestModels/UpdateMatchRequestModel";
import type { SeasonResponseModel } from "../../Models/ResponseModels/SeasonListResponseModel";
import SeasonModal from "../SeasonModal/SeasonModal";

interface MatchModalProps {
  open: boolean;
  onClose: () => void;
  matchId: number;
  isEdit: boolean;
}

interface Team {
  id: number;
  name: string;
}

const MatchModal: React.FC<MatchModalProps> = ({
  open,
  onClose,
  matchId = 0,
  isEdit,
}) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [seasons, setSeasons] = useState<SeasonResponseModel[]>([]);
  const [isSeasonModalOpen, setIsSeasonModalOpen] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MatchFormInputs>({
    defaultValues: {
      teamAId: 0,
      teamBId: 0,
      startDate: "",
      seasonId: 0,
    },
    resolver: yupResolver(matchSchema),
  });

  const fetchTeams = async () => {
    try {
      const res = await teamService.GetAllTeams();
      console.log("res", res);
      setTeams(res.items || []);
    } catch (err) {
      toast.error("Failed to fetch teams");
    }
  };

  const fetchSeasons = async () => {
    try {
      const res = await seasonService.GetSeasons();
      setSeasons(res.items);
    } catch (error) {
      toast.error("Failed to fetch seasons");
    }
  };

  const loadMatch = async () => {
    if (isEdit && matchId) {
      try {
        const res = await matchService.GetMatchById(matchId);
        const match = res.data;
        reset({
          teamAId: match.teamAId,
          teamBId: match.teamBId,
          startDate: toLocalInputDateTime(match.startDate),
          seasonId: match.seasonId,
        });
      } catch (err) {
        toast.error("Failed to load match data");
      }
    } else {
      reset({
        teamAId: 0,
        teamBId: 0,
        startDate: "",
        seasonId: 0,
      });
    }
  };

  useEffect(() => {
    if (open) {
      fetchTeams();
      fetchSeasons();
      loadMatch();
    }
  }, [open]);

  const handleSeasonAdded = (newSeason: SeasonResponseModel) => {
    setSeasons((prev) => [...prev, newSeason]);
  };

  const onSubmit = async (data: MatchFormInputs) => {
    try {
      if (isEdit) {
        let payload: UpdateMatchRequestModel = {
          teamAId: data.teamAId,
          teamBId: data.teamBId,
          startDate: new Date(data.startDate).toISOString(),
          id: matchId,
          seasonId: data.seasonId,
        };

        await matchService.UpdateMatch(payload);

        toast.success("Match updated successfully");
      } else {
        let payload: AddMatchRequestModel = {
          teamAId: data.teamAId,
          teamBId: data.teamBId,
          startDate: new Date(data.startDate).toISOString(),
          seasonId: data.seasonId,
        };
        await matchService.AddMatch(payload);
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save match");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>{isEdit ? "Edit Match" : "Create Match"}</DialogTitle>
        <DialogContent>
          <Box mt={1} display="flex" flexDirection="column" gap={2}>
            <Controller
              name="teamAId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.teamAId}>
                  <InputLabel>Team A</InputLabel>
                  <Select {...field} label="Team A">
                    {teams.map((team) => (
                      <MenuItem key={team.id} value={team.id}>
                        {team.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.teamAId && (
                    <Typography color="error" variant="caption">
                      {errors.teamAId.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="teamBId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.teamBId}>
                  <InputLabel>Team B</InputLabel>
                  <Select {...field} label="Team B">
                    {teams.map((team) => (
                      <MenuItem key={team.id} value={team.id}>
                        {team.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.teamBId && (
                    <Typography color="error" variant="caption">
                      {errors.teamBId.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="seasonId"
              control={control}
              render={({ field, fieldState }) => (
                <FormControl fullWidth error={!!fieldState.error}>
                  <InputLabel>Season</InputLabel>
                  <Select {...field} label="Season">
                    {seasons?.length > 0 &&
                      seasons?.map((season) => (
                        <MenuItem key={season.id} value={season.id}>
                          {season.name}
                        </MenuItem>
                      ))}
                    <MenuItem
                      value="config"
                      onClick={() => setIsSeasonModalOpen(true)}
                    >
                      + Add New Season
                    </MenuItem>
                  </Select>
                  {fieldState.error && (
                    <Typography color="error" variant="caption">
                      {fieldState.error.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="datetime-local"
                  label="Start Date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.startDate}
                  helperText={errors.startDate?.message}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            sx={buttonStyle}
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Season Modal */}
      <SeasonModal
        open={isSeasonModalOpen}
        onClose={() => setIsSeasonModalOpen(false)}
        onSeasonAdded={handleSeasonAdded}
      />
    </>
  );
};

export default MatchModal;
