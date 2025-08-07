import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Avatar,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import PlayerSchema from "../../Schemas/PlayerSchema";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import dummyUserProfile from "../../assets/user_profile.png";
import { buttonStyle, switchStyle } from "../../ComponentStyles";
import type PlayerFormInputs from "../../Models/FormInterfaces/PlayerFormInputs";
import playerService from "../../Services/PlayerService/PlayerServices";
import teamService from "../../Services/TeamService/TeamServices";

interface SkillOption {
  value: string;
  label: string;
}

interface Team {
  id: number;
  name: string;
}

interface PlayerModalProps {
  open: boolean;
  onClose: () => void;
  shouldRefetch: React.MutableRefObject<boolean>;
  isEdit?: boolean;
  skillOptions: SkillOption[];
  playerId?: number;
}

const PlayerModal: React.FC<PlayerModalProps> = ({
  open,
  onClose,
  shouldRefetch,
  isEdit = false,
  skillOptions = [],
  playerId = null,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlayerFormInputs>({
    defaultValues: {
      id: 0,
      name: "",
      dateOfBirth: "",
      country: "",
      isActive: false,
      skill: "",
      teamId: "",
      basePrice: "",
      image: "",
    },
    resolver: yupResolver(PlayerSchema),
  });

  const [teams, setTeams] = useState<Team[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const fetchCountries = async () => {
    const res = await fetch("https://api.first.org/data/v1/countries");
    const result = await res.json();
    const countryData = result.data;
    const countryNames = Object.values(countryData).map(
      (item: any) => item.country
    );
    setCountries(countryNames);
    localStorage.setItem("ipl_countries", JSON.stringify(countryNames));
  };

  const fetchTeams = async () => {
    // const res = await axios.get("/team/all");
    const res = await teamService.GetAllTeams();
    setTeams(res.items);
    localStorage.setItem("ipl_teams", JSON.stringify(res.items));
  };

  const onError = (errors: any) => {
    console.log("Validation errors:", errors);
  };

  useEffect(() => {
    const loadData = async () => {
      if (isEdit && playerId) {
        try {
          const res = await playerService.GetPlayerById(playerId);
          const player = res.data;

          const formattedData: PlayerFormInputs = {
            id: player.playerId,
            name: player.name,
            dateOfBirth: player.dateOfBirth?player.dateOfBirth:"",
            country: player.country,
            isActive: player.isActive,
            skill: player.skill,
            teamId: player.teamId,
            basePrice: player.basePrice,
            image: player.imageUrl ? player.imageUrl : "",
          };

          setPreview(player.imageUrl);
          reset(formattedData);
        } catch (error) {
          toast.error("Failed to load player");
          console.error(error);
        }
      } else {
        reset({
          id: 0,
          name: "",
          dateOfBirth: "",
          country: "",
          isActive: false,
          skill: "",
          teamId: "",
          basePrice: "",
          image: "",
        });
        setPreview(null);
      }

      const cachedTeams = localStorage.getItem("ipl_teams");
      if (cachedTeams) {
        setTeams(JSON.parse(cachedTeams));
      } else {
        fetchTeams();
      }

      const cachedCountries = localStorage.getItem("ipl_countries");
      if (cachedCountries) {
        setCountries(JSON.parse(cachedCountries));
      } else {
        fetchCountries();
      }
    };

    if (open) {
      loadData();
    }
  }, [open, isEdit, playerId, reset]);

  const onSubmit: SubmitHandler<PlayerFormInputs> = async (data) => {
    try {
      const formData = new FormData();

      if (data.id != undefined && data.id != 0) {
        formData.append("Id", data.id.toString());
      }
      formData.append("Name", data.name);
      formData.append("Skill", data.skill);
      formData.append("TeamId", data.teamId.toString());
      formData.append("Country", data.country);
      formData.append("IsActive", data.isActive.toString());
      formData.append("BasePrice", data.basePrice.toString());
      // formData.append("DateOfBirth", data.dateOfBirth || "");
      // formData.append("Image", data.image as Blob); // either File or Blob

      formData.append(
        "DateOfBirth",
        data.dateOfBirth
          ? new Date(data.dateOfBirth).toLocaleDateString("en-CA")
          : ""
      );

      if (typeof data.image === "string") {
        // Already a URL - maybe skip?
      } else {
        if (data.image != null && data.image != undefined) {
          formData.append("Image", data.image);
        }
      }

      if (isEdit) {
        await playerService.UpdatePlayer(formData);
        toast.success("Player updated successfully");
      } else {
        await playerService.AddPlayer(formData);
        toast.success("Player created successfully");
      }

      shouldRefetch.current = true;
      onClose();
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.Message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Edit Player" : "Create Player"}</DialogTitle>
      <DialogContent sx={{ mt: 1 }}>
        {/* Avatar & Image Upload */}
        <Controller
          name="image"
          control={control}
          render={({ field, fieldState }) => (
            <Box mt={2} display={"flex"} justifyContent={"center"}>
              <Box position="relative">
                <Avatar
                  src={preview || dummyUserProfile}
                  alt="Preview"
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    objectFit: "contain",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)",
                  }}
                />
                <label htmlFor="upload-image">
                  <IconButton
                    component="span"
                    sx={{ position: "absolute", bottom: 0, right: -8 }}
                  >
                    <input
                      accept="image/*"
                      id="upload-image"
                      type="file"
                      hidden
                      onChange={(e) => {
                        handleImageChange(e);
                        field.onChange(e.target.files?.[0] || "");
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

        {/* Name */}
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Player Name *"
              fullWidth
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        {/* Skill */}
        <Controller
          name="skill"
          control={control}
          render={({ field, fieldState }) => (
            <FormControl fullWidth margin="normal" error={!!fieldState.error}>
              <InputLabel>Skill *</InputLabel>
              <Select {...field} label="Skill *">
                {skillOptions.map((skill) => (
                  <MenuItem key={skill.value} value={skill.value}>
                    {skill.label}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="caption" color="error">
                {fieldState.error?.message}
              </Typography>
            </FormControl>
          )}
        />

        {/* Team */}
        <Controller
          name="teamId"
          control={control}
          render={({ field, fieldState }) => (
            <FormControl fullWidth margin="normal" error={!!fieldState.error}>
              <InputLabel>Select Team *</InputLabel>
              <Select {...field} label="Select Team *">
                {teams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="caption" color="error">
                {fieldState.error?.message}
              </Typography>
            </FormControl>
          )}
        />

        {/* Country */}
        <Controller
          name="country"
          control={control}
          render={({ field, fieldState }) => (
            <FormControl fullWidth margin="normal" error={!!fieldState.error}>
              <InputLabel>Select Country *</InputLabel>
              <Select
                {...field}
                label="Select Country *"
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 250,
                    },
                  },
                }}
              >
                {countries.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="caption" color="error">
                {fieldState.error?.message}
              </Typography>
            </FormControl>
          )}
        />

        {/* Base Price, Date of Birth, Is Active */}
        <Box display="flex" gap={2}>
          <Controller
            name="basePrice"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Base Price (₹) *"
                type="number"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Date of Birth"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    sx={switchStyle}
                  />
                }
                label="Is Active"
              />
            )}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit, onError)}
          variant="contained"
          color="primary"
          sx={buttonStyle}
        >
          {isEdit ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlayerModal;
