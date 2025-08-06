import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Chip,
  Stack,
  Avatar,
} from "@mui/material";
import { AccessTime, Error, Gavel, History } from "@mui/icons-material";

const AuctionEndedPage = () => {
  return (
    <Box
      sx={{
        height:"100vh",
        // background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Icon with Badge */}
          <Box sx={{ position: "relative", display: "inline-block", mb: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "error.light",
                color: "error.contrastText",
              }}
            >
              <AccessTime sx={{ fontSize: 40 }} />
            </Avatar>
            <Avatar
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                width: 32,
                height: 32,
                bgcolor: "error.main",
                color: "error.contrastText",
              }}
            >
              <Error sx={{ fontSize: 20 }} />
            </Avatar>
          </Box>

          {/* Main Message */}
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              mb: 2,
            }}
          >
            Auction Ended
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              mb: 3,
              lineHeight: 1.6,
              fontWeight: 400,
              fontSize:16
            }}
          >
            Sorry, this auction has finished. You can no longer perform any
            actions on this item.
          </Typography>

          {/* Status Chip */}
          <Chip
            icon={<Error />}
            label="Auction Closed"
            color="error"
            variant="outlined"
            sx={{
              mb: 4,
              fontWeight: "medium",
              "& .MuiChip-icon": {
                color: "error.main",
              },
            }}
          />

          {/* Footer */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mt: 2,
              opacity: 0.7,
            }}
          >
            Thank you for your interest in this auction
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default AuctionEndedPage;
