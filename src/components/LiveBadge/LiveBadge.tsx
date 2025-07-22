import { Box, Typography } from '@mui/material';

const LiveBadge = () => {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        borderRadius: '12px',
      }}
    >
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: 'green',
          animation: 'blink 1s infinite',
          '@keyframes blink': {
            '0%': { opacity: 1 },
            '50%': { opacity: 0 },
            '100%': { opacity: 1 },
          },
        }}
      />
      <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'green' }}>
        LIVE
      </Typography>
    </Box>
  );
};

export default LiveBadge;
