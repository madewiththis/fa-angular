import SaveIcon from "@mui/icons-material/FileDownload";
import { Button } from "@mui/material";

export default function ExportButton() {
  return (
    <Button
      variant="outlined"
      startIcon={<SaveIcon />}
      sx={{
        textTransform: "none",
        borderRadius: "50px",
        paddingX: 3,
        paddingY: 1,
        fontWeight: 500,
        borderColor: "#e0e0e0",
        color: "#424242",
        "&:hover": {
          borderColor: "#bdbdbd",
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      Export
    </Button>
  );
}
