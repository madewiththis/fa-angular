import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";

export default function NewDocButton() {
  return (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      sx={{
        backgroundColor: "#4fb647",
        "&:hover": {
          backgroundColor: "#45a23e",
        },
        textTransform: "none",
        borderRadius: "50px",
        paddingX: 3,
        paddingY: 1,
        fontWeight: 500,
        marginLeft: 2,
      }}
    >
      New
    </Button>
  );
}
