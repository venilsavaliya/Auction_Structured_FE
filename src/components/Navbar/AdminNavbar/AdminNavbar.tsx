import React, { useState } from "react";
import logo from "../../../assets/nav_logo.png";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  ListItemIcon,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from "../../../Redux/Auth/AuthActions";
import authService from "../../../Services/Authentication/AuthService";
import { RoutePaths } from "../../../Constants";
import type { RootState } from "../../../Redux/Store";

interface NavbarProps {
  handleDrawerToggle: () => void;
  sidebarOpen: boolean;
}

const AdminNavbar: React.FC<NavbarProps> = ({ handleDrawerToggle, sidebarOpen }) => {
  const user = useSelector((state: RootState) => state.auth.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    dispatch(logOutUser());
    await authService.Logout();
    navigate(RoutePaths.Login);
  };

  const menuTransformStyle = {
    transform: sidebarOpen ? "translateX(5px)" : "translateX(0px)",
    transition: "transform 0.3s ease",
  };

  return (
    <Box
      position="fixed"
      sx={{
        width: "100%",
        height: "60px",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "#213448",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingX: 2,
      }}
    >
      {/* Left: Logo & Sidebar Toggle */}
      <Box
        sx={{
          width: "230px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* Sidebar toggle for small screens */}
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ color: "white", mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon fontSize="large" />
        </IconButton>

        {/* Logo for larger screens */}
        <Box sx={{ display: { sm: "block", xs: "none" } }}>
          <img src={logo} alt="Logo" style={{ height: "40px" }} />
        </Box>

        {/* Sidebar toggle for larger screens with animated bars */}
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ color: "white", display: { xs: "none", sm: "block" } }}
        >
          <Box display={"flex"} flexDirection={"column"} gap={"3px"}>
            <Box width={14} height={2} bgcolor="white" sx={menuTransformStyle} />
            <Box width={19} height={2} bgcolor="white" />
            <Box width={14} height={2} bgcolor="white" sx={menuTransformStyle} />
          </Box>
        </IconButton>
      </Box>

      {/* Right: Avatar / Login Button */}
      <Box display={"flex"} alignItems={"center"} gap={2}>
        {user?.email ? (
          <>
            <Tooltip title="Account">
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar sx={{ width: 40, height: 40 }} src={user?.imageUrl} />
              </IconButton>
            </Tooltip>
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
              <MenuItem>
                <Avatar src={user?.imageUrl} /> My Profile
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box
            component="button"
            onClick={() => navigate("/login")}
            sx={{
              px: 2,
              py: 1,
              borderRadius: "4px",
              color: "white",
              border: "1px solid white",
              backgroundColor: "transparent",
              transition: "all 0.3s",
              "&:hover": {
                backgroundColor: "white",
                color: "black",
              },
            }}
          >
            Login
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminNavbar;
