import React from "react";
import {
  Box,
  IconButton,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

export default function MainHeader({
  title,
  setTitle,
  isSaved,
  onSave,
  onNewSession,
  onEnableEdit,
  hasMotherNote,
  tabIndex,
  setTabIndex,
}) {
  return (
    <Box
      sx={{
        px: 2,
        pb: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderBottom: "1px solid #333",
      }}
    >
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <IconButton
          onClick={onNewSession}
          sx={{
            bgcolor: "#333",
            color: "white",
            width: 50,
            height: 50,
            borderRadius: "50%",
            "&:hover": { bgcolor: "#444" },
          }}
        >
          <AddIcon />
        </IconButton>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="عنوان یادداشت..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSaved}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 28,
              bgcolor: "grey.800",
              color: "white",
              fontSize: "1.1rem",
              fontWeight: "bold",
              "& fieldset": { borderColor: "transparent" },
              "&.Mui-focused fieldset": { borderColor: "#FFC400" },
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {isSaved ? (
                  <IconButton
                    onClick={onEnableEdit}
                    edge="end"
                    sx={{ color: "white", mx: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={onSave}
                    edge="end"
                    sx={{ color: "white", mx: 1 }}
                  >
                    <SaveIcon />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {hasMotherNote && (
        <Tabs
          value={tabIndex}
          onChange={(e, v) => setTabIndex(v)}
          variant="fullWidth"
          textColor="inherit"
          indicatorColor="secondary"
          sx={{
            minHeight: "40px",
            "& .MuiTabs-indicator": { backgroundColor: "#FFC400", height: 4 },
          }}
        >
          <Tab
            label="گفتگو و ضبط"
            sx={{ fontSize: "1.1rem", fontWeight: "bold" }}
          />
          <Tab
            label="ویرایشگر متن"
            sx={{ fontSize: "1.1rem", fontWeight: "bold" }}
          />
        </Tabs>
      )}
    </Box>
  );
}
