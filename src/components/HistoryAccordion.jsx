import React from "react";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HistoryIcon from "@mui/icons-material/History";
import DeleteIcon from "@mui/icons-material/Delete";

export default function HistoryAccordion({
  historyList,
  isOpen,
  setIsOpen,
  onSelect,
  onDelete,
  onLoadRequest,
}) {
  return (
    <Box sx={{ px: 2, pt: 2, mb: 1 }}>
      <Accordion
        expanded={isOpen}
        onChange={(e, expanded) => {
          setIsOpen(expanded);
          if (expanded) onLoadRequest();
        }}
        sx={{
          bgcolor: "#1e1e1e",
          color: "#fff",
          borderRadius: "30px !important",
          "&:before": { display: "none" },
          mb: 1,
          border: "1px solid #333",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "#FFC400" }} />}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <HistoryIcon sx={{ color: "#FFC400" }} />
            <Typography sx={{ fontWeight: "bold" }}>
              تاریخچه یادداشت‌ها
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ maxHeight: "300px", overflowY: "auto", p: 2 }}>
          <List disablePadding>
            {historyList.length === 0 && (
              <Typography sx={{ textAlign: "center", opacity: 0.5 }}>
                هیچ سابقه ای یافت نشد
              </Typography>
            )}
            {historyList.map((item) => (
              <ListItem
                key={item.$id}
                disablePadding
                sx={{
                  mb: 1.5,
                  bgcolor: "#2c2c2c",
                  borderRadius: "16px",
                  overflow: "hidden",
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={(e) => onDelete(e, item.$id)}
                    sx={{ color: "#ef5350", mr: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemButton onClick={() => onSelect(item)} sx={{ py: 1.5 }}>
                  <ListItemText
                    primary={item.title}
                    secondary={new Date(item.$createdAt).toLocaleString(
                      "fa-IR"
                    )}
                    primaryTypographyProps={{
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                    }}
                    secondaryTypographyProps={{
                      fontSize: "0.8rem",
                      opacity: 0.7,
                    }}
                    sx={{ textAlign: "right", pr: 10}}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
