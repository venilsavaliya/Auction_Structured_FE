import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PageTitle from "../../../components/PageTitle/PageTitle";
import PlayerCard from "../../../components/PlayerCard/PlayerCard";
import AdminControl from "../../../components/AdminControl/AdminControl";
import { buttonStyle } from "../../../ComponentStyles";
import CountdownTimer from "../../../components/CountDownTimer/CountDownTimer";
import { useParams } from "react-router-dom";
// import axios from "../../../api/axios";
import { getSecondsUntilStart } from "../../../Utility/Utility";
import UserTeamCard from "../../../components/UserTeamCard/UserTeamCard";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import { toast } from "react-toastify";
import colors from "../../../Colors";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TeamPlayerCard from "../../../components/TeamPlayerCard/TeamPlayerCard";
import auctionService from "../../../Services/AuctionService/AuctionService";
import type { Player } from "../../../Models/ResponseModels/PlayerDetailResponseModel";
import userTeamService from "../../../Services/UserTeamService/UserTeamService";
import type { UserTeamPlayer } from "../../../Models/ResponseModels/UserTeamResponseModel";
import type { SetCurrentAuctionPlayerRequest } from "../../../Models/RequestModels/SetCurrentAuctionPlayerRequest";
import auctionPlayerService from "../../../Services/AuctionPlayerService/AuctionPlayerService";
import type { AddAuctionPlayerRequest } from "../../../Models/RequestModels/AddAuctionPlayerRequest";
import type { AuctionDetail } from "../../../Models/ResponseModels/AuctionDetailResponseModel";
import type { User } from "../../../Models/ResponseModels/UserResponseModel";
import auctionParticipantService from "../../../Services/AuctionParticipantService/AuctionParticipantService";
import AuctionEndedPage from "../../CommonPages/AuctionEndedPage/AuctionEndedPage";

interface Participant {
  userId: number;
  fullName: string;
  image: string;
  purseBalance: number;
}

