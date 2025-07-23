import {
  Box,
  Button,
  Container,
  Drawer,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import colors from "../../../Colors";
import { buttonStyle } from "../../../ComponentStyles";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AuctionCard from "../../../components/AuctionCard/AuctionCard";
import useDebounce from "../../../hooks/useDebounce";
import auctionService from "../../../Services/AuctionService/AuctionService";
import type { GetAuctionsRequestModel } from "../../../Models/RequestModels/GetAuctionRequestModel";
import type { Auction } from "../../../Models/ResponseModels/AuctionsResponseModel";

const AuctionPage: React.FC = () => {
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [auctionStatus, setAuctionStatus] = useState<string>("All");
  const [range, setRange] = useState<number[]>([0, 100]);
  const [search, setSearch] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [auctions, setAuctions] = useState<Auction[]>([]);

  const debouncedSearch = useDebounce(search, 300);

  const fetchAuctions = async () => {
    try {
      const requestBody: GetAuctionsRequestModel = {
        search: search,
        fromDate: fromDate ? new Date(fromDate).toISOString() : undefined,
        toDate: toDate ? new Date(toDate).toISOString() : undefined,
        status: auctionStatus,
        pageNumber: 1,
        pageSize: 100,
        sortBy: "",
        sortDirection: "asc",
      };

      // const res = await axios.post("/auction/filter", requestBody);
      const res = await auctionService.GetAuctions(requestBody);
      const data = res.items;
      setAuctions(data);
    } catch (error) {
      console.error("Error fetching auctions:", error);
    }
  };

  const handleStatusChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setAuctionStatus(event.target.value);
  };

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearch(event.target.value);
  };

  const handleChange = (_event: Event, newValue: number | number[]): void => {
    if (Array.isArray(newValue)) {
      setRange(newValue);
    }
  };

  const auctionFilterStatus = ["All", "Live", "Scheduled", "Completed"];

  const handleDrawerToggle = (): void => {
    setFilterOpen(!filterOpen);
  };

  const handleApplyDuration = () => {
    fetchAuctions();
    setFilterOpen(false); // Optionally close the drawer
  };

  useEffect(() => {
    fetchAuctions();
  }, [auctionStatus]);

  useEffect(() => {
    if (debouncedSearch.length >= 3 || debouncedSearch.length === 0) {
      fetchAuctions();
    }
  }, [debouncedSearch]);

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
      <Typography variant="h4" sx={{ color: colors.primary }} fontWeight={600}>
        Explore Auctions
      </Typography>

      <Box display="flex" justifyContent="space-between" gap={2} mt={2}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Box width="300px">
            <TextField
              id="outlined-basic"
              label="Search"
              value={search}
              onChange={handleSearchChange}
              variant="outlined"
              fullWidth
            />
          </Box>
          <TextField
            type="date"
            label="From Date"
            size="medium"
            sx={{ width: "200px" }}
            InputLabelProps={{ shrink: true }}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <TextField
            type="date"
            label="To Date"
            sx={{ width: "200px" }}
            size="medium"
            InputLabelProps={{ shrink: true }}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{ ...buttonStyle, px: 4 }}
            onClick={handleApplyDuration}
          >
            Apply Duration
          </Button>
        </Box>
        <Button
          variant="contained"
          endIcon={<FilterAltIcon />}
          sx={{ ...buttonStyle, width: "150px" }}
          onClick={handleDrawerToggle}
        >
          Filters
        </Button>
      </Box>

      <Container sx={{ marginTop: "48px" }}>
        {auctions ? (
          <Box
            display="flex"
            gap={4}
            flexWrap="wrap"
            justifyContent="flex-start"
          >
            {auctions.map((auction, index) => (
              <AuctionCard auction={auction} key={index} />
            ))}
          </Box>
        ) : (
          <Typography>No Auctions Found</Typography>
        )}
      </Container>

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

export default AuctionPage;
