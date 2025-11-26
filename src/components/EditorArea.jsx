import React from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/Download";
import SyncIcon from "@mui/icons-material/Sync";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import StopIcon from "@mui/icons-material/Stop";

export default function EditorArea({
  content,
  setContent,
  onSync,
  onSave,
  onExport,
  onVoiceEdit,
  isEditingRecording,
  isEditingProcessing,
}) {
  return (
    // ROOT CONTAINER:
    // 1. overflowY: 'auto' -> Enables scrolling for the whole tab
    // 2. height: '100%' -> Fits within the App content area (below header)
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        bgcolor: "#121212",
        px: 2,
        pb: 5, // Extra padding at bottom for comfortable scrolling
      }}
    >
      {/* Toolbar - Scrolls with the page */}
      <Box
        sx={{
          my: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {/* 1. Magic Mic */}
        <Tooltip title={isEditingRecording ? "توقف" : "ویرایش هوشمند با صدا"}>
          <IconButton
            onClick={onVoiceEdit}
            sx={{
              bgcolor: isEditingRecording ? "#d32f2f" : "#2c2c2c",
              color: isEditingRecording ? "white" : "#FFC400",
              width: 56,
              height: 56,
              borderRadius: "50%",
              border: "1px solid #444",
              "&:hover": { bgcolor: isEditingRecording ? "#b71c1c" : "#444" },
              boxShadow: isEditingRecording
                ? "0 0 15px rgba(244, 67, 54, 0.6)"
                : "none",
              transition: "all 0.3s ease",
              order: { xs: 1, sm: 0 },
            }}
          >
            {isEditingProcessing ? (
              <CircularProgress size={24} color="inherit" />
            ) : isEditingRecording ? (
              <StopIcon sx={{ fontSize: 30 }} />
            ) : (
              <AutoFixHighIcon sx={{ fontSize: 28 }} />
            )}
          </IconButton>
        </Tooltip>

        {/* 2. Update Button */}
        <Button
          variant="outlined"
          onClick={onSync}
          startIcon={<SyncIcon />}
          sx={{
            borderRadius: 50,
            px: 3,
            py: 1.2,
            fontSize: "1rem",
            color: "#90caf9",
            borderColor: "#90caf9",
            minWidth: "130px",
            flexGrow: { xs: 1, sm: 0 },
          }}
        >
          بروزرسانی
        </Button>

        {/* 3. Save Button */}
        <Button
          variant="contained"
          onClick={onSave}
          startIcon={<SaveIcon />}
          color="success"
          sx={{
            borderRadius: 50,
            px: 3,
            py: 1.2,
            fontSize: "1rem",
            fontWeight: "bold",
            minWidth: "110px",
            flexGrow: { xs: 1, sm: 0 },
          }}
        >
          ذخیره
        </Button>

        {/* 4. Export Button */}
        <Button
          variant="contained"
          onClick={onExport}
          startIcon={<DownloadIcon />}
          color="primary"
          sx={{
            borderRadius: 50,
            px: 3,
            py: 1.2,
            fontSize: "1rem",
            fontWeight: "bold",
            minWidth: "110px",
            flexGrow: { xs: 1, sm: 0 },
          }}
        >
          دانلود فایل
        </Button>
      </Box>

      {/* EDITOR PAPER - The "Big Page" */}
      <Paper
        elevation={3}
        sx={{
          // Min Height 100vh -> Forces the container to scroll
          minHeight: "100vh",
          borderRadius: "28px",
          bgcolor: "#1e1e1e",
          border: "1px solid #333",
          display: "flex",
          flexDirection: "column",
          opacity: isEditingProcessing ? 0.6 : 1,
          pointerEvents: isEditingProcessing ? "none" : "auto",
          transition: "opacity 0.3s",
          mb: 4,
        }}
      >
        <TextField
          multiline
          fullWidth
          variant="standard"
          placeholder={
            isEditingProcessing
              ? "هوش مصنوعی در حال ویرایش متن شماست..."
              : "متن نهایی..."
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
          InputProps={{ disableUnderline: true }}
          sx={{
            flex: 1,
            p: 4, // Bigger internal padding
            "& .MuiInputBase-root": {
              alignItems: "flex-start", // Start text at top
              color: "#e0e0e0",
              fontSize: "1.25rem", // Slightly bigger text for readability
              lineHeight: 2,
            },
            // Force the textarea to take up the full parent height
            "& .MuiInputBase-input": {
              minHeight: "85vh !important", // Ensures huge typing area
            },
          }}
        />
      </Paper>
    </Box>
  );
}
