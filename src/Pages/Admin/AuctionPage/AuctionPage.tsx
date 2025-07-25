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
import { toast } from "react-toastify";
import { buttonStyle } from "../../../ComponentStyles";
import PageTitle from "../../../components/PageTitle/PageTitle";
import {
  tableHeaderCellStyle,
  tableHeaderSortLableStyle,
} from "../../../ComponentStyles";
import colors from "../../../Colors";
import useDebounce from "../../../hooks/useDebounce";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import auctionService from "../../../Services/AuctionService/AuctionService";
import type { GetAuctionsRequestModel } from "../../../Models/RequestModels/GetAuctionRequestModel";
import AuctionModal from "../../../components/AuctionAddEditModal/AuctionModal";
import type { Auction } from "../../../Models/ResponseModels/AuctionsResponseModel";

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

  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const debouncedSearch = useDebounce(search, 300);
  const navigate = useNavigate();

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

 
  const handleEdit = async (id: number) => {
    setIsEdit(true);
    try {
      // const res = await axios.get<{ data: Auction }>(`/auction/${id}`);
      // setSelectedAuction(res.data.data);
      console.log("selected id",id);
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
                    <IconButton
                      sx={{ color: colors.secondary, p: 0, mr: 2 }}
                      onClick={() => handleEdit(parseInt(auction.id))}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      sx={{ color: colors.secondary, p: 0, mr: 2 }}
                      onClick={() => handleDeleteClick(parseInt(auction.id))}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      sx={{ color: colors.secondary, p: 0 }}
                      onClick={() =>
                        navigate(`/admin/auctions/lobby/${auction.id}`)
                      }
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
