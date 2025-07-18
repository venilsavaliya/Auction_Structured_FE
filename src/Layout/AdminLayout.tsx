import { useState } from "react";
import AdminNavbar from "../components/Navbar/AdminNavbar/AdminNavbar";
import AdminSidebar from "../components/Sidebar/AdminSidebar/AdminSidebar";
import { Outlet } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import type { IAdminLayoutProps } from "./IAdminLayoutProps";

const AdminLayout = (props: IAdminLayoutProps) => {
  const { children } = props;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const drawerWidth = 240;

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AdminNavbar
        handleDrawerToggle={handleDrawerToggle}
        sidebarOpen={sidebarOpen}
      />
      <AdminSidebar
        open={sidebarOpen}
        handleDrawerToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
      />
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
        {/* Main Content */}
        {children || <Outlet />}
      </Box>
    </Box>
  );
};

export default AdminLayout;
