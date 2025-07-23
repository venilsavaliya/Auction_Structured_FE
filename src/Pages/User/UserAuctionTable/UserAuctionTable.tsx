import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  type SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import GroupsIcon from "@mui/icons-material/Groups";
import LaunchIcon from "@mui/icons-material/Launch";
// import axios from "../../../api/axios";
import { toast } from "react-toastify";
import { buttonStyle } from "../../../ComponentStyles";
import {
  tableHeaderCellStyle,
  tableHeaderSortLableStyle,
} from "../../../ComponentStyles";
import colors from "../../../Colors";
import useDebounce from "../../../hooks/useDebounce";
// import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import {
  convertUtcToLocalDate,
  formatUtcToLocalTime,
} from "../../../Utility/Utility";
import LiveStatus from "../../../components/LiveStatus/LiveStatus";
import ScheduledStatus from "../../../components/ScheduledStatus/ScheduledStatus";
import auctionService from "../../../Services/AuctionService/AuctionService";
import type { UserAuction } from "../../../Models/ResponseModels/UserAuctionResponseModel";



const UserAuctionsTable: React.FC = () => {
  const [auctions, setAuctions] = useState<UserAuction[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<string>("Title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>(" ");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const debouncedSearch = useDebounce(search, 300);
  const navigate = useNavigate();

  const fetchAuctions = async () => {
    try {
      const requestBody = {
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        sortBy,
        sortDirection,
        search,
        fromDate: fromDate ? new Date(fromDate).toISOString() : undefined,
        toDate: toDate ? new Date(toDate).toISOString() : undefined,
        status: statusFilter,
      };

    //   const res = await axios.post("/Auction/participated/all", requestBody);
    const res = await auctionService.GetParticipatedAuctions(requestBody);
      const data = res.data;
      setAuctions(data);
      setTotalCount(res.totalCount);
    } catch (error) {
      toast.error("Failed to fetch auctions");
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, [page, rowsPerPage, sortBy, sortDirection, statusFilter]);

  useEffect(() => {
    if (debouncedSearch.length === 0 || debouncedSearch.length >= 3) {
      fetchAuctions();
    }
  }, [debouncedSearch]);

 

//   const handleConfirmDelete = async () => {
//     try {
//       if (!selectedAuctionId) return;
//       await axios.delete(`/auction/${selectedAuctionId}`);
//       toast.success("Auction deleted successfully");
//       fetchAuctions();
//     } catch (err: any) {
//       toast.error(err?.response?.data?.Message || "Delete failed");
//     } finally {
//       setConfirmOpen(false);
//     }
//   };

  const handleSort = (field: string) => {
    const isAsc = sortBy === field && sortDirection === "asc";
    setSortBy(field);
    setSortDirection(isAsc ? "desc" : "asc");
  };

  const handleChangeStatus = (e: SelectChangeEvent) => {
    setStatusFilter(e.target.value);
    setPage(0);
  };

  const handleFilter = () => {
    if (fromDate && !toDate) {
      toast.warn("Please select a valid To Date");
      return;
    }
    fetchAuctions();
  };

  const navigateToTeamPage = (auctionId: number) => {
    navigate(`/user/teams/${auctionId}`);
  };

  return (
    <>
      <Box py={2}>
        <Box
          gap={2}
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
        >
          <TextField
            label="Search"
            variant="outlined"
            size="medium"
            value={search}
            sx={{ width: "300px" }}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
          <FormControl sx={{ minWidth: 200 }} size="medium">
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} label="Status" onChange={handleChangeStatus}>
              <MenuItem value=" ">All</MenuItem>
              <MenuItem value="Live">Live</MenuItem>
              <MenuItem value="Scheduled">Scheduled</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <Box display="flex" gap={2}>
            <TextField
              type="date"
              label="From Date"
              size="medium"
              InputLabelProps={{ shrink: true }}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <TextField
              type="date"
              label="To Date"
              size="medium"
              InputLabelProps={{ shrink: true }}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
            <Button variant="contained" sx={{ ...buttonStyle }} onClick={handleFilter}>
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 1, boxShadow: 4 }}>
        <Table sx={{ minWidth: 650 }} stickyHeader>
          <TableHead>
            <TableRow>
              {[
                { label: "Title", field: "AuctionTitle" },
                { label: "Start Date", field: "StartDate" },
                { label: "Start Time", field: "StartTime" },
                { label: "Status", field: "Status" },
                { label: "Total Players", field: "TotalPlayer" },
                { label: "Amount Remains", field: "AmountRemaining" },
              ].map(({ label, field }) => (
                <TableCell key={field} sx={tableHeaderCellStyle}>
                  <TableSortLabel
                    sx={tableHeaderSortLableStyle}
                    active={sortBy === field}
                    direction={sortBy === field ? sortDirection : "asc"}
                    onClick={() => handleSort(field)}
                  >
                    {label}
                  </TableSortLabel>
                </TableCell>
              ))}
             
              <TableCell sx={tableHeaderCellStyle}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {auctions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="subtitle1" color="textSecondary">
                    No Auctions found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              auctions.map((auction) => (
                <TableRow
                  key={auction.auctionId}
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                    "&:hover": { backgroundColor: "#f1f1f1" },
                  }}
                >
                  <TableCell>{auction.auctionTitle}</TableCell>
                  <TableCell>{convertUtcToLocalDate(auction.startTime)}</TableCell>
                  <TableCell>{formatUtcToLocalTime(auction.startTime)}</TableCell>
                  <TableCell>
                    {auction.auctionStatus === "Live" ? (   
                      <LiveStatus />
                    ) : auction.auctionStatus === "Scheduled" ? (
                      <ScheduledStatus />
                    ) : (
                      <Typography>{auction.auctionStatus}</Typography>
                    )}
                  </TableCell>
                  <TableCell>{auction.totalPlayer}</TableCell>
                  <TableCell>₹ {auction.amountRemaining}</TableCell>
                  <TableCell>
                    <Tooltip title="Teams">
                      <IconButton
                        sx={{ color: colors.secondary, p: 0, mr: 2 }}
                        onClick={() => navigateToTeamPage(auction.auctionId)}
                      >
                        <GroupsIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Go to Auction">
                      <IconButton
                        sx={{ color: colors.secondary, p: 0 }}
                        onClick={() =>
                          navigate(`/user/auctions/live/${auction.auctionId}`)
                        }
                      >
                        <LaunchIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
{/* 
      <ConfirmationModal
        open={confirmOpen}
        title="Delete Auction"
        message="Are you sure you want to delete this auction?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      /> */}
    </>
  );
};

export default UserAuctionsTable;
