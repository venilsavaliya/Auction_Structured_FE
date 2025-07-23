import { Box, Typography } from '@mui/material';
import React from 'react';
import colors from '../../Colors';

const ScheduledBadge: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        backgroundColor: '#e0f2f1',
        px: 1,
        borderRadius: '12px',
      }}
    >
      <Typography variant="caption" sx={{ color: colors.primaryDark }}>
        Scheduled
      </Typography>
    </Box>
  );
};

export default ScheduledBadge;
