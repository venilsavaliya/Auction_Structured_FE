import { Button, Paper } from '@mui/material';
import React, {type ReactNode } from 'react';

interface BidIncreaseButtonProps {
  children: ReactNode;
  handleClick: () => void;
  disabled?: boolean;
}

const BidIncreaseButton: React.FC<BidIncreaseButtonProps> = ({ children, handleClick, disabled }) => {
  return (
    <Paper elevation={5} sx={{ borderRadius: 2 }}>
      <Button
        disabled={disabled}
        onClick={handleClick}
        color="primary"
        sx={{
          minWidth:150
        }}
      >
        {children}
      </Button>
    </Paper>
  );
};

export default BidIncreaseButton;
