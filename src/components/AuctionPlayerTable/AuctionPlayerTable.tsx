import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import { useEffect, useRef, useState } from "react";
import PageTitle from "../PageTitle/PageTitle";
import useDebounce from "../../hooks/useDebounce";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import auctionPlayerService from "../../Services/AuctionPlayerService/AuctionPlayerService";
import type { AuctionPlayerDetail } from "../../Models/ResponseModels/AuctionPlayerDetailResponseModel";
import type { AuctionPlayerFilterParams } from "../../Models/RequestModels/AuctionPlayerFilterParams";
import {
  tableHeaderCellStyle,
  tableHeaderSortLableStyle,
  PaginationButtonStyle,
} from "../../ComponentStyles";
import { AuctionPlayerStatus } from "../../Constants";
import { AuctionPlayerStatusDictionary } from "../../constants/AuctionPlayerStatus";
import { PlayerSkillDictionary } from "../../constants/PlayerSkill";
import { ArrowUpward } from "@mui/icons-material";

interface Props {
  auctionId: number;
  handlePickPlayer: (id: number) => {};
  playerSoldUnsoldStatus: boolean;
}

const AuctionPlayerTable = ({
  auctionId,
  handlePickPlayer,
  playerSoldUnsoldStatus,
}: Props) => {
  const [players, setPlayers] = useState<AuctionPlayerDetail[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // Filters & pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("playerName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState(" ");
  const [statusFilter, setStatusFilter] = useState(" ");

  const debouncedSearch = useDebounce(search, 300);

  const skillOptions = [
    { value: "Batsman", label: "Batsman" },
    { value: "Bowler", label: "Bowler" },
    { value: "AllRounder", label: "All-Rounder" },
    { value: "WKBatsman", label: "WK-Batsman" },
    { value: "WKBowler", label: "WK-Bowler" },
  ];

  const statusOptions = [
    { value: "Sold", label: "Sold" },
    { value: "UnSold", label: "Unsold" },
    { value: "UnAuctioned", label: "Unauctioned" },
    { value: "Reshuffled", label: "Reshuffled" },
  ];

  const getStatusColor = (status: string): string => {
    switch (status) {
      case AuctionPlayerStatus.Sold:
        return "#d4edda"; // light green for success
      case AuctionPlayerStatus.UnSold:
        return "#f8d7da"; // light red for failure
      case AuctionPlayerStatus.UnAuctioned:
        return "#fff3cd"; // light yellow for pending
      default:
        return "#e2e3e5"; // light gray as fallback
    }
  };

  const fetchPlayers = async () => {
    const requestBody: AuctionPlayerFilterParams = {
      AuctionId: auctionId,
      pageNumber: page + 1,
      pageSize: rowsPerPage,
      sortBy,
      sortDirection,
      Name: search.trim() || undefined,
      Skill: skillFilter !== " " ? skillFilter : undefined,
      Status: statusFilter !== " " ? statusFilter : undefined,
    };

    const res = await auctionPlayerService.GetAuctionPlayerList(requestBody);
    setPlayers(res.items);
    setTotalCount(res.totalCount);
  };

  // Initial + dependency fetch
  useEffect(() => {
    fetchPlayers();
  }, [
    page,
    rowsPerPage,
    sortBy,
    sortDirection,
    skillFilter,
    statusFilter,
    auctionId,
    playerSoldUnsoldStatus,
  ]);

  useEffect(() => {
    if (debouncedSearch.length === 0 || debouncedSearch.length >= 3) {
      setPage(0);
      fetchPlayers();
    }
  }, [debouncedSearch]);

  const handleSort = (field: string) => {
    const isAsc = sortBy === field && sortDirection === "asc";
    setSortBy(field);
    setSortDirection(isAsc ? "desc" : "asc");
  };

  return (
    <Box>
      <Box display={"flex"} justifyContent={"space-between"} mb={3}>
        <PageTitle title={"Auction Players"} />
      </Box>

      {/* Filters */}
      <Box display="flex" gap={2} alignItems="center" py={2}>
        <TextField
          label="Search by Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 300 }}
        />

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Filter by Skill</InputLabel>
          <Select
            value={skillFilter}
            label="Filter by Skill"
            onChange={(e) => setSkillFilter(e.target.value)}
          >
            <MenuItem value=" ">All</MenuItem>
            {skillOptions.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            label="Filter by Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value=" ">All</MenuItem>
            {statusOptions.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 1, boxShadow: 4 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeaderCellStyle}>
                <TableSortLabel
                  sx={tableHeaderSortLableStyle}
                  active={sortBy === "playerName"}
                  direction={sortBy === "playerName" ? sortDirection : "asc"}
                  onClick={() => handleSort("playerName")}
                >
                  Name
                </TableSortLabel>
              </TableCell>

              <TableCell sx={tableHeaderCellStyle}>
                <TableSortLabel
                  sx={tableHeaderSortLableStyle}
                  active={sortBy === "status"}
                  direction={sortBy === "status" ? sortDirection : "asc"}
                  onClick={() => handleSort("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>

              <TableCell sx={tableHeaderCellStyle}>
                <TableSortLabel
                  sx={tableHeaderSortLableStyle}
                  active={sortBy === "soldPrice"}
                  direction={sortBy === "soldPrice" ? sortDirection : "asc"}
                  onClick={() => handleSort("soldPrice")}
                >
                  Sold Price
                </TableSortLabel>
              </TableCell>

              <TableCell sx={tableHeaderCellStyle}>
                <TableSortLabel
                  sx={tableHeaderSortLableStyle}
                  active={sortBy === "playerSkill"}
                  direction={sortBy === "playerSkill" ? sortDirection : "asc"}
                  onClick={() => handleSort("playerSkill")}
                >
                  Skill
                </TableSortLabel>
              </TableCell>

              <TableCell sx={tableHeaderCellStyle}>
                <TableSortLabel
                  sx={tableHeaderSortLableStyle}
                  active={sortBy === "soldTo"}
                  direction={sortBy === "soldTo" ? sortDirection : "asc"}
                  onClick={() => handleSort("soldTo")}
                >
                  Sold To
                </TableSortLabel>
              </TableCell>
              <TableCell sx={tableHeaderCellStyle}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {players.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="textSecondary">
                    No Players Found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              players.map((p, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box display={'flex'} alignItems={"center"} gap={1}>

                    <Typography fontSize={"small"}>{p.playerName}</Typography>

                    <Typography fontSize={"medium"}>
                      {p.isReshuffled && p.isLeave && (
                        <ArrowDropDownIcon sx={{ color: "red" }} />
                      )}{" "}
                    </Typography>

                    <Typography fontSize={"medium"}>
                      {p.isReshuffled && !p.isLeave && (
                        <ArrowDropUpIcon sx={{ color: "green" }} />
                      )}
                    </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        bgcolor: getStatusColor(p.status),
                        width: "fit-content",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      {AuctionPlayerStatusDictionary[p.status]}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {p.soldPrice > 0
                      ? `₹${p.soldPrice.toLocaleString()}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>{PlayerSkillDictionary[p.playerSkill]}</TableCell>
                  <TableCell>
                    {p.soldTo != null
                      ? p.soldTo.trim() == ""
                        ? "N/A"
                        : p.soldTo
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Pick Player" arrow>
                      <IconButton
                        size="small"
                        onClick={() => handlePickPlayer(p.playerId)}
                        disabled={p.status == AuctionPlayerStatus.Sold}
                      >
                        <AddBoxIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box mt={1}>
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
          sx={PaginationButtonStyle}
        />
      </Box>
    </Box>
  );
};

export default AuctionPlayerTable;
