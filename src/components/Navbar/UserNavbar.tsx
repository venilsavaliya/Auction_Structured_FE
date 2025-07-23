import logo from "../../assets/nav_logo.png";

// import { useAuth } from "../../auth/AuthContext";
// import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
// import PersonAdd from "@mui/icons-material/PersonAdd";
// import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useEffect, useState, type MouseEvent } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import colors from "../../Colors";
import { useNotifications } from "../../Context/NotificationContext";
import NotificationCard from "../NotificationCard/NotificationCard";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { switchStyle } from "../../ComponentStyles";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Redux/Store";
import { fetchCurrentUser, forceLogout } from "../../Redux/Auth/AuthActions";
import { LOGOUT } from "../../Redux/Auth/AuthActionTypes";
import userService from "../../Services/UserService/UserServices";
import type { NotificationStatusChangeRequest } from "../../Models/RequestModels/NotificationStatusChangeRequest";

interface UserNavbarProps {
  handleDrawerToggle: () => void;
  sidebarOpen: boolean;
}

const UserNavbar: React.FC<UserNavbarProps> = ({
  handleDrawerToggle,
  sidebarOpen,
}) => {

  const dispatch = useDispatch();

  const { notifications, fetchNotifications } = useNotifications();

  const [isNotificationOn, setIsNotificationOn] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorNotification, setAnchorNotification] =
    useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const openNotificationMenu = Boolean(anchorNotification);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorNotification(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClose = () => {
    setAnchorNotification(null);
  };

  // const { user, setUser, refreshUser } = useAuth();
  const user = useSelector((state:RootState)=>state.auth.currentUser);

  const navigate = useNavigate();

  useEffect(() => {
    setIsNotificationOn(user?.isNotificationOn ?? false);
  }, [user]);

  const handleNotificationStatusChange = async () => {
    setIsNotificationOn((prev) => !prev);

    const requestBody :NotificationStatusChangeRequest = {
      UserId: parseInt(user?.id??"0"),
      NewStatus: !isNotificationOn,
    };

    try {
      // await axios.post("/user/changenotificationstatus", requestBody);
      await userService.ChangeNotificationStatus(requestBody);
      toast.success(
        `Notifications ${!isNotificationOn ? "Subscribed" : "Unsubscribed"}`
      );
      fetchCurrentUser();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.Message || "Error updating notification status"
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // await axios.post(`/notification/MarkAllNotification/${user?.id}`);
      await userService.MarkAllNotificatioAsRead(parseInt(user?.id??"0"))
      fetchNotifications();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.Message || "Error marking notifications as read"
      );
    }
  };

  const handleLogout = async () => {
    setAnchorEl(null);
    forceLogout();
    // await axios.post("/auth/logout");
    // dispatch({type:LOGOUT});
    // navigate("/login");
  };

  const menuTransformStyle = {
    transform: sidebarOpen ? "translateX(5px)" : "translateX(0px)",
    transition: "transform 0.3s ease",
  };

  return (
    <Box position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <div className="navbar flex flex-row justify-between">
        <Box
          width={"230px"}
          display={"flex"}
          justifyContent={"space-between"}
          gap={2}
          alignItems={"center"}
        >
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ color: "white", mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon fontSize="large" />
          </IconButton>

          <Box sx={{ display: { sm: "block", xs: "none" } }}>
            <img src={logo} alt="" className="navbar_logo" />
          </Box>
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ color: "white", display: { xs: "none", sm: "block" } }}
          >
            <Box display={"flex"} flexDirection={"column"} gap={"3px"}>
              <Box
                width={14}
                bgcolor={"white"}
                height={2}
                sx={menuTransformStyle}
              ></Box>
              <Box width={19} bgcolor={"white"} height={2}></Box>
              <Box
                width={14}
                bgcolor={"white"}
                height={2}
                sx={menuTransformStyle}
              ></Box>
            </Box>
          </IconButton>
        </Box>

        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={2}
        >
          <Tooltip title="Notifications">
            <IconButton
              onClick={(e) => {
                handleNotificationClick(e);
              }}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Badge
                badgeContent={notifications.length}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "red",
                    color: "white",
                  },
                }}
              >
                <NotificationsIcon sx={{ color: "white" }} />
              </Badge>
            </IconButton>
          </Tooltip>

          <Box>
            <Tooltip title="Account ">
              <IconButton
                onClick={(e) => {
                  handleClick(e);
                }}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar
                  sx={{ width: 40, height: 40 }}
                  src={user?.imageUrl}
                ></Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </div>

      <Menu
        anchorEl={anchorEl}
        disableScrollLock={true}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar src={user?.imageUrl} /> My Profile
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {user?.email ? "Logout" : "Login"}
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={anchorNotification}
        disableScrollLock={true}
        id="Notification-menu"
        open={openNotificationMenu}
        onClose={handleNotificationClose}
        // onClick={handleNotificationClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box width={"350px"}>
          <Box
            px={2}
            py={1}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography fontSize={18} fontWeight={600}>
              Notifications
            </Typography>
            <Box>
              <Switch
                sx={switchStyle}
                checked={isNotificationOn}
                onChange={handleNotificationStatusChange}
              />
            </Box>
          </Box>
          <Divider />
          {notifications.length === 0 ? (
            <Box p={2}>
              <Typography>No New Notifications</Typography>
            </Box>
          ) : (
            <>
              <Box
                display={"flex"}
                flexDirection={"column"}
                px={2}
                py={1}
                gap={1}
              >
                {notifications.map((notification) => {
                  return (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                    />
                  );
                })}
              </Box>
              <Divider />
              <Box px={2} pt={1}>
                <Button onClick={handleMarkAllAsRead}>
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    gap={1}
                  >
                    <DoneAllIcon fontSize="small" />
                    <Typography fontSize={12} color={colors.activeBg}>
                      Mark All As Read
                    </Typography>
                  </Box>
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Menu>
    </Box>
  );
};

export default UserNavbar;
