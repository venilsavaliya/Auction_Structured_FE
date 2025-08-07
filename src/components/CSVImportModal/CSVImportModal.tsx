import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import colors from "../../Colors";
import { toast } from "react-toastify";

interface CSVImportModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<void>;
  title?: string;
  description?: string;
  note?: string;
  loading?: boolean;
}

const CSVImportModal: React.FC<CSVImportModalProps> = ({
  open,
  onClose,
  onImport,
  title = "Import from CSV",
  description = "Select a CSV file to import data",
  note = "Make sure your CSV file contains the required columns.",
  loading = false,
}) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleImport = async () => {
    if (!csvFile) {
      return;
    }
    await onImport(csvFile);
    setCsvFile(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = [".csv", ".xlsx", ".xls"];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      toast.warning("Only .csv, .xlsx, or .xls files are allowed.");
      e.target.value = ""; // Clear invalid file selection
      return;
    }

    setCsvFile(file);
  };

  const handleClose = () => {
    setCsvFile(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          borderBottom: `1px solid ${colors.divider}`,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        📁 {title}
      </DialogTitle>
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              border: `2px dashed ${colors.lightBg}`,
              borderRadius: 2,
              mt: 2,
              p: 3,
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                borderColor: colors.primary,
                bgcolor: "rgba(25, 118, 210, 0.04)",
              },
              bgcolor: csvFile ? "rgba(76, 175, 80, 0.1)" : "transparent",
              borderColor: csvFile ? colors.primary : colors.lightGray,
            }}
            onClick={() => document.getElementById("csv-file-input")?.click()}
          >
            <input
              id="csv-file-input"
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              style={{ display: "none" }}
              onChange={(e) => {
                handleChange(e);
              }}
            />
            {csvFile ? (
              <Box>
                <Typography variant="h6" color="success.main" sx={{ mb: 1 }}>
                  ✓ File Selected
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {csvFile.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(csvFile.size / 1024).toFixed(1)} KB
                </Typography>
              </Box>
            ) : (
              <Box>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  📄 Choose CSV Or Excel File
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click to browse or drag and drop
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ bgcolor: colors.activeBg, p: 2, borderRadius: 1, mb: 2 }}>
          <Typography variant="body2" color="info.contrastText">
            <strong>Note:</strong> {note}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={handleClose}
          color="secondary"
          disabled={loading}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleImport}
          color="primary"
          variant="contained"
          disabled={loading || !csvFile}
          sx={{
            bgcolor: colors.primary,
            minWidth: 100,
            ...(loading && {
              "& .MuiButton-startIcon": {
                animation: "spin 1s linear infinite",
              },
            }),
          }}
        >
          {loading ? "Importing..." : "Import"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CSVImportModal;
