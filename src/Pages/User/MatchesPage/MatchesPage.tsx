import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Avatar,
  Divider,
} from "@mui/material";

// Dummy data for matches
const matches = [
  {
    id: 1,
    teamA: "Mumbai Indians",
    teamB: "Chennai Super Kings",
    teamALogo:
      "https://upload.wikimedia.org/wikipedia/en/2/25/Mumbai_Indians_Logo.svg",
    teamBLogo:
      "https://upload.wikimedia.org/wikipedia/en/8/81/Chennai_Super_Kings_Logo.svg",
    status: "Live",
    startTime: "2024-06-10T18:30:00Z",
    score: "120/3 (15.2)",
  },
  {
    id: 2,
    teamA: "Royal Challengers Bangalore",
    teamB: "Delhi Capitals",
    teamALogo:
      "https://upload.wikimedia.org/wikipedia/en/4/4c/Royal_Challengers_Bangalore_Logo.svg",
    teamBLogo:
      "https://upload.wikimedia.org/wikipedia/en/3/3d/Delhi_Capitals_Logo.svg",
    status: "Upcoming",
    startTime: "2024-06-12T16:00:00Z",
    score: null,
  },
  {
    id: 3,
    teamA: "Kolkata Knight Riders",
    teamB: "Sunrisers Hyderabad",
    teamALogo:
      "https://upload.wikimedia.org/wikipedia/en/9/9a/Kolkata_Knight_Riders_Logo.svg",
    teamBLogo:
      "https://upload.wikimedia.org/wikipedia/en/8/81/Sunrisers_Hyderabad_Logo.svg",
    status: "Completed",
    startTime: "2024-06-08T20:00:00Z",
    score: "180/7 (20)",
  },
];

const statusColor = {
  Live: "#43a047",
  Upcoming: "#1976d2",
  Completed: "#757575",
} as const;

const MatchesPage: React.FC = () => {
  return (
    <Box
      p={3}
      display="flex"
      flexDirection="column"
      alignItems="center"
      minHeight="100vh"
      justifyContent="center"
    >
      <Typography variant="h4" fontWeight={700} mb={3}>
        Matches
      </Typography>
      <Grid
        container
        direction="column"
        spacing={3}
        alignItems="center"
        sx={{ maxWidth: 800, width: "100%" }}
      >
        {matches.map((match) => (
          <Grid
            key={match.id}
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: 6,
                minHeight: 220,
                width: 640,
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-6px) scale(1.03)",
                  boxShadow: 12,
                },
                position: "relative",
                overflow: "visible",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* Status bar */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: 6,
                  bgcolor:
                    statusColor[match.status as keyof typeof statusColor],
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                }}
              />
              <CardContent sx={{ width: "100%" }}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap={2}
                  mb={2}
                >
                  <Avatar
                    src={match.teamALogo}
                    alt={match.teamA}
                    sx={{
                      width: 44,
                      height: 44,
                      bgcolor: "#fff",
                      border: "2px solid #eee",
                    }}
                  />
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ fontSize: 20 }}
                  >
                    {match.teamA}
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="#888">
                    vs
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ fontSize: 20 }}
                  >
                    {match.teamB}
                  </Typography>
                  <Avatar
                    src={match.teamBLogo}
                    alt={match.teamB}
                    sx={{
                      width: 44,
                      height: 44,
                      bgcolor: "#fff",
                      border: "2px solid #eee",
                    }}
                  />
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Chip
                    label={match.status}
                    sx={{
                      bgcolor:
                        statusColor[match.status as keyof typeof statusColor],
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: 14,
                      px: 1.5,
                      letterSpacing: 0.5,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(match.startTime).toLocaleString()}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                {match.score && (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mt={1}
                  >
                    <Typography
                      variant="h4"
                      fontWeight={800}
                      color="primary"
                      sx={{ letterSpacing: 1 }}
                    >
                      {match.score}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MatchesPage;
