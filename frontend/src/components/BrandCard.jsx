import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { btnStyle, flex } from "../styles/globalStyles";

const BrandCard = ({
  id,
  name,
  image,
  setAddUpdateModalOpen,
  setDeleteModalOpen,
  setDeleteID,
  setInfo,
}) => {
  return (
    <Card
      sx={{
        p: 2,
        width: "300px",
        height: "400px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
      </CardContent>
      <CardMedia
        component="img"
        alt="firm logo"
        image={
          image ||
          "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930"
        }
        sx={{ p: 1, objectFit: "contain", height: "130px" }}
        onError={(e) => {
          e.currentTarget.src =
            "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930";
        }}
      />

      <CardActions sx={flex}>
        <EditIcon
          sx={btnStyle}
          onClick={() => {
            setInfo({ id, name, image });
            setAddUpdateModalOpen(true);
          }}
        />
        <DeleteOutlineIcon
          sx={btnStyle}
          onClick={() => {
            setDeleteID(id);
            setDeleteModalOpen(true);
          }}
        />
      </CardActions>
    </Card>
  );
};

export default BrandCard;
