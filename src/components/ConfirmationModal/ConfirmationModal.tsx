import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import type { IConfirmModalProps } from "./IConfirmationModalProps";
import { buttonStyle } from "../../ComponentStyles";


const ConfirmationModal: React.FC<IConfirmModalProps> = ({
  open,
  title = "Confirm",
  message = "Are you sure?",
  onClose,
  onConfirm,
  confirmText = "Yes",
  cancelText = "Cancel",
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} sx={buttonStyle} variant="contained">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
