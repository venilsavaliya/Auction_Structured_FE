import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  TablePagination,
  TextField,
  Box,
  IconButton,
  TableContainer,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Button,
  Typography,
  Switch,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useRef, useState } from "react";
// import axios from "../../../api/axios";
// import PlayerModal from "../PlayerAddEditModal/PlayerModal";
// import ConfirmModal from "../../ConfirmationModal/ConfirmModal";
import { toast } from "react-toastify";
import PageTitle from "../../../components/PageTitle/PageTitle";
import useDebounce from "../../../hooks/useDebounce";
import {
  PaginationButtonStyle,
  tableHeaderCellStyle,
  tableHeaderSortLableStyle,
  buttonStyle,
  switchStyle,
} from "../../../ComponentStyles";
import colors from "../../../Colors";
import playerService from "../../../Services/PlayerService/PlayerServices";
import type { PlayersFilterParams } from "../../../Models/RequestModels/PlayersFilterParams";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import PlayerModal from "../../../components/PlayerAddEditModal/PlayerModal";
import CSVImportModal from "../../../components/CSVImportModal/CSVImportModal";
import teamService from "../../../Services/TeamService/TeamServices";
import type { team } from "../../../Models/ResponseModels/TeamsResponseModel";
import TableSkeleton from "../../../components/TableSkeleton/TableSkeleton";

interface Player {
  id: string;
  playerId: string;
  name: string;
  imageUrl: string;
  skill: string;
  age: number;
  country: string;
  teamName: string;
  basePrice: number;
  isActive: boolean;
}

const PlayersPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [teams, setTeams] = useState<team[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("Name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState(" ");
  const [teamFilter, setTeamFilter] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState("true");
  const [isEdit, setIsEdit] = useState(false);
  const shouldRefetch = useRef(false);
  const debouncedSearch = useDebounce(search, 300);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importLoading, setImportLoading] = useState(false);

  const skillOptions = [
    { value: "Batsman", label: "Batsman" },
    { value: "Bowler", label: "Bowler" },
    { value: "AllRounder", label: "All-Rounder" },
    { value: "WKBatsman", label: "WK-Batsman" },
    { value: "WKBowler", label: "WK-Bowler" },
  ];

  const fetchPlayers = async () => {
    const requestBody: PlayersFilterParams = {
      pageNumber: page + 1,
      pageSize: rowsPerPage,
      sortBy,
      sortDirection,
      search,
      skill: skillFilter,
      teamId: teamFilter,
      activeStatus: activeFilter !== " " ? activeFilter === "true" : undefined,
    };
    setLoading(true);
    const res = await playerService.GetFilteredPlayers(requestBody);
    setLoading(false);
    setPlayers(res.items);
    setTotalCount(res.totalCount);
  };

  const fetchTeams = async () => {
    const res = await teamService.GetAllTeams();
    setTeams(res.items);
  };

  useEffect(() => {
    fetchTeams();
    fetchPlayers();
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [
    page,
    rowsPerPage,
    sortBy,
    sortDirection,
    skillFilter,
    teamFilter,
    activeFilter,
  ]);

  useEffect(() => {
    if (debouncedSearch.length === 0 || debouncedSearch.length >= 3) {
      fetchPlayers();
    }
  }, [debouncedSearch]);

  const handleSort = (field: string) => {
    const isAsc = sortBy === field && sortDirection === "asc";
    setSortBy(field);
    setSortDirection(isAsc ? "desc" : "asc");
  };

  const handleEdit = (id: number) => {
    // setSelectedPlayer(player);
    setSelectedPlayerId(id);
    setIsEdit(true);
    setModalOpen(true);
  };

  const handleDeleteClick = (playerId: number) => {
    setSelectedPlayerId(playerId);
    setConfirmOpen(true);
  };

  const handleAddClick = () => {
    // setSelectedPlayer(null);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedPlayerId) {
        await playerService.DeltePlayer(selectedPlayerId);
        // await axios.delete(`/player/${selectedPlayerId}`);
        toast.success("Player deleted successfully");
        fetchPlayers();
      }
    } catch {
      toast.error("Failed to delete player");
    } finally {
      setConfirmOpen(false);
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    setIsEdit(false);
    if (shouldRefetch.current) {
      fetchPlayers();
      shouldRefetch.current = false;
    }
  };

  const handleStatusToggle = async (playerId: number, newStatus: boolean) => {
    try {
      const requestBody = {
        playerId: playerId,
        status: newStatus,
      };
      await playerService.UpdatePlayerStatus(requestBody);
      fetchPlayers();
      toast.success("Player status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleImportCsv = async (file: File) => {
    setImportLoading(true);
    try {
      await playerService.ImportPlayersCsv(file);
      toast.success("Players imported successfully!");
      setImportModalOpen(false);
      fetchPlayers();
    } catch (error) {
      toast.error("Failed to import players from CSV.");
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <Box>
      <Box display={"flex"} justifyContent={"space-between"} marginBottom={3}>
        <PageTitle title={"Players"} />
        <Box display="flex" gap={2}>
          <Button
            endIcon={<AddIcon />}
            variant="contained"
            onClick={handleAddClick}
            sx={buttonStyle}
          >
            Add Player
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setImportModalOpen(true)}
            sx={buttonStyle}
          >
            Import CSV
          </Button>
        </Box>
      </Box>
      <Box
        display="flex"
        gap={2}
        justifyContent="flex-start"
        alignItems="center"
        py={2}
      >
        <TextField
          label="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          sx={{ width: "300px" }}
        />

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Filter by Team</InputLabel>
          <Select
            label="Filter by Team"
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
          >
            <MenuItem value="0">All</MenuItem>
            {teams.map((team) => (
              <MenuItem key={team.id} value={team.id}>
                {team.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Filter by Skill</InputLabel>
          <Select
            label="Filter by Skill"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
          >
            <MenuItem value=" ">All</MenuItem>
            {skillOptions.map((skill) => (
              <MenuItem key={skill.value} value={skill.value}>
                {skill.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Filter By Status</InputLabel>
          <Select
            label="Filter by Status"
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
          >
            <MenuItem value=" ">All</MenuItem>
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">InActive</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 1, boxShadow: 4 }}>
        <Table stickyHeader size="medium">
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeaderCellStyle}>
                <TableSortLabel
                  sx={tableHeaderSortLableStyle}
                  active={sortBy === "Name"}
                  direction={sortBy === "Name" ? sortDirection : "asc"}
                  onClick={() => handleSort("Name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell sx={tableHeaderCellStyle}>
                <TableSortLabel
                  sx={tableHeaderSortLableStyle}
                  active={sortBy === "Skill"}
                  direction={sortBy === "Skill" ? sortDirection : "asc"}
                  onClick={() => handleSort("Skill")}
                >
                  Skill
                </TableSortLabel>
              </TableCell>
              <TableCell sx={tableHeaderCellStyle}>
                <TableSortLabel
                  sx={tableHeaderSortLableStyle}
                  active={sortBy === "Age"}
                  direction={sortBy === "Age" ? sortDirection : "asc"}
                  onClick={() => handleSort("Age")}
                >
                  Age
                </TableSortLabel>
              </TableCell>
              <TableCell sx={tableHeaderCellStyle}>
                <TableSortLabel
                  sx={tableHeaderSortLableStyle}
                  active={sortBy === "Country"}
                  direction={sortBy === "Country" ? sortDirection : "asc"}
                  onClick={() => handleSort("Country")}
                >
                  Country
                </TableSortLabel>
              </TableCell>
              <TableCell sx={tableHeaderCellStyle}>
                <TableSortLabel
                  sx={tableHeaderSortLableStyle}
                  active={sortBy === "TeamName"}
                  direction={sortBy === "TeamName" ? sortDirection : "asc"}
                  onClick={() => handleSort("TeamName")}
                >
                  Team
                </TableSortLabel>
              </TableCell>

              <TableCell sx={tableHeaderCellStyle}>
                <TableSortLabel
                  sx={tableHeaderSortLableStyle}
                  active={sortBy === "BasePrice"}
                  direction={sortBy === "BasePrice" ? sortDirection : "asc"}
                  onClick={() => handleSort("BasePrice")}
                >
                  Base Price
                </TableSortLabel>
              </TableCell>
              <TableCell sx={tableHeaderCellStyle}>Is Active</TableCell>
              <TableCell sx={tableHeaderCellStyle}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {
              loading == true ?
              <TableSkeleton cols={8}/> :
              players.length == 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="subtitle1" color="textSecondary">
                      No Players found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                players?.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent={"flex-start"}
                        gap={1}
                      >
                        <Avatar
                          src={player.imageUrl}
                          alt={player.name}
                          sx={{ width: 40, height: 40 }}
                        />
                        <span>{player.name}</span>
                      </Box>
                    </TableCell>
  
                    <TableCell>
                      {skillOptions.find((option) => option.value == player.skill)
                        ?.label || player.skill}
                    </TableCell>
                    <TableCell>{player.age == 0 ? "N/A" : player.age}</TableCell>
                    <TableCell>{player.country}</TableCell>
                    <TableCell>{player.teamName}</TableCell>
                    <TableCell>₹{player.basePrice.toLocaleString()}</TableCell>
                    <TableCell>
                      {/* <Switch
                        checked={player.isActive}
                        sx={switchStyle}
                        onChange={() =>
                          handleStatusToggle(player.playerId, !player.isActive)
                        }
                      /> */}
                      <Switch
                        checked={player.isActive}
                        sx={switchStyle}
                        onChange={() =>
                          handleStatusToggle(
                            parseInt(player.playerId),
                            !player.isActive
                          )
                        }
                      />
                    </TableCell>
  
                    <TableCell>
                      <IconButton
                        sx={{ color: colors.secondary, p: 0, mr: 1 }}
                        onClick={() => handleEdit(parseInt(player.playerId))}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        sx={{ color: colors.secondary, p: 0 }}
                        onClick={() =>
                          handleDeleteClick(parseInt(player.playerId))
                        }
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )
            }
          </TableBody>
        </Table>
      </TableContainer>

      <Box marginTop={1}>
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

      <PlayerModal
        open={modalOpen}
        onClose={handleClose}
        shouldRefetch={shouldRefetch}
        playerId={selectedPlayerId}
        isEdit={isEdit}
        skillOptions={skillOptions}
      />
      <ConfirmationModal
        open={confirmOpen}
        title="Delete Player"
        message="Are you sure you want to delete this player?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
      <CSVImportModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImportCsv}
        title="Import Players from CSV"
        description="Select a CSV file to import player data"
        note="Make sure your file contains the required columns: Name, Skill, Team, Country, Base Price, etc."
        loading={importLoading}
      />
    </Box>
  );
};

export default PlayersPage;
