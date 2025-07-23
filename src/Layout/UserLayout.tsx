import React, { useState } from "react";
import UserNavbar from "../components/Navbar/UserNavbar/UserNavbar";
import UserSidebar from "../components/Sidebar/UserSidebar/UserSidebar";
import { Outlet } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";

const drawerWidth = 240;

const UserLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const handleDrawerToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Navbar */}
      <UserNavbar
        handleDrawerToggle={handleDrawerToggle}
        sidebarOpen={sidebarOpen}
      />

      {/* Sidebar */}
      <UserSidebar
        open={sidebarOpen}
        handleDrawerToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: "margin 0.3s, width 0.5s",
          marginLeft: sidebarOpen ? `${drawerWidth}px` : 0,
          width: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)`,
          padding: 2,
          marginTop: "60px",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default UserLayout;
