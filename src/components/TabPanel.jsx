import { Box } from "@mui/material";

export default function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ height: "100%", display: value === index ? "block" : "none" }}
    >
      {value === index && (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {children}
        </Box>
      )}
    </div>
  );
}
