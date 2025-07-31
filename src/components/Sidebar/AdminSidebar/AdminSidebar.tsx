import { NavLink } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  ListItemIcon,
  Box,
  ListItemButton,
} from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";
import PersonIcon from "@mui/icons-material/Person";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
// import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
// import SettingsIcon from "@mui/icons-material/Settings";
import colors from "../../../Colors";
import type { IAdminSidebarProps } from "./IAdminSidebarProps";
import { RoutePaths } from "../../../Constants";
import EmojiEvents from "@mui/icons-material/EmojiEvents";
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import SensorOccupiedIcon from '@mui/icons-material/SensorOccupied';
import TimelineIcon from '@mui/icons-material/Timeline';

const AdminSidebar = (props: IAdminSidebarProps) => {
  const { open, drawerWidth, handleDrawerToggle } = props;
  const sidebarOptionsx = {
    color: "white",
    width: "230px",
    my:"2px",
    
    borderRadius: "5px",
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
  };

  const ListItemButtonsx =
  {
    padding:0
  }

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
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ backgroundColor: "#213448", height: "100%" }}>
        <Toolbar />
        <List>
          <ListItemButton sx={ListItemButtonsx}>
            <ListItem
              component={NavLink}
              to={RoutePaths.AdminDashboard}
              sx={sidebarOptionsx}
            >
              <ListItemIcon>
                <SpaceDashboardIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
          </ListItemButton>

          <ListItemButton sx={ListItemButtonsx}>
            <ListItem
              component={NavLink}
              to={RoutePaths.AdminAuctions}
              sx={sidebarOptionsx}
            >
              <ListItemIcon>
                <GavelIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Auction" />
            </ListItem>
          </ListItemButton>

          <ListItemButton sx={ListItemButtonsx}>
            <ListItem
              component={NavLink}
              to={RoutePaths.AdminUsers}
              sx={sidebarOptionsx}
            >
              <ListItemIcon>
                <PersonIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItem>
          </ListItemButton>

          <ListItemButton sx={ListItemButtonsx}>
            <ListItem
              component={NavLink}
              to={RoutePaths.AdminTeams}
              sx={sidebarOptionsx}
            >
              <ListItemIcon>
                <SensorOccupiedIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Teams" />
            </ListItem>
          </ListItemButton>

          <ListItemButton sx={ListItemButtonsx}>
            <ListItem
              component={NavLink}
              to={RoutePaths.AdminPlayers}
              sx={sidebarOptionsx}
            >
              <ListItemIcon>
                <PeopleAltIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Players" />
            </ListItem>
          </ListItemButton>

          <ListItemButton sx={ListItemButtonsx}>
            <ListItem
              component={NavLink}
              to={RoutePaths.AdminMatches}
              sx={sidebarOptionsx}
            >
              <ListItemIcon>
                <SportsCricketIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Matches" />
            </ListItem>
          </ListItemButton>

          <ListItemButton sx={ListItemButtonsx}>
            <ListItem
              component={NavLink}
              to={RoutePaths.AdminScoringRules}
              sx={sidebarOptionsx}
            >
              <ListItemIcon>
                <EmojiEvents sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Score" />
            </ListItem>
          </ListItemButton>
          <ListItemButton sx={ListItemButtonsx}>
            <ListItem
              component={NavLink}
              to={RoutePaths.AdminPlayerPoints}
              sx={sidebarOptionsx}
            >
              <ListItemIcon>
                <TimelineIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Players Points" />
            </ListItem>
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;
