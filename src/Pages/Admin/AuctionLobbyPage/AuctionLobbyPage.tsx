import { Box, Button, Typography } from "@mui/material";
import { type FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageTitle from "../../../components/PageTitle/PageTitle";
import colors from "../../../Colors";
import InfoRow from "../../../components/InfoRow/InfoRow";
import UserCard from "../../../components/UserCard/UserCard";
import { buttonStyle } from "../../../ComponentStyles";
import auctionService from "../../../Services/AuctionService/AuctionService";
import type { AuctionTeam } from "../../../Models/ResponseModels/AuctionTeamResponseModel";

// ---------------------------
// Types
// ---------------------------
interface Auction {
  id: number;
  title: string;
  minimumBidIncreament: number;
  maximumPurseSize: number;
  startDate: string;
  maximumTeamsCanJoin: number;
}

// ---------------------------
// Component
// ---------------------------
const AuctionLobbyPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const auctionId = parseInt(id ?? "0");

  const navigate = useNavigate();

  const [auction, setAuction] = useState<Auction | null>(null);
  const [userTeams, setUserTeams] = useState<AuctionTeam[]>([]);

  const fetchAuctionDetails = async (auctionId: number) => {
    try {
    //   const res = await axios.get(`/auction/${auctionId}`);
    const res = await auctionService.GetAuctionById(auctionId);
      setAuction(res.data);
    } catch (error) {
      console.error("Failed to fetch auction details", error);
    }
  };

  const fetchUserTeams = async (auctionId: number) => {
    try {
    //   const res = await axios.get(`/auctionparticipant/teams/joined/${auctionId}`);
    const res = await auctionService.GetAuctionParticipants(auctionId);
      setUserTeams(res.items);
    } catch (error) {
      console.error("Failed to fetch user teams", error);
    }
  };

  useEffect(() => {
    fetchAuctionDetails(auctionId);
    fetchUserTeams(auctionId);
  }, [auctionId]);

  if (auction === null) {
    return <Box>Loading...</Box>;
  }

  return (
    <>
      <PageTitle title={auction.title} />
      <Box mt={2}>
        <InfoRow label="Minimum Bid Increment" value={auction.minimumBidIncreament} />
        <InfoRow label="Maximum Purse Size" value={auction.maximumPurseSize} />
        <InfoRow label="Start Date" value={new Date(auction.startDate).toLocaleString()} />
        <InfoRow label="Maximum Teams Can Join" value={auction.maximumTeamsCanJoin} />
      </Box>

      <Box>
        <Button
          sx={buttonStyle}
          onClick={() => {
            navigate(`/admin/auctions/live/${auctionId}`);
          }}
        >
          Start Auction
        </Button>
      </Box>

      <Typography variant="h5" mt={2} mb={2} color={colors.primary}>
        Teams Joined
      </Typography>

      {userTeams.length > 0 ? (
        <Box display="flex" gap={3} justifyContent="space-evenly" flexWrap="wrap">
          {userTeams.map((team) => (
            <UserCard key={team.auctionId} user={team} />
          ))}
        </Box>
      ) : null}
    </>
  );
};

export default AuctionLobbyPage;
