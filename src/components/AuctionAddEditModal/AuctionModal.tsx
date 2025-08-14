import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Typography,
  FormLabel,
  Switch,
  MenuItem,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { auctionSchema } from "../../Schemas/AuctionSchema";
import { useForm, Controller, type FieldErrors } from "react-hook-form";
import { toast } from "react-toastify";
import { toLocalInputDateTime } from "../../Utility/Utility";
import { buttonStyle, switchStyle } from "../../ComponentStyles";
import NameChip from "../NameChip/NameChip";
import MultipleSearchSelect from "../MultipleSearchSelect/MultipleSearchSelect";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/Store";
import type { AuctionFormInputs } from "../../Models/FormInterfaces/AuctionFormInputs";
import userService from "../../Services/UserService/UserServices";
import auctionService from "../../Services/AuctionService/AuctionService";
import seasonService from "../../Services/Seasonservice/SeasonService";
import type { UserName } from "../../Models/ResponseModels/UserListResponseModel";
import type { SeasonResponseModel } from "../../Models/ResponseModels/SeasonListResponseModel";
import SeasonModal from "../SeasonModal/SeasonModal";
import type { AuctionDetailResponseModel } from "../../Models/ResponseModels/AuctionDetailResponseModel";
import { AuctionStatus, ErrorMessages, SuccessMessages } from "../../Constants";

interface AuctionModalProps {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  auctionId?: number;
}

