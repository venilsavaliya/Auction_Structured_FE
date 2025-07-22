import { Box, Typography } from '@mui/material';

const PendingBadge = () => {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        backgroundColor: '#fff3e0',
        px: 1.5,
        py: 0.5,
        borderRadius: '12px',
      }}
    >
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: '#ff9800',
          animation: 'blink 1s infinite',
          '@keyframes blink': {
            '0%': { opacity: 1 },
            '50%': { opacity: 0 },
            '100%': { opacity: 1 },
          },
        }}
      />
      <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
        PENDING
      </Typography>
    </Box>
  );
};

export default PendingBadge;
