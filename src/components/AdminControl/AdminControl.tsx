import {
  Avatar,
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import colors from "../../Colors";
import LiveBadge from "../LiveBadge/LiveBadge";
import BidIncreaseButton from "../BidIncreaseButton/BidIncreaseButton";
import PendingBadge from "../PendingBadge/PendingBadge";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import { buttonStyle } from "../../ComponentStyles";
import { formatIndianCurrency } from "../../Utility/Utility";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import bidService from "../../Services/BidService/BidService";
import type { BidplaceRequestModel } from "../../Models/RequestModels/BidPlaceRequestModel";
import auctionService from "../../Services/AuctionService/AuctionService";
import type { SoldPlayerRequestModel } from "../../Models/RequestModels/SoldPlayerRequestModel";
import auctionParticipantService from "../../Services/AuctionParticipantService/AuctionParticipantService";
import type { AuctionParticipantRequestModel } from "../../Models/RequestModels/AuctionParticipantRequestModel";
import type { AuctionParticipant } from "../../Models/ResponseModels/AuctionParticipantResponseModel";
import type { LatestBidRequestModel } from "../../Models/RequestModels/LatestBidRequestModel";
import type { Bid } from "../../Models/ResponseModels/BidResponseModel";
import type { Player } from "../../Models/ResponseModels/PlayerDetailResponseModel";
import type { User } from "../../Models/ResponseModels/UserResponseModel";

interface AdminControlProps {
  users: User[];
  fetchNextPlayer: () => void;
  currentLivePlayer: Player | null;
  setcurrentLivePlayer: (player: Player | null) => void;
  selectedUserId: number;
  setSelectedUserId: (id: number) => void;
  auctionId: number;
  setCurrentPlayer: (player: Player | null) => void;
  fetchParticipants: () => void;
}

const FIRST_BID_INCREASE_AMOUNT = 100000;
const SECOND_BID_INCREASE_AMOUNT = 200000;
const THIRD_BID_INCREASE_AMOUNT = 500000;

const AdminControl: React.FC<AdminControlProps> = ({
  users,
  fetchNextPlayer,
  currentLivePlayer,
  setcurrentLivePlayer,
  selectedUserId,
  setSelectedUserId,
  auctionId,
  setCurrentPlayer,
  fetchParticipants,
}) => {
  const [currentBid, setCurrentBid] = useState<Bid | null>(null);
  const [currentUser, setCurrentUser] = useState<AuctionParticipant | null>(
    null
  );
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [customBidAmount, setCustomBidAmount] = useState<number>(0);
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [unsoldOpen, setUnsoldOpen] = useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
    setUnsoldOpen(false);
  };

  const handleSoldConfirmation = () => setOpen(true);
  const handleUnSoldConfirmation = () => setUnsoldOpen(true);

  const handleCustomBidChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCustomBidAmount(Number(e.target.value));
  };

  const handleCustomBidPlace = async () => {
    if (!currentLivePlayer || !selectedUserId) {
      toast.warning("Please Select Player and User First");
      return;
    }
    if (selectedUserId === currentUser?.userId) {
      toast.warning("Same User Cannot Place Bid Again");
      return;
    }
    if (customBidAmount < bidAmount) {
      toast.warning("Bid Cannot Be Less Than Current Bid");
      return;
    }
    try {
      const requestData: BidplaceRequestModel = {
        AuctionId: auctionId,
        PlayerId: currentLivePlayer.playerId,
        UserId: selectedUserId,
        BidAmount: customBidAmount,
      };

      await bidService.PlaceBid(requestData);
      fetchParticipantById(Number(selectedUserId));
      setBidAmount(customBidAmount);
      toast.success("Bid Placed Successfully");
    } catch (error) {
      toast.error("Error placing bid");
    }
  };

  const handleBidIncrease = async (amount: number | undefined) => {
    if (!amount) {
      return;
    }
    if (!currentLivePlayer || !selectedUserId) {
      toast.warning("Please Select Player and User First");
      return;
    }
    if (selectedUserId === currentUser?.userId) {
      toast.warning("Same User Cannot Place Bid Again");
      return;
    }

    try {
      const requestData: AuctionParticipantRequestModel = {
        UserId: Number(selectedUserId),
        AuctionId: auctionId,
      };
      const res = await auctionParticipantService.GetAuctionParticipant(
        requestData
      );
      console.log("user place bid",res)
      if (amount + bidAmount > res.data.purseBalance) {
        toast.warning("Player Not Have Enough Balance!");
        return;
      }
      setCurrentUser(res.data);
    } catch (error) {
      toast.error("Failed to fetch participant");
    }

    try {
      const newBidAmount = bidAmount + amount;
      const requestData = {
        AuctionId: auctionId,
        PlayerId: currentLivePlayer.playerId,
        UserId: selectedUserId,
        BidAmount: newBidAmount,
      };
      //   await axios.post("/bid/place", requestData);
      await bidService.PlaceBid(requestData);
      fetchParticipantById(Number(selectedUserId));
      setBidAmount(newBidAmount);
      toast.success("Bid Placed Successfully");
      if (disableButton) setDisableButton(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.Message || "Error placing bid");
    }
  };

  const handleSold = async () => {
    if (!currentLivePlayer || !currentUser) {
      toast.warning("Player or Bidder Missing");
      return;
    }
    if (bidAmount > (currentUser?.purseBalance ?? 0)) {
      toast.warning("Player Not Have Enought Balance!");
      return;
    }
    try {
      const requestData = {
        UserId: currentUser.userId,
        AuctionId: auctionId,
        PlayerId: currentLivePlayer.playerId,
        Price: bidAmount,
      };
      //   await axios.post("/auction/player/marksold", requestData);
      await auctionService.MarkPlayerSold(requestData);
      toast.success(`Player Sold To ${currentUser.fullName}`);
      resetAuctionState();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error marking sold");
    }
  };

  const handleUnSold = async () => {
    if (!currentLivePlayer) {
      toast.warning("No Player Selected For Auction!");
      return;
    }
    try {
      const requestData: SoldPlayerRequestModel = {
        UserId: currentUser?.userId,
        AuctionId: auctionId,
        PlayerId: currentLivePlayer.playerId,
        Price: bidAmount,
      };
      await auctionService.MarkPlayerSold(requestData);
      toast.success("Player Remains Unsold");
      resetAuctionState();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error marking unsold");
    }
  };

  const resetAuctionState = () => {
    setBidAmount(0);
    setCurrentBid(null);
    setCurrentUser(null);
    setSelectedUserId(0);
    setcurrentLivePlayer(null);
    setCurrentPlayer(null);
    setCustomBidAmount(0);
    fetchParticipants();
  };

  const fetchParticipantById = async (userId: number) => {
    try {
      const requestData: AuctionParticipantRequestModel = {
        UserId: userId,
        AuctionId: auctionId,
      };
      //   const res = await axios.post(`/auctionparticipant/fetch`, requestData);
      const res = await auctionParticipantService.GetAuctionParticipant(
        requestData
      );
      setCurrentUser(res.data);
    } catch (error) {
      toast.error("Failed to fetch participant");
    }
  };

  const fetchLatestBid = async () => {
    if (!currentLivePlayer) return;
    try {
      const requestData: LatestBidRequestModel = {
        AuctionId: auctionId,
        PlayerId: currentLivePlayer.playerId,
      };
      //   const res = await axios.post(`/bid/latest`, requestData);
      const res = await bidService.GetLatestBid(requestData);
      const data: Bid = res.data;
      setCurrentBid(data);
      setBidAmount(data.Amount);
      setSelectedUserId(data.UserId);
      fetchParticipantById(data.UserId);
    } catch {
      setBidAmount(0);
      setDisableButton(true);
    }
  };

  useEffect(() => {
    setDisableButton(currentLivePlayer == null);
    if (currentLivePlayer != null) fetchLatestBid();
  }, [currentLivePlayer]);

  return (
    <Box minWidth={"800px"}>
      <Paper elevation={8} sx={{ padding: 2, borderRadius: "10px" }}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography color={colors.secondary} fontSize={26}>
            Auction Control Panel
          </Typography>
          <Box>{currentLivePlayer ? <LiveBadge /> : <PendingBadge />}</Box>
        </Box>
        <Box display={"flex"} gap={2} mt={2}>
          <Paper elevation={5} sx={{ borderRadius: 2, flex: 1 }}>
            <Box py={2} borderRadius={2} bgcolor={colors.lightBg}>
              <Box
                display={"flex"}
                flexDirection={"column"}
                gap={2}
                alignItems={"center"}
              >
                <Typography
                  color={colors.primary}
                  fontWeight={600}
                  fontSize={14}
                >
                  Current Bid
                </Typography>
                <Typography
                  color={colors.activeBg}
                  fontWeight={600}
                  fontSize={34}
                >
                  ₹ {formatIndianCurrency(bidAmount)}
                </Typography>
              </Box>
            </Box>
          </Paper>
          <Paper elevation={5} sx={{ borderRadius: 2, flex: 1 }}>
            <Box py={2} borderRadius={2} bgcolor={colors.lightBg}>
              <Box
                display={"flex"}
                flexDirection={"column"}
                gap={2}
                alignItems={"center"}
              >
                <Typography
                  color={colors.primary}
                  fontWeight={600}
                  fontSize={14}
                >
                  Bid By
                </Typography>
                <Box display={"flex"} alignItems={"center"} gap={2}>
                  <Box
                    height={50}
                    width={50}
                    borderRadius={"50%"}
                    overflow={"hidden"}
                  >
                    <Avatar
                      src={currentUser?.image}
                      alt="Preview"
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography align={"center"} fontWeight={600}>
                      {currentUser?.fullName ?? "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>

        <Typography mt={2} fontSize={15} fontWeight={600}>
          Quick Bid Increase
        </Typography>
        <Box
          py={2}
          display={"flex"}
          gap={2}
          flexWrap={"wrap"}
          justifyContent={"start"}
        >
          <BidIncreaseButton
            disabled={disableButton}
            handleClick={() => handleBidIncrease(FIRST_BID_INCREASE_AMOUNT)}
          >
            + ₹ {FIRST_BID_INCREASE_AMOUNT}
          </BidIncreaseButton>
          <BidIncreaseButton
            disabled={disableButton}
            handleClick={() => handleBidIncrease(SECOND_BID_INCREASE_AMOUNT)}
          >
            + ₹ {SECOND_BID_INCREASE_AMOUNT}
          </BidIncreaseButton>
          <BidIncreaseButton
            disabled={disableButton}
            handleClick={() => handleBidIncrease(THIRD_BID_INCREASE_AMOUNT)}
          >
            + ₹{THIRD_BID_INCREASE_AMOUNT}
          </BidIncreaseButton>

          {/* <BidIncreaseButton
              disabled={disableButton}
              handleClick={() => handleBidIncrease(THIRD_BID_INCREASE_AMOUNT)}
            >
              Opening Bid
            </BidIncreaseButton> */}

          <Button
            variant="outlined"
            sx={{
              color: colors.primaryDark,
              px: 4,
              borderColor: colors.primaryDark,
            }}
            disabled={currentLivePlayer == null || bidAmount != 0}
            onClick={() => handleBidIncrease(currentLivePlayer?.basePrice)}
          >
            Open Bid
          </Button>
        </Box>

        <Typography mt={1} mb={1} fontSize={15} fontWeight={600}>
          Custom Bid Increase
        </Typography>
        <Box display={"flex"} justifyContent={"flex-start"} gap={2} mb={1}>
          <TextField
            id="outlined-basic"
            label="Custom Bid"
            variant="outlined"
            type="number"
            value={customBidAmount}
            onChange={(e) => handleCustomBidChange(e)}
            disabled={disableButton}
            fullWidth
          />
          <Button
            sx={{
              ...buttonStyle,
              "&.Mui-disabled": {
                color: "white",
                bgcolor: colors.lightGray,
              },
            }}
            onClick={() => {
              handleCustomBidPlace();
            }}
            disabled={disableButton}
          >
            <IconButton>
              <AddIcon sx={{ color: "white" }} />
            </IconButton>
          </Button>
        </Box>
        <Box py={2}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Select Winning Team
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedUserId ?? ""}
              label="Select Winning Team"
              disabled={disableButton}
              onChange={(event) => {
                setSelectedUserId(event.target.value);
              }}
            >
              {users.map((user) => {
                return (
                  <MenuItem value={user.id} key={user.id}>
                    {user.firstName + " " + (user.lastName!=null?user.lastName : "")}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        <Box display={"flex"} justifyContent={"center"} gap={2} py={2}>
          <Button
            sx={{
              bgcolor: colors.green,
              color: "white",
              "&.Mui-disabled": {
                color: "white",
                bgcolor: "#88e18a",
              },
            }}
            fullWidth
            disabled={disableButton}
            onClick={handleSold}
          >
            Sold
          </Button>
          <Button
            fullWidth
            sx={{
              bgcolor: colors.red,
              color: "white",
              "&.Mui-disabled": {
                color: "white",
                bgcolor: "#d77a90",
              },
            }}
            disabled={disableButton && currentLivePlayer == null}
          >
            UnSold
          </Button>
          <Button
            fullWidth
            variant="outlined"
            sx={{ color: colors.primary, outlineColor: colors.activeBg }}
            onClick={fetchNextPlayer}
            disabled={!disableButton || currentLivePlayer != null}
          >
            Next Player
          </Button>
        </Box>
      </Paper>

      <ConfirmationModal
        open={open || unsoldOpen}
        onClose={handleClose}
        confirmText={
          open
            ? "Are you sure to sold this player?"
            : "Are you sure to mark unsold?"
        }
        onConfirm={open ? handleSold : handleSold}
      />
    </Box>
  );
};

export default AdminControl;
