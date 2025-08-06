import { Tooltip, Typography, Box, IconButton, colors } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import type { ScoringRule } from "../../Models/ResponseModels/ScoringRulesResponseModel";
import type React from "react";

interface EventPointsTooltipProps {
  eventPoints: ScoringRule[];
}

const EventPointsTooltip: React.FC<EventPointsTooltipProps> = ({
  eventPoints,
}) => {
  const TooltipContent = () => (
    <Box>
      {eventPoints.map((event) => (
        <Box
          key={event.eventType}
          display="flex"
          justifyContent="space-between"
        >
          <Typography variant="body2">{event.eventType}</Typography>
          <Typography variant="body2" fontWeight={600}>
            {event.points} pts
          </Typography>
        </Box>
      ))}
    </Box>
  );

  return (
    <Tooltip
      title={<TooltipContent />}
      arrow
      placement="right"
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: "background.paper",
            color: "text.primary",
            boxShadow: 1,
            p: 1,
            minWidth: 150,
          },
        },
      }}
    >
      <IconButton size="small">
        <InfoOutlinedIcon />
      </IconButton>
    </Tooltip>
  );
};

export default EventPointsTooltip;
