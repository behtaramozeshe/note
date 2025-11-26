import React from "react";
import { Paper, Typography, Box, IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import EventNoteIcon from "@mui/icons-material/EventNote";

export default function NoteItem({ note }) {
  const date = note.$createdAt
    ? new Date(note.$createdAt).toLocaleString("fa-IR")
    : "...";

  return (
    <Box sx={{ width: "100%", mb: 2 }}>
      <Paper
        elevation={0}
        sx={{
          width: "94vw", // FORCE FULL WIDTH
          p: 2,
          borderRadius: "12px",
          bgcolor: "background.paper",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5, gap: 1 }}>
          <EventNoteIcon fontSize="small" sx={{ color: "#FFC400" }} />
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", color: "text.primary" }}
          >
            {note.title || "یادداشت"}
          </Typography>
        </Box>

        {/* Text content - Forces full block width */}
        <Typography
          variant="body1"
          component="div"
          sx={{
            width: "100%",
            whiteSpace: "pre-wrap",
            lineHeight: 1.8,
            fontSize: "1.1rem",
            color: "text.primary",
            textAlign: "left",
          }}
        >
          {note.text}
        </Typography>

        {/* Footer */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            pt: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {date}
          </Typography>
          <IconButton size="small" sx={{ color: "#90caf9" }}>
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}