const AuctionModal: React.FC<AuctionModalProps> = ({
  open,
  onClose,
  isEdit = false,
  auctionId = 0,
}) => {
  const user = useSelector((state: RootState) => state.auth.currentUser);

  const [auctionMode, setAuctionMode] = useState<boolean>(false);
  const [selectedUsersId, setSelectedUsersId] = useState<number[]>([]);
  const [users, setUsers] = useState<UserName[]>([]);
  const [seasons, setSeasons] = useState<SeasonResponseModel[]>([]);
  const [isSeasonModalOpen, setIsSeasonModalOpen] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AuctionFormInputs>({
    defaultValues: {
      id: 0,
      title: "",
      minimumBidIncreament: 0,
      maximumPurseSize: 200000000,
      startDate: "",
      auctionMode: false,
      maximumTeamsCanJoin: 0,
      seasonId: 0,
    },
    resolver: yupResolver(auctionSchema),
    context: { isEdit },
  });

  const fetchUsers = async () => {
    try {
      const res = await userService.GetUserNameList();
      setUsers(res.items);
    } catch (error) {
      toast.error("Failed to fetch users");
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

  const loadData = async (auctionId: number) => {
    if (isEdit && auctionId) {
      try {
        const res = await auctionService.GetAuctionById(auctionId);
        console.log(res);

        const auction = res.data;

        const formattedData: AuctionFormInputs = {
          id: auction.id,
          title: auction.title,
          minimumBidIncreament: auction.minimumBidIncreament,
          maximumPurseSize: auction.maximumPurseSize,
          startDate: toLocalInputDateTime(auction.startDate),
          auctionMode: auction.auctionMode,
          maximumTeamsCanJoin: auction.maximumTeamsCanJoin,
          seasonId: auction.seasonId,
        };

        setAuctionMode(auction.auctionMode);
        setSelectedUsersId(auction.participantsUserIds);
        reset(formattedData);
      } catch (error) {
        toast.error("Failed to load auction");
        console.error(error);
      }
    } else {
      reset({
        id: 0,
        title: "",
        minimumBidIncreament: 0,
        maximumPurseSize: 200000000,
        startDate: "",
        auctionMode: false,
        maximumTeamsCanJoin: 0,
        seasonId: 0,
      });
      setSelectedUsersId([]);
    }
  };

  useEffect(() => {
    if (open) {
      loadData(auctionId);
      fetchUsers();
      fetchSeasons();
    }
  }, [auctionId, reset, isEdit, open]);

  const handleRemoveName = (id: number) => {
    setSelectedUsersId((prev) => prev.filter((userId) => userId !== id));
  };

  const handleSelectUser = (userIdList: number[]) => {
    const maxTeams = watch("maximumTeamsCanJoin");
    
    if (maxTeams && userIdList.length > maxTeams) {
      toast.warn(`You can't select more than ${maxTeams} teams.`);
      return;
    }

    setSelectedUsersId(userIdList);
  };

  const handleSeasonAdded = (newSeason: SeasonResponseModel) => {
    setSeasons((prev) => [...prev, newSeason]);
  };

  const onError = (errors: FieldErrors<AuctionFormInputs>) => {
    console.log("Validation errors:", errors);
  };

  const onSubmit = async (data: AuctionFormInputs) => {
    try {
      let dataToSubmit: any = {
        Title: data.title,
        StartDate: new Date(data.startDate).toISOString(),
        MinimumBidIncreament: data.minimumBidIncreament,
        MaximumPurseSize: 200000000,
        ParticipantUserIds: selectedUsersId,
        MaximumTeamsCanJoin: data.maximumTeamsCanJoin,
        auctionMode: data.auctionMode,
        SeasonId: data.seasonId,
      };

      if (isEdit) {
        var res: AuctionDetailResponseModel =
          await auctionService.GetAuctionById(data.id ?? 0);

        if (res.data.auctionStatus == AuctionStatus.Scheduled) {
          dataToSubmit.Id = data.id;
          await auctionService.UpdateAuction(dataToSubmit);
          toast.success(SuccessMessages.AuctionUpdated);
        } else {
          toast.error(ErrorMessages.CanNotUpdateAuction);
          return;
        }
      } else {
        await auctionService.CreateAuction(dataToSubmit);
        toast.success(SuccessMessages.AuctionCreated);
      }

      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.Message || "Error submitting auction");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>{isEdit ? "Edit Auction" : "Create Auction"}</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          {/* Title */}
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Auction Title"
                fullWidth
                margin="normal"
                required
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          {/* Increments */}
          <Box display="flex" gap={2}>
            <Controller
              name="minimumBidIncreament"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Min Bid Increment"
                  type="number"
                  fullWidth
                  margin="normal"
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="maximumPurseSize"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Max Purse Size"
                  type="number"
                  fullWidth
                  margin="normal"
                  required
                  disabled
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>

          {/* Teams & Mode */}
          <Box display="flex" gap={2}>
            {/* Max Teams Can Join */}
            <Box flex={1}>
              <Controller
                name="maximumTeamsCanJoin"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Max Team Can Join"
                    type="number"
                    margin="normal"
                    required
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Box>

            {/* Season Dropdown */}
            <Box flex={1}>
              <Controller
                name="seasonId"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    select
                    label="Season"
                    fullWidth
                    margin="normal"
                    required
                    error={!!fieldState.error}
                    value={field.value ?? 0}
                    helperText={fieldState.error?.message}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (value === "config") {
                        setIsSeasonModalOpen(true);
                      } else {
                        field.onChange(value);
                      }
                    }}
                  >
                    <MenuItem value={0}>Select a season</MenuItem>
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
                  </TextField>
                )}
              />
            </Box>

            {/* Auction Mode */}
            <Box
              flex={1}
              display="flex"
              justifyContent={"space-between"}
              alignItems="center"
              gap={1}
            >
              <Typography>Auction Mode</Typography>

              <Controller
                name="auctionMode"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    label={
                      field.value ? (
                        <Typography fontWeight={500} fontSize={18}>
                          Online
                        </Typography>
                      ) : (
                        <Typography fontWeight={500} fontSize={18}>
                          Offline
                        </Typography>
                      )
                    }
                    control={
                      <Switch
                        checked={field.value}
                        sx={switchStyle}
                        onChange={(e) => field.onChange(e.target.checked)}
                        disabled={true}
                      />
                    }
                  />
                )}
              />
            </Box>
          </Box>

          {/* Users & Date */}
          <Box
            display="flex"
            gap={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Box flex={1}>
              <MultipleSearchSelect
                optionList={users}
                onChange={handleSelectUser}
                selectedIds={selectedUsersId}
              />
            </Box>

            <Box flex={1}>
              <Controller
                name="startDate"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Start Time"
                    type="datetime-local"
                    fullWidth
                    margin="normal"
                    inputProps={{ min: new Date().toISOString().slice(0, 16) }}
                    InputLabelProps={{ shrink: true }}
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Box>
          </Box>

          {/* Selected Participants */}
          <Box
            py={1}
            display="flex"
            width="100%"
            alignItems="center"
            gap={1}
            flexWrap="wrap"
          >
            <FormLabel>Selected Participants:</FormLabel>
            {selectedUsersId.map((id) => {
              const user = users.find((u) => u.id == id);
              return (
                <NameChip
                  key={id}
                  id={id}
                  username={user?.fullName || ""}
                  onRemoveName={handleRemoveName}
                />
              );
            })}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="secondary">
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

      <SeasonModal
        open={isSeasonModalOpen}
        onClose={() => setIsSeasonModalOpen(false)}
        onSeasonAdded={handleSeasonAdded}
      />
    </>
  );
};

export default AuctionModal;
