import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Chip,
  IconButton,
} from "@mui/material";
import { Close, EmojiEvents } from "@mui/icons-material";
import type { ScoringRule } from "../../Models/ResponseModels/ScoringRulesResponseModel";
import colors from "../../Colors";
import { color } from "framer-motion";
import { CricketEventType } from "../../constants/CricketEventType";

interface EventInfoModalProps {
  open: boolean;
  onClose: () => void;
  events: ScoringRule[];
  title?: string;
}

const EventInfoModal: React.FC<EventInfoModalProps> = ({
  open,
  onClose,
  events,
  title = "Event Points Information",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(10px)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h5" component="h2" fontWeight="bold">
          {title}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "grey.500",
            "&:hover": {
              backgroundColor: "grey.100",
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Here are the point values for different event types in this auction:
        </Typography>

        <List sx={{ py: 0 }}>
          {events.map((event, index) => (
            <ListItem
              key={index}
              sx={{
                borderRadius: 2,
                mb: 1,
                backgroundColor: "grey.50",
                "&:hover": {
                  backgroundColor: "grey.100",
                },
                transition: "background-color 0.2s ease",
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <EmojiEvents sx={{ color: colors.activeBg }} />
              </ListItemIcon>

              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    fontWeight="medium"
                    sx={{ color: colors.primaryDark }}
                  >
                    {event.eventType}
                  </Typography>
                }
              />

              <Box sx={{ ml: 2 }}>
                <Chip
                  label={`${
                    event.eventType == "Six" ||
                    event.eventType == "Four"
                      ? "+" + event.points
                      : event.points
                  } ${event.points === 1 ? "point" : "points"}`}
                  variant="outlined"
                  size="small"
                  sx={{
                    fontWeight: "bold",
                    minWidth: 80,
                    color: colors.activeBg,
                  }}
                />
              </Box>
            </ListItem>
          ))}
        </List>

        {events.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              color: "text.secondary",
            }}
          >
            <Typography variant="body1">
              No event information available
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            backgroundColor: colors.activeBg,
            px: 3,
            "&:hover": {
              backgroundColor: colors.primaryDark,
            },
          }}
        >
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventInfoModal;
