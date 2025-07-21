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
} from "@mui/material";
// import axios from "../../../api/axios";
import { yupResolver } from "@hookform/resolvers/yup";
// import AuctionSchema from "../../../Schemas/AuctionSchema";
import { auctionSchema } from "../../Schemas/AuctionSchema";
import { useForm, Controller, type FieldErrors } from "react-hook-form";
// import { useAuth } from "../../../auth/AuthContext";
import { toast } from "react-toastify";
// import { toLocalInputDateTime } from "../../../utility/utility";
import { toLocalInputDateTime } from "../../Utility/Utility";
import { buttonStyle, switchStyle } from "../../ComponentStyles";
import NameChip from "../NameChip/NameChip";
import MultipleSearchSelect from "../MultipleSearchSelect/MultipleSearchSelect";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/Store";
import type { AuctionFormInputs } from "../../Models/FormInterfaces/AuctionFormInputs";
import userService from "../../Services/UserService/UserServices";
import axios from "axios";
import auctionService from "../../Services/AuctionService/AuctionService";
import type { UserName, UserNameList } from "../../Models/ResponseModels/UserListResponseModel";

interface User {
  id: string;
  fullName: string;
}

interface AuctionModalProps {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  auctionId?: number;
  // initialData?: AuctionFormInputs;
}

const AuctionModal: React.FC<AuctionModalProps> = ({
  open,
  onClose,
  isEdit = false,
  auctionId = 0,
  // initialData = {
  //   id: 0,
  //   title: "",
  //   minimumBidIncreament: 0,
  //   maximumPurseSize: 0,
  //   startDate: "",
  //   auctionMode: false,
  //   maximumTeamsCanJoin: 0,
  // },
}) => {
  const user = useSelector((state: RootState) => state.auth.currentUser);

  const [auctionMode, setAuctionMode] = useState<boolean>(false);
  const [selectedUsersId, setSelectedUsersId] = useState<number[]>([]);
  const [users, setUsers] = useState<UserName[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuctionFormInputs>({
    defaultValues: {
      id: 0,
      title: "",
      minimumBidIncreament: 0,
      maximumPurseSize: 0,
      startDate: "",
      auctionMode: false,
      maximumTeamsCanJoin: 0,
    },
    resolver: yupResolver(auctionSchema),
    context: { isEdit },
  });

  const fetchUsers = async () => {
    try {
      // const res = await axios.get("/user/usernamelist");
      const res = await userService.GetUserNameList();
      setUsers(res.items);
      // const res = userService.GetFilteredUsers()
      // const data = await res.data.data;
      // setUsers(data);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const loadData = async (auctionId: number) => {
    if (isEdit && auctionId) {
      try {
        // const res = await axios.get(`/auction/${auctionId}`);

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
        maximumPurseSize: 0,
        startDate: "",
        auctionMode: false,
        maximumTeamsCanJoin: 0,
      });
      setSelectedUsersId([]);
    }
  };

  useEffect(() => {
    if (open) {
      loadData(auctionId);
      fetchUsers();
    }
  }, [auctionId, reset, isEdit, open]);

  const handleRemoveName = (id: number) => {
    setSelectedUsersId((prev) => prev.filter((userId) => userId !== id));
  };

  const handleSelectUser = (userIdList: number[]) => {
    setSelectedUsersId(userIdList);
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
        MaximumPurseSize: data.maximumPurseSize,
        ParticipantUserIds: selectedUsersId,
        MaximumTeamsCanJoin: data.maximumTeamsCanJoin,
        auctionMode: data.auctionMode,
      };

      if (isEdit) {
        dataToSubmit.Id = data.id;
        await auctionService.UpdateAuction(dataToSubmit);
        // await axios.put("/Auction", dataToSubmit);
        toast.success("Auction Updated Successfully");
      } else {
        // await axios.post("/Auction", dataToSubmit);
        await auctionService.CreateAuction(dataToSubmit);
        toast.success("Auction Created Successfully");
      }

      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.Message || "Error submitting auction");
    }
  };

  return (
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
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Box>

        {/* Teams & Mode */}
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
  );
};

export default AuctionModal;
