import { Box, Typography } from '@mui/material';
import React from 'react';
import colors from '../../Colors';

const ScheduledStatus: React.FC = () => {
  return (
    <Box
      sx={{
        bgcolor: colors.lightPurple,
        width: 'fit-content',
        px: 1,
        borderRadius: 1,
      }}
    >
      <Typography
        variant="caption"
        fontSize={14}
        fontWeight={600}
        color={colors.darkBlue}
      >
        Scheduled
      </Typography>
    </Box>
  );
};

export default ScheduledStatus;
