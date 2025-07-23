import {
    Avatar,
    Box,
    Paper,
    Typography
  } from "@mui/material";
  import React, { useState } from "react";
  import PageTitle from "../../../components/PageTitle/PageTitle";
  import colors from "../../../Colors";
  import UserBidCard from "../../../components/UserBidCard/UserBidCard";
  import TrendingUpIcon from '@mui/icons-material/TrendingUp';
  
  // Define the type for player object
  interface Player {
    imageUrl?: string;
    name?: string;
    skill?: string;
    age?: number;
    basePrice?: number;
  }
  
  const UserAuctionLivePage: React.FC = () => {
    const [player, setPlayer] = useState<Player | null>(null);
  
    return (
      <>
        <PageTitle title="Live Auction" />
  
        <Box mt={3}>
          <Box display="flex" justifyContent="center" gap={10}>
            <Box display="flex" flexDirection="column" width="700px" gap={2}>
              <Paper
                elevation={8}
                sx={{
                  borderRadius: 3,
                  minWidth: "700px",
                  width: "30vw",
                }}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  py={10}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Box display="flex" gap={10} height="100%">
                    <Box
                      height={180}
                      width={180}
                      borderRadius="50%"
                      border={2}
                      borderColor={colors.lightBg}
                      overflow="hidden"
                      boxShadow={5}
                      marginLeft={4}
                    >
                      <Avatar
                        src={player?.imageUrl}
                        alt="Preview"
                        sx={{
                          width: 180,
                          height: 180,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                    <Box display="flex" flexDirection="column" gap={4}>
                      <Box>
                        <Typography fontSize={24} fontWeight={600}>
                          Virat Kohli
                        </Typography>
  
                        <Box display="flex" gap={2} alignItems="center">
                          <Typography
                            fontSize={18}
                            color="gray"
                            fontWeight={500}
                          >
                            Batsman
                          </Typography>
                          <Box
                            height={8}
                            width={8}
                            borderRadius="50%"
                            bgcolor={colors.lightGray}
                          ></Box>
                          <Typography fontSize={16} color="gray">
                            Age 38
                          </Typography>
                        </Box>
                      </Box>
                      <Paper elevation={8} sx={{ borderRadius: 3 }}>
                        <Box
                          bgcolor={colors.lightBluishBg}
                          display="flex"
                          flexDirection="column"
                          justifyContent="space-between"
                          width="300px"
                          px={2}
                          py={2}
                          borderRadius={3}
                        >
                          <Typography fontSize={14}>Base Price</Typography>
                          <Typography fontSize={26} fontWeight={600}>
                            ₹ 20.0 L
                          </Typography>
                        </Box>
                      </Paper>
                    </Box>
                  </Box>
                </Box>
              </Paper>
  
              <Paper elevation={8}>
                <Box display="flex" justifyContent="center" py={2}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    gap={1}
                  >
                    <Typography>Current Bid</Typography>
                    <Typography fontSize={28} fontWeight={600}>
                      ₹ 90.0 L
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Typography>Venil Savaliya</Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Box>
  
            <Box>
              <Paper elevation={8}>
                <Box display="flex" flexDirection="column" minWidth="30vw">
                  <Box px={1} py={2}>
                    <Typography fontSize={28} fontFamily="unset" fontWeight={600} mx={2}>
                      Bid Activity <TrendingUpIcon fontSize="large" />
                    </Typography>
                  </Box>
                  <Box maxHeight="430px" overflow="auto" px={5}>
                    <Box display="flex" flexDirection="column" gap={3} my={3}>
                      <UserBidCard />
                      <UserBidCard />
                      <UserBidCard />
                      <UserBidCard />
                      <UserBidCard />
                      <UserBidCard />
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>
  
          <Box mt={2}>
            <Typography fontSize={30}>Teams</Typography>
          </Box>
        </Box>
      </>
    );
  };
  
  export default UserAuctionLivePage;
  