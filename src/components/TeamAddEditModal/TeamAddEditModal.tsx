import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Controller, useForm, type SubmitErrorHandler } from "react-hook-form";
// import { TeamSchema } from "../../../Schemas/TeamSchema";
import { TeamSchema } from "../../Schemas/TeamSchema";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
// import axios from "../../../api/axios";
import { buttonStyle } from "../../ComponentStyles";
import type { TeamFormInput } from "../../Models/FormInterfaces/TeamFormInput";
import teamService from "../../Services/TeamService/TeamServices";

interface TeamAddEditModalProps {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  teamId?: number | null;
}

const TeamAddEditModal: React.FC<TeamAddEditModalProps> = ({
  open,
  onClose,
  isEdit = false,
  teamId = null,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeamFormInput>({
    defaultValues: {
      id: 0,
      name: "",
      image: "",
    },
    resolver: yupResolver(TeamSchema),
  });

  const [preview, setPreview] = useState<string | null>(null);

  const onError: SubmitErrorHandler<TeamFormInput> = (errors) => {
    console.log("Validation errors:", errors);
  };

  const onSubmit = async (data: TeamFormInput) => {
    try {
      const formData = new FormData();

      if (data.id != undefined) {
        formData.append("Id", data.id.toString());
      }

      formData.append("Name", data.name);

      if (typeof data.image === "string") {
        // Already a URL - maybe skip?
      } else {
        if (data.image != null && data.image != undefined) {
          formData.append("Image", data.image);
        }
      }

      if (isEdit) {
        // await axios.put(`/team`, formData);
        await teamService.UpdateTeam(formData);
        toast.success("Team updated successfully");
      } else {
        // await axios.post("/team", formData);
        await teamService.AddTeam(formData);
        toast.success("Team created successfully");
      }

      onClose(); // close modal
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.Message || "Something went wrong");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (isEdit && teamId) {
        try {
          //   const res = await axios.get(`/team/${teamId}`);
          const res = await teamService.GetTeamById(teamId);
          const team = res.data;

          const formattedData: TeamFormInput = {
            id: team.id,
            name: team.name,
            image: team.image,
          };

          setPreview(team.image);
          reset(formattedData);
        } catch (error) {
          toast.error("Failed to load team");
          console.error(error);
        }
      } else {
        reset({
          id: 0,
          name: "",
          image: "",
        });
        setPreview(null);
      }
    };

    if (open) {
      loadData();
    }
  }, [open, isEdit, teamId, reset]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Edit Team" : "Create Team"}</DialogTitle>
      <DialogContent sx={{ mt: 1 }}>
        <Controller
          name="id"
          control={control}
          render={({ field }) => <input type="hidden" {...field} />}
        />

        <Controller
          name="image"
          control={control}
          render={({ field, fieldState }) => (
            <Box
              mb={1}
              display="flex"
              justifyContent="center"
              position="relative"
            >
              <Box position="relative">
                <Avatar
                  src={preview ?? undefined}
                  alt="Preview"
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    objectFit: "contain",
                  }}
                />
                <label
                  htmlFor="upload-avatar"
                  style={{ position: "absolute", bottom: "0", right: "-8px" }}
                >
                  <IconButton component="span" sx={{ position: "relative" }}>
                    <input
                      accept="image/*"
                      id="upload-image"
                      type="file"
                      style={{
                        position: "absolute",
                        zIndex: 10,
                        opacity: 0,
                        backgroundColor: "black",
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                      }}
                      onChange={(e) => {
                        handleImageChange(e);
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                        }
                      }}
                    />
                    <PhotoCameraIcon
                      sx={{
                        color: "white",
                        bgcolor: "gray",
                        borderRadius: "50%",
                        padding: "3px",
                      }}
                    />
                  </IconButton>
                </label>
              </Box>

              {fieldState.error && (
                <Typography variant="caption" color="error">
                  {fieldState.error.message}
                </Typography>
              )}
            </Box>
          )}
        />

        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Team Name"
              fullWidth
              margin="normal"
              required
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit, onError)}
          variant="contained"
          sx={buttonStyle}
        >
          {isEdit ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamAddEditModal;
