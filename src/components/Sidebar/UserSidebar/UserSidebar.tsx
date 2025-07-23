import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import { NavLink } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  ListItemIcon,
  Box,
  Collapse,
  ListItemButton,
} from "@mui/material";
import colors from "../../../Colors";
import GavelIcon from "@mui/icons-material/Gavel";
import GroupsIcon from "@mui/icons-material/Groups";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { RoutePaths } from "../../../Constants";

interface UserSidebarProps {
  open: boolean;
  handleDrawerToggle: () => void;
  drawerWidth: number;
}

const UserSidebar: React.FC<UserSidebarProps> = ({
  open,
  handleDrawerToggle,
  drawerWidth,
}) => {
  const [expandAuction, setExpandAuction] = useState<boolean>(true);

  const handleAuctionClick = () => {
    setExpandAuction((prev) => !prev);
  };

  const sidebarOptionsx = {
    color: "white",
    width: "230px",
    mx: "5px",
    borderRadius: "10px",
    "&.active": {
      backgroundColor: colors.activeBg,
      color: "white",
      "& .MuiListItemIcon-root": {
        color: "white",
      },
    },
    "&:hover": {
      backgroundColor: colors.primaryDark,
    },
  } as const;

  return (
    <Drawer
      variant="persistent"
      open={open}
      onClose={handleDrawerToggle}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        position: "fixed",
        "& .MuiDrawer-paper": {
          width: "240px",
          boxSizing: "border-box",
        },
      }}
    >
      {/* Sidebar Content */}
      <Box style={{ backgroundColor: "#213448", height: "100%" }}>
        <Toolbar />
        <List>
          <ListItemButton>
            <ListItem component={NavLink} to="/user/home" sx={sidebarOptionsx}>
              <ListItemIcon>
                <HomeIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
          </ListItemButton>

          <ListItemButton>
            <ListItem
              component={NavLink}
              to="/user/auctions"
              sx={sidebarOptionsx}
              onClick={handleAuctionClick}
            >
              <ListItemIcon>
                <GavelIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Auction" />
              {expandAuction ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
          </ListItemButton>

          <Collapse in={expandAuction} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ ...sidebarOptionsx }}
                component={NavLink}
                to="/user/auctions/my"
              >
                <ListItemIcon>
                  <AssignmentIndIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText primary="My Auctions" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton>
            <ListItem component={NavLink} to="/user/teams" sx={sidebarOptionsx}>
              <ListItemIcon>
                <GroupsIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="My Teams" />
            </ListItem>
          </ListItemButton>
          <ListItemButton>
            <ListItem component={NavLink} to={RoutePaths.UserMatches} sx={sidebarOptionsx}>
              <ListItemIcon>
                <GroupsIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Matches" />
            </ListItem>
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
};

export default UserSidebar;