const AuctionLivePage: React.FC = () => {
  const [auction, setAuction] = useState<AuctionDetail | null>(null);
  const [userTeams, setUserTeams] = useState<User[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [currentLivePlayer, setCurrentLivePlayer] = useState<Player | null>(
    null
  );
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [teamPlayers, setTeamPlayers] = useState<UserTeamPlayer[]>([]);
  const [completeModalOpen, setCompleteModalOpen] = useState<boolean>(false);
  const [completingAuction, setCompletingAuction] = useState<boolean>(false);

  const { id } = useParams<{ id: string }>();
  const auctionId = parseInt(id ?? "0");

  const handleAccordionChange = (
    _event: React.SyntheticEvent,
    expanded: boolean
  ) => {
    setIsExpanded(expanded);
    if (expanded && selectedUserId != 0) {
      fetchTeamPlayers(selectedUserId, auctionId);
    }
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUserId(userId);
  };

  const handleStartBidForPlayer = () => {
    if (!currentPlayer) {
      toast.warning("Please Select Player For Auction");
      return;
    }
    setOpen(true);
  };

  const fetchCurrentAuctionPlayer = async () => {
    try {
      const res = await auctionService.GetCurrentAuctionPlayer(auctionId);
      const data = res.data;
      setCurrentLivePlayer(data);
      setCurrentPlayer(data);
    } catch (error) {}
  };

  const fetchTeamPlayers = async (userId: number | null, auctionId: number) => {
    if (!userId || !isExpanded) return;
    const requestBody = { UserId: userId, AuctionId: auctionId };
    const res = await userTeamService.GetUserTeams(requestBody);
    const data = res.items;
    setTeamPlayers(data);
  };

  useEffect(() => {
    fetchTeamPlayers(selectedUserId, auctionId);
  }, [selectedUserId]);

  const setCurrentAuctionPlayer = async () => {
    if (!currentPlayer) {
      toast.warning("Please Select Player For Auction");
      return;
    }
    const requestData: SetCurrentAuctionPlayerRequest = {
      AuctionId: auctionId,
      PlayerId: currentPlayer?.playerId,
    };
    await auctionService.SetCurrentAuctionPlayer(requestData);
    setCurrentLivePlayer(currentPlayer);
  };

  const handleStartBidding = async () => {
    try {
      if (!currentPlayer) return;
      const data: AddAuctionPlayerRequest = {
        AuctionId: auctionId,
        PlayerId: currentPlayer.playerId,
      };
      //   await axios.post("/auctionplayer", data);
      await auctionPlayerService.AddPlayerToAuction(data);
      await setCurrentAuctionPlayer();
      toast.success("Auction For This Player Started");
    } finally {
      setOpen(false);
    }
  };

  const fetchNextPlayer = async () => {
    await fetchCurrentAuctionPlayer();
    if (currentLivePlayer) {
      toast.warning("Please Finish The Auction Of Current Player First");
      return;
    }
    // const res = await axios.get(`/auction/next-player/${auctionId}`);
    const res = await auctionService.GetNextPlayer(auctionId);
    const data = res.data;
    setCurrentPlayer(data);
  };

  const fetchAuctionDetails = async (auctionId: number) => {
    // const res = await axios.get(`/auction/${auctionId}`);
    const res = await auctionService.GetAuctionById(auctionId);
    const data = res.data;

    setAuction(data);
  };

  const fetchUserTeams = async () => {
    // const res = await axios.get(`/auction/teams/${auctionId}`);
    // const res = await userTeamService.GetUserTeams(auctionId)
    const res = await auctionService.GetUsersWhoJoinedAuction(auctionId);
    setUserTeams(res.items);
  };

  const fetchParticipants = async () => {
    // const res = await axios.get(`/auctionParticipant/${auctionId}`);
    // const res = await auctionParticipantService.GetAuctionParticipant()
    const res = await auctionParticipantService.GetAllParticipantOfAuction(
      auctionId
    );
    setParticipants(res.data);
  };

  const handleMarkAuctionCompleted = async () => {
    setCompletingAuction(true);
    try {
      await auctionService.MarkAuctionCompleted(auctionId);
      toast.success("Auction marked as completed successfully!");
      setCompleteModalOpen(false);
      // Optionally redirect to auction list or refresh data
    } catch (error) {
      toast.error("Failed to mark auction as completed");
    } finally {
      setCompletingAuction(false);
    }
  };

  useEffect(() => {
    fetchAuctionDetails(auctionId);
    fetchUserTeams();
    fetchParticipants();
    fetchCurrentAuctionPlayer();
  }, [auctionId]);

  const [isBeforeStart, setIsBeforeStart] = useState(() => {
    return auction!=null ? new Date(auction.startDate).getTime() > Date.now():false;
  });

  useEffect(() => {
    if(auction == null) return;

    if (!isBeforeStart) return;

    const interval = setInterval(() => {
      const stillBeforeStart = new Date(auction.startDate).getTime() > Date.now();
      setIsBeforeStart(stillBeforeStart);

      // Once it starts, stop checking
      if (!stillBeforeStart) {
        clearInterval(interval);
      }
    }, 1000); // check every second

    return () => clearInterval(interval);
  }, [auction?.startDate, isBeforeStart,auction]);


  if (!auction) return <Box>Loading...</Box>;

  if(auction.auctionStatus=="Completed")
  {
    return <AuctionEndedPage/>
  }

  if (isBeforeStart) {

    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Typography variant="h4">Auction Will Start In</Typography>
        <CountdownTimer duration={getSecondsUntilStart(auction.startDate)} />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <PageTitle title="Live Auction" />
        <Button
          variant="contained"
          color="error"
          onClick={() => setCompleteModalOpen(true)}
          sx={{
            ...buttonStyle,
            bgcolor: colors.error,
            "&:hover": {
              bgcolor: "#d32f2f",
            },
          }}
        >
          Mark Auction as Completed
        </Button>
      </Box>

      <Box display="flex" gap={8} mt={2} mb={2} justifyContent="center">
        <Box display="flex" flexDirection="column" gap={4}>
          <PlayerCard player={currentPlayer} />
          <Paper elevation={8} sx={{ borderRadius: "10px" }}>
            <Box py={4} display="flex" justifyContent="center">
              <Button
                sx={{
                  ...buttonStyle,
                  px: "50px",
                  fontSize: "20px",
                  "&.Mui-disabled": {
                    color: "white",
                    bgcolor: colors.lightGray,
                  },
                }}
                onClick={handleStartBidForPlayer}
                disabled={!!currentLivePlayer || !currentPlayer}
              >
                START BIDDING
              </Button>
            </Box>
          </Paper>
        </Box>

        <AdminControl
          users={userTeams}
          fetchNextPlayer={fetchNextPlayer}
          currentLivePlayer={currentLivePlayer}
          selectedUserId={selectedUserId}
          setSelectedUserId={setSelectedUserId}
          auctionId={auctionId}
          setcurrentLivePlayer={setCurrentLivePlayer}
          setCurrentPlayer={setCurrentPlayer}
          fetchParticipants={fetchParticipants}
        />
      </Box>

      <Box mt={2}>
        <Typography variant="h4">Teams</Typography>
        <Paper elevation={8}>
          <Box
            display="flex"
            gap={3}
            justifyContent="space-evenly"
            flexWrap="wrap"
            p={2}
          >
            {participants.map((team) => (
              <UserTeamCard
                key={team.userId}
                user={team}
                selectedUserId={selectedUserId}
                onSelect={handleSelectUser}
              />
            ))}
          </Box>
        </Paper>
      </Box>

      <Box mt={4}>
        <Accordion
          elevation={8}
          expanded={isExpanded}
          onChange={handleAccordionChange}
        >
          <AccordionSummary
            expandIcon={<KeyboardArrowDownIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography variant="h6">Players Of Teams</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {teamPlayers.length !== 0 ? (
              <Box display="flex" flexWrap="wrap" gap={4}>
                {teamPlayers.map((player) => (
                  <TeamPlayerCard key={player.playerId} player={player} />
                ))}
              </Box>
            ) : (
              <Typography>No Player In the team right now</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      </Box>

      <ConfirmationModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleStartBidding}
        title="Bidding Confirmation"
        message="Are you sure you want to start bidding?"
      />
      <ConfirmationModal
        open={completeModalOpen}
        onClose={() => setCompleteModalOpen(false)}
        onConfirm={handleMarkAuctionCompleted}
        title="Mark Auction as Completed"
        message="Are you sure you want to mark this auction as completed? This action cannot be undone."
      />
    </Box>
  );
};

export default AuctionLivePage;
