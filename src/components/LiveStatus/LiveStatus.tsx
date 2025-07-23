import { Box, Typography } from '@mui/material';
import React from 'react';
import colors from '../../Colors';

const LiveStatus: React.FC = () => {
  return (
    <Box
      sx={{
        bgcolor: colors.lightGreen,
        width: 'fit-content',
        px: 1,
        borderRadius: 1,
      }}
    >
      <Typography
        variant="caption"
        fontSize={14}
        fontWeight={600}
        color="green"
      >
        Live
      </Typography>
    </Box>
  );
};

export default LiveStatus;
