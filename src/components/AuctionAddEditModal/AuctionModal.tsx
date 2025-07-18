import React, { useEffect, useState } from "react";
import * as yup from "yup"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch,
  Typography,
  FormLabel,
} from "@mui/material";
// import axios from "../../../api/axios";
import { yupResolver } from "@hookform/resolvers/yup";
import { auctionSchema, editAuctionSchema } from "../../Schemas/AuctionSchema";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { buttonStyle, switchStyle } from "../../ComponentStyles";
import MultipleSearchSelect from "../MultipleSearchSelect/MultipleSearchSelect";
import NameChip from "../NameChip/NameChip";
import auctionService from "../../Services/AuctionService/AuctionService";
import type { AuctionDetailResponseModel } from "../../Models/ResponseModels/AuctionDetailResponseModel";
import type { IAuctionModalProps } from "./IAuctionModalProps";
import { toLocalInputDateTime } from "../../Utility/Utility";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/Store";
import type {
  AddAuctionFormInputs,
 
  AuctionFormInputs,
 
  EditAuctionFormInputs,
} from "../../Models/FormInterfaces/AuctionFormInputs";

interface User {
  id: number;
  fullName: string;
}

const AuctionModal: React.FC<IAuctionModalProps> = ({
  open,
  onClose,
  isEdit = false,
  auctionId = null,
}) => {
  const user = useSelector((state: RootState) => state.auth.currentUser);

  const initialData: AuctionFormInputs = {
    title: "",
    minimumBidIncreament: 0,
    maximumPurseSize: 0,
    startDate: "",
    auctionMode: false,
    maximumTeamsCanJoin: 0,
  };

  const schema = isEdit ? editAuctionSchema : auctionSchema;
 

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuctionFormInputs>({
    defaultValues: initialData,
    resolver: yupResolver(auctionSchema),
    context: { isEdit }
  });

  const [auctionMode, setAuctionMode] = useState<boolean>(false);
  const [selectedUsersId, setSelectedUsersId] = useState<string[]|number[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    // const res = await axios.get("/user/usernamelist");
    // setUsers(res.data.data);
  };

  const loadData = async (id: number | null) => {
    if (isEdit && id) {
      try {
        // const res = await axios.get(`/auction/${id}`);
        const res = await auctionService.GetAuctionById(id);
        const auction = res.data;

        const formattedData: AuctionFormInputs = {
          id: auction.id,
          title: auction.title,
          minimumBidIncreament: auction.minimumBidIncreament,
          maximumPurseSize: auction.maximumPurseSize,
          startDate: toLocalInputDateTime(auction.startDate),
          auctionMode: auction.auctionMode,
          maximumTeamsCanJoin: auction.maximumTeamsCanJoin,
          participantsUserIds: auction.participantsUserIds,
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
        id: undefined,
        title: "",
        minimumBidIncreament: 0,
        maximumPurseSize: 0,
        startDate: "",
        auctionMode: false,
        maximumTeamsCanJoin: 0,
      });
    }
  };

  useEffect(() => {
    if (open) {
      loadData(auctionId);
      fetchUsers();
    }
  }, [auctionId, open]);

  const handleRemoveName = (id: number) => {
    setSelectedUsersId((prev) => prev.filter((userId) => userId !== id));
  };

  const handleSelectUser = (userIdList: number[]) => {
    setSelectedUsersId(userIdList);
  };

  const onSubmit = async (data: AuctionFormInputs) => {
    try {
      let dataToSubmit: any = {
        Title: data.title,
        StartDate: new Date(data.startDate).toISOString(),
        MinimumBidIncreament: data.minimumBidIncreament,
        MaximumPurseSize: data.maximumPurseSize,
        ParticipantUserIds: selectedUsersId,
        MaximumTeamsCanJoin: data.maximumTeamsCanJoin,
        AuctionMode: data.auctionMode,
      };

      if (isEdit) {
        dataToSubmit = { ...dataToSubmit, Id: data.id };
        // await axios.put("/Auction", dataToSubmit);
        toast.success("Auction Updated Successfully");
      } else {
        // await axios.post("/Auction", dataToSubmit);
        toast.success("Auction Created Successfully");
      }

      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.Message || "Failed to submit");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{isEdit ? "Edit Auction" : "Create Auction"}</DialogTitle>
      <DialogContent>
        <Box>
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
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>

          <Box display="flex" gap={2}>
            <Controller
              name="maximumTeamsCanJoin"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  sx={{ width: "50%" }}
                  label="Max Team Can Join"
                  type="number"
                  margin="normal"
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Box
              sx={{ width: "50%" }}
              p={1}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap={1}
            >
              <Typography>Auction Mode</Typography>
              <Controller
                name="auctionMode"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    label={
                      <Typography fontWeight={500} fontSize={18}>
                        {field.value ? "Online" : "Offline"}
                      </Typography>
                    }
                    control={
                      <Switch
                        checked={field.value}
                        sx={switchStyle}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                  />
                )}
              />
            </Box>
          </Box>

          <Box display="flex" gap={2}>
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

          <Box
            py={1}
            display="flex"
            width="100%"
            alignItems="center"
            gap={1}
            flexWrap="wrap"
          >
            <FormLabel>Selected Participants:</FormLabel>
            {selectedUsersId.map((id) => (
              <NameChip
                key={id}
                id={id}
                username={users.find((u) => u.id === id)?.fullName??"N/A"}
                onRemoveName={handleRemoveName}
              />
            ))}
          </Box>
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
  );
};

export default AuctionModal;
