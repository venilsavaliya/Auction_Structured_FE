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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
import AuctionModal from "../AuctionAddEditModal/AuctionModal";
import { buttonStyle } from "../../../styles/ComponentStyles";
import PageTitle from "../../PageTitle";
import {
  tableHeaderCellStyle,
  tableHeaderSortLableStyle,
} from "../../../styles/PaginationTableStyle";
import colors from "../../../styles/Colors";
import useDebounce from "../../../hooks/useDebounce";
import ConfirmModal from "../../ConfirmationModal/ConfirmModal";
import { useNavigate } from "react-router-dom";
import type { GetAuctionsRequestModel } from "../../../Models/RequestModels/GetAuctionRequestModel";
import auctionService from "../../../Services/AuctionService/AuctionService";

interface Auction {
  id: string;
  title: string;
  startDate: string;
  maximumPurseSize: number;
  auctionStatus: string;
  participantsUserIds: string[];
}

const AuctionTable: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editAuctionData, setEditAuctionData] = useState<Auction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<string>("Title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const debouncedSearch = useDebounce(search, 300);
  const navigate = useNavigate();

  const fetchAuctions = async () => {
    try {
      const requestBody : GetAuctionsRequestModel = {
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        sortBy,
        sortDirection,
        search,
        fromDate: fromDate ? new Date(fromDate).toISOString() : undefined,
        toDate: toDate ? new Date(toDate).toISOString() : undefined,
        status: statusFilter,
      };

      const res = await auctionService.GetAuctions(requestBody);

    //   const res = await axios.post("/auction/filter", requestBody);
    //   const data = res.data;
      setAuctions(res.items);
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

  const handleOpenCreate = () => {
    setIsEdit(false);
    setModalOpen(true);
  };

  const handleEdit = async (id: string) => {
    try {
      setIsEdit(true);
      const res = await axios.get(`/auction/${id}`);
      setSelectedAuction(res.data.data);
      setSelectedAuctionId(id);
      setModalOpen(true);
    } catch (error) {
      toast.error("Failed to fetch auction details");
    }
  };

  const handleDeleteClick = (auctionId: string) => {
    setSelectedAuctionId(auctionId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!selectedAuctionId) return;
      await axios.delete(`/auction/${selectedAuctionId}`);
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

  const handleSubmit = (formData: any) => {
    if (isEdit) {
      console.log("Updating auction:", formData);
    } else {
      console.log("Creating auction:", formData);
    }
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
        <Button variant="contained" endIcon={<AddIcon />} onClick={handleOpenCreate} sx={buttonStyle}>
          Add Auction
        </Button>
      </Box>

      <Box mb={2} display="flex" flexWrap="wrap" gap={2}>
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
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Live">Live</MenuItem>
            <MenuItem value="Scheduled">Scheduled</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
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

        <Button variant="contained" sx={{ ...buttonStyle }} onClick={handleFilter}>
          Apply Filters
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 1, boxShadow: 4 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeaderCellStyle}>
                <TableSortLabel
                  sx={tableHeaderSortLableStyle}
                  active={sortBy === "Title"}
                  direction={sortBy === "Title" ? sortDirection : "asc"}
                  onClick={() => handleSort("Title")}
                >
                  Title
                </TableSortLabel>
              </TableCell>
              <TableCell sx={tableHeaderCellStyle}>
                <TableSortLabel
                  sx={tableHeaderSortLableStyle}
                  active={sortBy === "StartDate"}
                  direction={sortBy === "StartDate" ? sortDirection : "asc"}
                  onClick={() => handleSort("StartDate")}
                >
                  Start Date
                </TableSortLabel>
              </TableCell>
              <TableCell sx={tableHeaderCellStyle}>Max Purse</TableCell>
              <TableCell sx={tableHeaderCellStyle}>
                <TableSortLabel
                  sx={tableHeaderSortLableStyle}
                  active={sortBy === "Status"}
                  direction={sortBy === "Status" ? sortDirection : "asc"}
                  onClick={() => handleSort("Status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell sx={tableHeaderCellStyle}>Teams</TableCell>
              <TableCell sx={tableHeaderCellStyle}>Action</TableCell>
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
                  <TableCell>{new Date(auction.startDate).toLocaleString()}</TableCell>
                  <TableCell>₹{auction.maximumPurseSize}</TableCell>
                  <TableCell>{auction.auctionStatus}</TableCell>
                  <TableCell>{auction.participantsUserIds.length}</TableCell>
                  <TableCell>
                    <IconButton sx={{ color: colors.secondary, p: 0, mr: 2 }} onClick={() => handleEdit(auction.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton sx={{ color: colors.secondary, p: 0, mr: 2 }} onClick={() => handleDeleteClick(auction.id)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      sx={{ color: colors.secondary, p: 0 }}
                      onClick={() => navigate(`/admin/auctions/lobby/${auction.id}`)}
                    >
                      <VisibilityIcon />
                    </IconButton>
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
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      <AuctionModal
        open={modalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialData={selectedAuction}
        isEdit={isEdit}
        auctionId={selectedAuctionId}
      />

      <ConfirmModal
        open={confirmOpen}
        title="Delete Auction"
        message="Are you sure you want to delete this auction?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default AuctionTable;
