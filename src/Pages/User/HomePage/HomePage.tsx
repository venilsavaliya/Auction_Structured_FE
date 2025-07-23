import React from "react";
import BannerImg from "../../../assets/Auctionbanner.png";
import { Box, Typography } from "@mui/material";
import colors from "../../../Colors";
// import AuctionCard from "../../../components/Auction/AuctionCard/AuctionCard";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AuctionHammer from "../../../assets/AuctionHammer.svg";
import WinnerStep from "../../../assets/WinnerStep.svg";
import Bid from "../../../assets/Bid.png";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../../components/PageTitle/PageTitle";

// Optional: define auction type (used if AuctionCard is expecting props)
interface Auction {
  id: string;
  title: string;
  startTime: string;
  maxPurse: number;
  totalTeams: number;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const auction: Auction = {
    id: "AUC123",
    title: "IPL 2025 Mega Auction",
    startTime: "2025-07-01T18:30:00.000Z",
    maxPurse: 20000000,
    totalTeams: 10,
  };

  return (
    <>
    
      {/* <Box margin={0}>
        <img src={BannerImg} width={"100%"} alt="Auction Banner" />
      </Box> */}

      {/* 🔴 Live Auction Section */}
      {/* <Box py={2}>
        <Box m={2} p={2} bgcolor={colors.lightBg} borderRadius={2} boxShadow={8}>
          <Typography variant="h4" color={colors.primary} fontWeight={600} mt={3}>
            Live Auction
          </Typography>
          <Box py={2} display="flex" justifyContent="space-between" overflow="hidden" gap={4}> */}
            {/* <AuctionCard auction={auction} /> */}
          {/* </Box>

          <Box display="flex" justifyContent="flex-end" color={colors.primaryDark}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              gap={1}
              sx={{ cursor: "pointer" }}
              onClick={() => {
                navigate("/user/auctions");
              }}
            >
              <Typography>View All</Typography>
              <NavigateNextIcon />
            </Box>
          </Box>
        </Box>
      </Box> */}

      {/* 🔵 Upcoming Auction Section */}
      {/* <Box py={2}>
        <Box m={2} p={2} bgcolor={colors.lightBg} borderRadius={2} boxShadow={8}>
          <Typography variant="h4" color={colors.primary} fontWeight={600} mt={3}>
            Upcoming Auction
          </Typography>
          <Box py={2} display="flex" justifyContent="space-between" overflow="hidden" gap={4}> */}
            {/* <AuctionCard auction={auction} /> */}
          {/* </Box>
          <Box display="flex" justifyContent="flex-end" color={colors.primaryDark}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              gap={1}
              sx={{ cursor: "pointer" }}
              onClick={() => {
                navigate("/user/auctions");
              }}
            >
              <Typography>View All</Typography>
              <NavigateNextIcon />
            </Box>
          </Box>
        </Box>
      </Box> */}

      {/* 🟢 Feature Highlights */}
      {/* <Box bgcolor={colors.lightBg} px={4} py={2}>
        <Typography
          variant="h4"
          color={colors.primary}
          fontWeight={600}
          mt={3}
          sx={{ textAlign: "center", marginBottom: 4 }}
        >
          You Can Find
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" gap={16}> */}
          {/* Live Auction */}
          {/* <Box display="flex" flexDirection="column" gap={2} alignItems="center">
            <Box
              borderRadius="50%"
              bgcolor={colors.lightBg}
              height="150px"
              width="150px"
              p={3}
              boxShadow={8}
            >
              <img src={AuctionHammer} alt="Live Auction" height="100%" />
            </Box>
            <Typography variant="h5" fontWeight={600}>
              Live Auction
            </Typography>
          </Box> */}

          {/* Smooth Bidding */}
          {/* <Box display="flex" flexDirection="column" gap={2} alignItems="center">
            <Box
              borderRadius="50%"
              bgcolor={colors.lightBg}
              height="150px"
              width="150px"
              p={3}
              boxShadow={8}
            >
              <img src={Bid} alt="Smooth Bidding" height="100%" />
            </Box>
            <Typography variant="h5" fontWeight={600}>
              Smooth Bidding
            </Typography>
          </Box> */}

          {/* One Winner */}
          {/* <Box display="flex" flexDirection="column" gap={2} alignItems="center">
            <Box
              borderRadius="50%"
              bgcolor={colors.lightBg}
              height="150px"
              width="150px"
              p={3}
              boxShadow={8}
            >
              <img src={WinnerStep} alt="One Winner" height="100%" />
            </Box>
            <Typography variant="h5" fontWeight={600}>
              One Winner
            </Typography>
          </Box>
        </Box>
      </Box> */}
      <PageTitle title="Home Page"/>
    </>
  );
};

export default HomePage;
