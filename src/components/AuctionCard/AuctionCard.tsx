import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Paper,
} from "@mui/material";
import { buttonStyle } from "../../ComponentStyles";
import LiveBadge from "../LiveBadge/LiveBadge";
import ScheduledBadge from "../ScheduledBadge/ScheduledBadge";
import BasicCountdownTimer from "../BasicCountDownTimer/BasicContDownTimer";
import { convertUtcToLocalDate } from "../../Utility/Utility";
import type { Auction } from "../../Models/ResponseModels/AuctionsResponseModel";

// Define auction prop type
interface AuctionCardProps {
  auction: Auction;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction }) => {
  return (
    <Card sx={{ borderRadius: 4, boxShadow: 5, minWidth: "350px" }}>
      <CardContent>
        <Paper elevation={5} sx={{ borderRadius: "10px" }}>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            mb={2}
            p={1}
            borderRadius={5}
          >
                <Typography variant="h6">{auction.title}</Typography>
            {auction.auctionStatus === "Live" ? (
              <LiveBadge />
            ) : (
              <ScheduledBadge />
            )}
          </Box>
        </Paper>

        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          width={"100%"}
        >
          <Typography variant="body2">
            <strong>ID:</strong> {auction.id}
          </Typography>
          <Typography variant="body2">
            <strong>Start Time:</strong>{" "}
            {convertUtcToLocalDate(auction.startDate)}
          </Typography>
          <Box display={"flex"} justifyContent={"space-between"}>
            <Typography variant="body2">
              <strong>Purse:</strong> ₹{auction.maximumPurseSize}
            </Typography>
            <Typography variant="body2">
              <strong>Teams Joined:</strong>{" "}
              {auction.participantsUserIds?.length}/{auction.maximumTeamsCanJoin}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2">
              <strong>Starts In:</strong>{" "}
              <BasicCountdownTimer startTime={auction.startDate} />
            </Typography>
          </Box>

          <Button
            variant="contained"
            sx={buttonStyle}
            disabled={auction.auctionStatus === "Live"}
          >
            Join Now
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AuctionCard;
