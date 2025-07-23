import React from 'react';
import { Box, Typography } from '@mui/material';
import colors from '../../Colors';
import { getRelativeTime } from '../../Utility/Utility';

// Define the type for a single notification
interface Notification {
  title: string;
  message: string;
  createdAt: string;
}

// Define props for the component
interface NotificationCardProps {
  notification: Notification;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  return (
    <Box py={1} display="flex" justifyContent="flex-start" alignItems="start" gap={1}>
      <Box height={8} width={8} borderRadius="100%" bgcolor={colors.lightGray} my={1} />
      <Box flex={1}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={600} fontSize={15}>
            {notification?.title}
          </Typography>
          <Typography fontSize={13}>
            {getRelativeTime(notification.createdAt)}
          </Typography>
        </Box>
        <Typography fontSize={13}>{notification?.message}</Typography>
      </Box>
    </Box>
  );
};

export default NotificationCard;
