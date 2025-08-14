import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  TableSortLabel,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import LaunchIcon from "@mui/icons-material/Launch";
import { toast } from "react-toastify";
import { buttonStyle } from "../../../ComponentStyles";
import PageTitle from "../../../components/PageTitle/PageTitle";
import {
  tableHeaderCellStyle,
  tableHeaderSortLableStyle,
} from "../../../ComponentStyles";
import colors from "../../../Colors";
import useDebounce from "../../../hooks/useDebounce";
import GroupsIcon from "@mui/icons-material/Groups";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import auctionService from "../../../Services/AuctionService/AuctionService";
import seasonService from "../../../Services/Seasonservice/SeasonService";
import type { GetAuctionsRequestModel } from "../../../Models/RequestModels/GetAuctionRequestModel";
import AuctionModal from "../../../components/AuctionAddEditModal/AuctionModal";
import type { Auction } from "../../../Models/ResponseModels/AuctionsResponseModel";
import type { SeasonResponseModel } from "../../../Models/ResponseModels/SeasonListResponseModel";
import { AuctionStatus } from "../../../Constants";

const AuctionPage: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [selectedAuctionId, setSelectedAuctionId] = useState<number>(0);

  const [sortBy, setSortBy] = useState<string>("Title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [seasonFilter, setSeasonFilter] = useState<number | undefined>(
    undefined
  );
  const [seasons, setSeasons] = useState<SeasonResponseModel[]>([]);

  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const debouncedSearch = useDebounce(search, 300);
  const navigate = useNavigate();

  const fetchSeasons = async () => {
    try {
      const res = await seasonService.GetSeasons();
      setSeasons(res.items);
    } catch (error) {
      toast.error("Failed to fetch seasons");
    }
  };

  const fetchAuctions = async () => {
    try {
      const requestBody: GetAuctionsRequestModel = {
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        sortBy,
        sortDirection,
        search,
        fromDate: fromDate ? new Date(fromDate).toISOString() : undefined,
        toDate: toDate ? new Date(toDate).toISOString() : undefined,
        status: statusFilter,
        seasonId: seasonFilter,
      };

      const res = await auctionService.GetAuctions(requestBody);
      setAuctions(res.items);
      setTotalCount(res.totalCount);
    } catch (error) {
      toast.error("Failed to fetch auctions.");
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, [page, rowsPerPage, sortBy, sortDirection, statusFilter, seasonFilter]);

  useEffect(() => {
    fetchSeasons();
  }, []);

  useEffect(() => {
    if (debouncedSearch.length === 0 || debouncedSearch.length >= 3) {
      fetchAuctions();
    }
  }, [debouncedSearch]);

  const handleOpenCreate = () => {
    setIsEdit(false);
    setModalOpen(true);
  };

  const handleEdit = async (id: number) => {
    setIsEdit(true);
    try {
      setSelectedAuctionId(id);
      setModalOpen(true);
    } catch (err) {
      toast.error("Failed to fetch auction details");
    }
  };

  const handleDeleteClick = (auctionId: number) => {
    setSelectedAuctionId(auctionId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!selectedAuctionId) return;
      await auctionService.DeleteAuction(selectedAuctionId);
      toast.success("Auction Deleted successfully");
      fetchAuctions();
    } catch (err: any) {
      toast.error(err?.response?.data?.Message || "Delete failed");
    } finally {
      setConfirmOpen(false);
    }
  };

  const handleSort = (field: string) => {
    const isAsc = sortBy === field && sortDirection === "asc";
    setSortBy(field);
    setSortDirection(isAsc ? "desc" : "asc");
  };

  const handleClose = () => {
    setModalOpen(false);
    fetchAuctions();
  };

  const handleFilter = () => {
    if (fromDate && !toDate) {
      toast.warn("Please Select Valid Date");
      return;
    }
    fetchAuctions();
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <PageTitle title="Manage Auction" />
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={buttonStyle}
        >
          Add Auction
        </Button>
      </Box>

      <Box display="flex" gap={2} py={2} flexWrap="wrap">
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
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value=" ">All</MenuItem>
            <MenuItem value="Live">Live</MenuItem>
            <MenuItem value="Scheduled">Scheduled</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }} size="medium">
          <InputLabel>Season</InputLabel>
          <Select
            value={seasonFilter??0}
            label="Season"
            onChange={(e) =>
              setSeasonFilter(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          >
            <MenuItem value={0}>All Seasons</MenuItem>
            {seasons.map((season) => (
              <MenuItem key={season.id} value={season.id}>
                {season.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
        <Button variant="contained" sx={buttonStyle} onClick={handleFilter}>
          Apply Filters
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 1, boxShadow: 4 }}>
        <Table sx={{ minWidth: 650 }} stickyHeader>
          <TableHead>
            <TableRow>
              {[
                "Title",
                "StartDate",
                "Max Purse",
                "Status",
                "Teams",
                "Action",
              ].map((header, i) => (
                <TableCell key={i} sx={tableHeaderCellStyle}>
                  {["Title", "StartDate", "Status"].includes(header) ? (
                    <TableSortLabel
                      sx={tableHeaderSortLableStyle}
                      active={sortBy === header}
                      direction={sortBy === header ? sortDirection : "asc"}
                      onClick={() => handleSort(header)}
                    >
                      {header === "StartDate" ? "Start Date" : header}
                    </TableSortLabel>
                  ) : (
                    header
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {auctions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="subtitle1" color="textSecondary">
                    No Auctions found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              auctions.map((auction) => (
                <TableRow
                  key={auction.id}
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                    "&:hover": { backgroundColor: "#f1f1f1" },
                  }}
                >
                  <TableCell>{auction.title}</TableCell>
                  <TableCell>
                    {new Date(auction.startDate).toLocaleString()}
                  </TableCell>
                  <TableCell>₹{auction.maximumPurseSize}</TableCell>
                  <TableCell>{auction.auctionStatus}</TableCell>
                  <TableCell>{auction.participantsUserIds?.length}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit Auction" arrow>
                      <IconButton
                        sx={{ color: colors.secondary, p: 0, mr: 2 }}
                        onClick={() => handleEdit(parseInt(auction.id))}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Auction" arrow>
                      <IconButton
                        sx={{ color: colors.secondary, p: 0, mr: 2 }}
                        onClick={() => handleDeleteClick(parseInt(auction.id))}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View Participants" arrow>
                      <IconButton
                        sx={{ color: colors.secondary, p: 0, mr: 2 }}
                        onClick={() =>
                          navigate(`/admin/auctions/${auction.id}/participants`)
                        }
                      >
                        <GroupsIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title={
                        auction.auctionStatus === AuctionStatus.Live
                          ? "Go to Live Auction"
                          : "Auction is not live"
                      }
                      arrow
                    >
                      <span>
                        <IconButton
                          sx={{
                            color:
                              auction.auctionStatus === "Live"
                                ? colors.secondary
                                : colors.lightGray,
                            p: 0,
                            mr: 2,
                          }}
                          onClick={() =>
                            navigate(`/admin/auctions/live/${auction.id}`)
                          }
                          disabled={auction.auctionStatus !== "Live"}
                        >
                          <LaunchIcon />
                        </IconButton>
                      </span>
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

      <AuctionModal
        open={modalOpen}
        onClose={handleClose}
        // onSubmit={handleSubmit}
        // initialData={selectedAuction}
        isEdit={isEdit}
        auctionId={selectedAuctionId}
      />

      <ConfirmationModal
        open={confirmOpen}
        title="Delete Auction"
        message="Are you sure you want to delete this auction?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default AuctionPage;
