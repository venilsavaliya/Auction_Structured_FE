import {
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import  { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import colors from "../../../Colors";
import { buttonStyle } from "../../../ComponentStyles";
import {
  PaginationButtonStyle,
  tableHeaderCellStyle,
  tableHeaderSortLableStyle,
} from "../../../ComponentStyles";
// import axios from "../../../api/axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
// import ConfirmModal from "../../ConfirmationModal/ConfirmModal";
import { toast } from "react-toastify";
// import TeamAddEditModal from "../TeamModal/TeamAddEditModal";
import useDebounce from "../../../hooks/useDebounce";
import PageTitle from "../../../components/PageTitle/PageTitle";
import type { TeamsRequestModel } from "../../../Models/RequestModels/TeamsRequestModel";
import teamService from "../../../Services/TeamService/TeamServices";
import TeamAddEditModal from "../../../components/TeamAddEditModal/TeamAddEditModal";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import TableSkeleton from "../../../components/TableSkeleton/TableSkeleton";

interface team{
    id:number,
    name:string,
    image:string
}

const TeamsPage = () => {
  const [sortBy, setSortBy] = useState<string>("Name");
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState(0);
  const [sortDirection, setSortDirection] = useState<"asc"|"desc">("asc");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0); // MUI is 0-indexed
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [teams, setTeams] = useState<team[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit,setIsEdit] = useState(false);

  const debouncedSearch = useDebounce(search, 1000);

  const handleDeleteClick = (teamId:number) => {
    setSelectedTeamId(teamId);
    setConfirmOpen(true);
  };

  const handleEdit = (teamId:number) => {
    setSelectedTeamId(teamId);
    setIsEdit(true);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
    //   await axios.delete(`/team/${selectedTeamId}`);
        await teamService.Delteteam(selectedTeamId)
      toast.success("Team deleted successfully");
      fetchTeams();
    } catch (err) {
    //   toast.error(err?.response?.data?.Message || "Delete failed");
    } finally {
      setConfirmOpen(false);
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    fetchTeams();
  };

  const fetchTeams = async () => {
    let requestBody: TeamsRequestModel = {
      pageNumber: page + 1, // backend is 1-indexed
      pageSize: rowsPerPage,
      sortBy,
      search: "",
      sortDirection,
    };

    if (search.length >= 3) {
      requestBody = {
        ...requestBody,
        search,
      };
    }
    setLoading(true);
    const res = await teamService.GetTeams(requestBody);
    setLoading(false);
    setTeams(res.items);
    setTotalCount(res.totalCount);
  };

  const handleSort = (field:string) => {
    const isAsc = sortBy === field && sortDirection === "asc";
    setSortBy(field);
    setSortDirection(isAsc ? "desc" : "asc");
  };

  useEffect(() => {
    console.log("called")
    fetchTeams();
  }, [page, rowsPerPage, sortBy, sortDirection]);

  useEffect(() => {
    console.log("called2")
    if (debouncedSearch.length === 0 || debouncedSearch.length >= 3) {
      fetchTeams();
    }
  }, [debouncedSearch]);

  const handleAddClick = () => {
    setSelectedTeamId(0);
    setIsEdit(false);
    setModalOpen(true);
  };
  return (
    <>
      <Box display={"flex"} justifyContent={"space-between"} marginBottom={3}>
        <PageTitle title={"Teams"} />
        <Button
          endIcon={<AddIcon />}
          variant="contained"
          onClick={handleAddClick}
          sx={buttonStyle}
        >
          Add Team
        </Button>
      </Box>

      <Box
        display={"flex"}
        justifyContent={"flex-start"}
        gap={2}
        alignItems={"center"}
        py={2}
      >
        <TextField
          label="Search"
          sx={{ width: "300px" }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 1, boxShadow: 4 }}>
        <Table>
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
              <TableCell sx={tableHeaderCellStyle} align="right">
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {
              loading == true ?
              <TableSkeleton/> :
              teams.length == 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    <Typography variant="subtitle1" color="textSecondary">
                      No Teams found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                teams?.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent={"flex-start"}
                        gap={1}
                      >
                        <Avatar
                          src={team.image}
                          alt={team.name}
                          sx={{ width: 40, height: 40 }}
                        />
                        <span>{team.name}</span>
                      </Box>
                    </TableCell>
  
                    <TableCell align="right">
                      <IconButton
                        sx={{ color: colors.secondary, p: 0, mr: 1 }}
                        size="small"
                        onClick={() => handleEdit(team.id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        sx={{ color: colors.secondary, p: 0 }}
                        size="small"
                        onClick={() => handleDeleteClick(team.id)}
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
      <Box mt={1}>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          sx={PaginationButtonStyle}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0); // reset page on page size change
          }}
        />
      </Box>
     
      <TeamAddEditModal
      open={modalOpen}
      onClose={handleClose}
      isEdit={isEdit}
      teamId={selectedTeamId}/>

      <ConfirmationModal
        open={confirmOpen}
        title="Delete Team"
        message="Are you sure you want to delete this Team?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default TeamsPage;
