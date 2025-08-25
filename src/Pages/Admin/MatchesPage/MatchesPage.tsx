import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PageTitle from "../../../components/PageTitle/PageTitle";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import { buttonStyle, PaginationButtonStyle } from "../../../ComponentStyles";
import {
  tableHeaderCellStyle,
  tableHeaderSortLableStyle,
} from "../../../ComponentStyles";
import useDebounce from "../../../hooks/useDebounce";
import colors from "../../../Colors";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MatchModal from "../../../components/MatchAddEditModal/MatchModal";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import matchService from "../../../Services/MatcheService/MatchService";
import seasonService from "../../../Services/Seasonservice/SeasonService";
import axios from "axios";
import type { MatchesFilterParams } from "../../../Models/RequestModels/MatchesFilterParams";
import type { SeasonResponseModel } from "../../../Models/ResponseModels/SeasonListResponseModel";
import { ApiRoutes, RoutePaths } from "../../../Constants";
import EmojiEvents from "@mui/icons-material/EmojiEvents";
import TableSkeleton from "../../../components/TableSkeleton/TableSkeleton";

interface Match {
  matchId: number;
  teamAName: string;
  teamBName: string;
  startDate: string;
}

const MatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [selectedMatchId, setSelectedMatchId] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>(
    new Date(new Date().setFullYear(new Date().getFullYear() - 1))
      .toISOString()
      .split("T")[0]
  );
  const [toDate, setToDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [seasonFilter, setSeasonFilter] = useState<number | undefined>(
    undefined
  );
  const [seasons, setSeasons] = useState<SeasonResponseModel[]>([]);
  const [sortBy, setSortBy] = useState<string>("Title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
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

  const fetchMatches = async () => {
    try {
      const requestBody: MatchesFilterParams = {
        fromDate: fromDate ? new Date(fromDate).toISOString() : undefined,
        toDate: toDate ? new Date(toDate).toISOString() : undefined,
        search,
        pageNumber: page + 1,
        sortBy,
        sortDirection,
        pageSize: rowsPerPage,
        seasonId: seasonFilter,
      };
      setLoading(true);
      const res = await matchService.GetFilteredMatches(requestBody);
      setLoading(false);
      const data = res.items;
      setMatches(data);
      setTotalCount(res.totalCount);
    } catch (error) {
      toast.error("Failed to fetch matches");
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [page, rowsPerPage, sortBy, sortDirection, seasonFilter]);

  useEffect(() => {
    if (debouncedSearch.length === 0 || debouncedSearch.length >= 3) {
      fetchMatches();
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchSeasons();
  }, []);

  const handleOpenCreate = () => {
    setIsEdit(false);
    setModalOpen(true);
    setOpen(true);
  };

  const handleScoreDashboardNavigation = (matchId: number) => {
    navigate(`/admin/configurescore/${matchId}`);
  };

  const handleMatchPointsNavigation = (matchId: number) => {
    navigate(`/admin/matches/playersmatchpoints/${matchId}`);
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedMatchId != 0 && selectedMatchId != null) {
        await matchService.DeleteMatch(selectedMatchId);
        toast.success("Match deleted successfully");
        fetchMatches();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.Message || "Delete failed");
    } finally {
      setConfirmOpen(false);
    }
  };

  const handleEdit = (matchId: number) => {
    setSelectedMatchId(matchId);
    setIsEdit(true);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setIsEdit(false);
    setSelectedMatchId(0);
    fetchMatches();
  };

  const handleDeleteClick = (matchId: number) => {
    setSelectedMatchId(matchId);
    setConfirmOpen(true);
  };

  const handleFilter = () => {
    if (fromDate && !toDate) {
      toast.warn("Please Select Valid Date");
      return;
    }
    fetchMatches();
  };

  const handleSort = (field: string) => {
    const isAsc = sortBy === field && sortDirection === "asc";
    setSortBy(field);
    setSortDirection(isAsc ? "desc" : "asc");
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" marginBottom={3}>
        <PageTitle title="Manage Matches" />
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={buttonStyle}
        >
          Add Match
        </Button>
      </Box>

      <Box py={2} display="flex" gap={2} alignItems="center">
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
          <InputLabel>Season</InputLabel>
          <Select
            value={seasonFilter != undefined ? seasonFilter : ""}
            label="Season"
            onChange={(e) =>
              setSeasonFilter(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          >
            <MenuItem value="">All Seasons</MenuItem>
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
        <Button variant="contained" sx={buttonStyle} onClick={handleFilter} >
          Apply Date Filter
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 1, boxShadow: 4 }}>
        <Table sx={{ minWidth: 650 }} stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeaderCellStyle}>Team A</TableCell>
              <TableCell sx={tableHeaderCellStyle}>Team B</TableCell>
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
              <TableCell sx={tableHeaderCellStyle}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading == true ? (
              <TableSkeleton />
            ) : matches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="subtitle1" color="textSecondary">
                    No Matches found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              matches.map((match) => (
                <TableRow
                  key={match.matchId}
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                    "&:hover": { backgroundColor: "#f1f1f1" },
                  }}
                >
                  <TableCell>{match.teamAName}</TableCell>
                  <TableCell>{match.teamBName}</TableCell>
                  <TableCell>
                    {new Date(match.startDate).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      sx={{ color: colors.secondary, p: 0, mr: 2 }}
                      onClick={() => handleEdit(match.matchId)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      sx={{ color: colors.secondary, p: 0, mr: 2 }}
                      onClick={() => handleDeleteClick(match.matchId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      sx={{ color: colors.secondary, p: 0, mr: 2 }}
                      onClick={() =>
                        handleScoreDashboardNavigation(match.matchId)
                      }
                    >
                      <SpaceDashboardIcon />
                    </IconButton>
                    <IconButton
                      sx={{ color: colors.secondary, p: 0, mr: 2 }}
                      onClick={() => handleMatchPointsNavigation(match.matchId)}
                    >
                      <EmojiEvents />
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
        sx={PaginationButtonStyle}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      <MatchModal
        open={open}
        matchId={selectedMatchId}
        onClose={handleCloseModal}
        isEdit={isEdit}
      />

      <ConfirmationModal
        open={confirmOpen}
        title="Delete Match"
        message="Are you sure you want to delete this Match?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default MatchesPage;
