import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { buttonStyle } from "../../ComponentStyles";
import seasonService from "../../Services/Seasonservice/SeasonService";
import type SeasonRequestModel from "../../Models/RequestModels/SeasonRequestModel";

// Validation schema for season form
const seasonSchema = yup.object().shape({
  name: yup
    .string()
    .required("Season name is required")
    .min(2, "Season name must be at least 2 characters"),
});

interface SeasonFormInputs {
  name: string;
}

interface SeasonModalProps {
  open: boolean;
  onClose: () => void;
  onSeasonAdded?: (season: { id: number; name: string }) => void;
}

const SeasonModal: React.FC<SeasonModalProps> = ({
  open,
  onClose,
  onSeasonAdded,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SeasonFormInputs>({
    defaultValues: {
      name: "",
    },
    resolver: yupResolver(seasonSchema),
  });

    const onSubmit = async (data: SeasonFormInputs) => {
    try {
      const request: SeasonRequestModel = { name: data.name };
      const response = await seasonService.CreateSeason(request);
      
      // For now, simulate a successful response with the created season
      // TODO: Update this when the API returns the created season data
      const newSeason = {
        id: Math.floor(Math.random() * 1000) + 1, // Temporary ID generation until API returns it
        name: data.name,
      };

      toast.success("Season created successfully");
      
      // Call the callback to update the parent component
      if (onSeasonAdded) {
        onSeasonAdded(newSeason);
      }
      
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.Message || "Error creating season");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Season</DialogTitle>
      <DialogContent>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Season Name"
              fullWidth
              margin="normal"
              required
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              placeholder="Enter season name (e.g., Season 2024)"
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          sx={buttonStyle}
        >
          Add Season
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SeasonModal;
