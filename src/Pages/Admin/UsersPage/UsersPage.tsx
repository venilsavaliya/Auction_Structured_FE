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
  Typography,
  Button,
  Avatar,
} from "@mui/material";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
//   import axios from "../../../api/axios";
//   import UserModal from "../UserAddEditModal/UserModal";
//   import ConfirmModal from "../../ConfirmationModal/ConfirmModal";
import {
  PaginationButtonStyle,
  tableHeaderCellStyle,
  tableHeaderSortLableStyle,
  buttonStyle,
} from "../../../ComponentStyles";
import colors from "../../../Colors";
import { toast } from "react-toastify";
import PageTitle from "../../../components/PageTitle/PageTitle";
import { changeDateFormat } from "../../../Utility/Utility";
import useDebounce from "../../../hooks/useDebounce";
import userService from "../../../Services/UserService/UserServices";
import type { UserFilterParams } from "../../../Models/RequestModels/UserFilterParams";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import UserModal from "../../../components/UserAddEditModal/UserModal";

interface user {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  role: string;
  image: string;
  gender: string;
  mobileNumber: string;
  isNotificationOn: boolean;
}

const UserPage = () => {
  const [users, setUsers] = useState<user[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const [page, setPage] = useState(0); // MUI is 0-indexed
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [roleFilter, setRoleFilter] = useState("");
  const [sortBy, setSortBy] = useState("Name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const debouncedSearch = useDebounce(search, 300);

  // state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number>(0);

  // delete click handler
  const handleDeleteClick = (userId: number) => {
    setSelectedUserId(userId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await userService.DelteUser(selectedUserId);
      toast.success(res.message);
      fetchUsers(); // refetch list
    } catch (err) {
      // toast.error(err?.response?.data?.Message || "Delete failed");
    } finally {
      setConfirmOpen(false);
    }
  };

  const handleEdit = (id: number) => {
    //   setSelectedUser(user);
    setIsEdit(true);
    setSelectedUserId(id);
    setModalOpen(true);
  };

  const fetchUsers = async () => {
    let requestBody: UserFilterParams = {
      pageNumber: page + 1, // backend is 1-indexed
      pageSize: rowsPerPage,
      sortBy,
      search: "",
      sortDirection,
      role: roleFilter,
    };

    if (search.length >= 3) {
      requestBody = {
        ...requestBody,
        search,
      };
    }

    const res = await userService.GetFilteredUsers(requestBody);

    //   const res = await axios.post(`/user/filter`, requestBody);

    //   const data = await res.data.data;
    setUsers(res.items);
    setTotalCount(res.totalCount);
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, sortBy, sortDirection, roleFilter]);

  useEffect(() => {
    if (debouncedSearch.length === 0 || debouncedSearch.length >= 3) {
      fetchUsers();
    }
  }, [debouncedSearch]);
  const handleSort = (field: string) => {
    const isAsc = sortBy === field && sortDirection === "asc";
    setSortBy(field);
    setSortDirection(isAsc ? "desc" : "asc");
  };

  const handleClose = () => {
    setModalOpen(false);
    setIsEdit(false);
    fetchUsers();
  };

  const handleAddClick = () => {
    setModalOpen(true);
    setIsEdit(false);
    setSelectedUserId(0);
  };

  return (
    <Box>
      <Box>
        <Box display={"flex"} justifyContent={"space-between"} marginBottom={3}>
          <PageTitle title={"Users"} />
          <Button
            endIcon={<AddIcon />}
            variant="contained"
            onClick={handleAddClick}
            sx={buttonStyle}
          >
            Add User
          </Button>
        </Box>
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
            setPage(0); // reset to page 1 on search
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Role</InputLabel>
          <Select
            value={roleFilter}
            label="Filter by Role"
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="User">User</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 1, boxShadow: 4 }}>
        <Table stickyHeader>
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
                  active={sortBy === "Email"}
                  direction={sortBy === "Email" ? sortDirection : "asc"}
                  onClick={() => handleSort("Email")}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell sx={tableHeaderCellStyle}>
                <TableSortLabel
                  sx={tableHeaderSortLableStyle}
                  active={sortBy === "Role"}
                  direction={sortBy === "Role" ? sortDirection : "asc"}
                  onClick={() => handleSort("Role")}
                >
                  Role
                </TableSortLabel>
              </TableCell>
              <TableCell sx={tableHeaderCellStyle}>
                <TableSortLabel
                  sx={tableHeaderSortLableStyle}
                  active={sortBy === "DateOfBirth"}
                  direction={sortBy === "DateOfBirth" ? sortDirection : "asc"}
                  onClick={() => handleSort("DateOfBirth")}
                >
                  DOB
                </TableSortLabel>
              </TableCell>

              <TableCell sx={tableHeaderCellStyle}>Gender</TableCell>

              <TableCell sx={tableHeaderCellStyle}>Mobile Number</TableCell>

              <TableCell sx={tableHeaderCellStyle}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.length == 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="subtitle1" color="textSecondary">
                    No Users found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent={"flex-start"}
                      gap={1}
                    >
                      <Avatar src={user.image} sx={{ width: 40, height: 40 }} />
                      <span>{`${
                        user.firstName +
                        " " +
                        `${user.lastName != null ? user.lastName : ""}`
                      }`}</span>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{changeDateFormat(user.dateOfBirth)}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{user.mobileNumber}</TableCell>
                  <TableCell>
                    {" "}
                    <IconButton
                      sx={{ color: colors.secondary, p: 0, mr: 1 }}
                      onClick={() => handleEdit(user.id)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      sx={{ color: colors.secondary, p: 0 }}
                      onClick={() => handleDeleteClick(user.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
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

      {/* <UserModal
          open={modalOpen}
          onClose={handleClose}
          initialData={selectedUser || {}}
          isEdit={!!selectedUser}
          userId={selectedUser?.id || null}
        /> */}
      <UserModal
        open={modalOpen}
        onClose={handleClose}
        isEdit={isEdit}
        userId={selectedUserId || null}
      />

      <ConfirmationModal
        open={confirmOpen}
        title="Delete User"
        message="Are you sure you want to delete this user?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default UserPage;
