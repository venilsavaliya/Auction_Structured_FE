import {
    Box,
    Button,
    Drawer,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
    Toolbar,
    Typography,
  } from "@mui/material";
  import React, { useState } from "react";
  import PageTitle from "../../../components/PageTitle/PageTitle";
import UserAuctionsTable from "../UserAuctionTable/UserAuctionTable";
//   import UserAuctionTable from "../../../components/User/UserAuctionTable/UserAuctionTable";
  
  const UserAuctionPage: React.FC = () => { 
    const [filterOpen, setFilterOpen] = useState<boolean>(false);
    const [auctionStatus, setAuctionStatus] = useState<string>("All");
  
  
  
    const handleDrawerToggle = (): void => {
      setFilterOpen(!filterOpen);
    };
  
    const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      setAuctionStatus(event.target.value);
    };
  
    const auctionFilterStatus = ["All", "Live", "Scheduled", "Completed"];
  
    const drawerContent = (
      <Box p={2}>
        <Toolbar />
        <Typography variant="h6" fontWeight={600}>
          Filters
        </Typography>
  
        <Box mt={4}>
          <Typography variant="body1" fontWeight={500}>
            Select Auction Status
          </Typography>
        </Box>
  
        <Box>
          <FormControl>
            <RadioGroup
              value={auctionStatus}
              onChange={handleStatusChange}
              name="auction-status-group"
            >
              {auctionFilterStatus.map((status) => (
                <FormControlLabel
                  value={status}
                  control={<Radio />}
                  label={status}
                  key={status}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>
    );
  
    return (
      <Box>
        <PageTitle title={"My Auctions"} />
  
        <Box>
          <UserAuctionsTable/>
        </Box>
  
        <Drawer
          anchor="left"
          open={filterOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              height: "100%",
              width: "300px",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>
    );
  };
  
  export default UserAuctionPage;
  