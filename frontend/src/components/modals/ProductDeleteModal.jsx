import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { Modal, Paper, Stack, Typography } from "@mui/material";
import useStockCall from "../../hooks/useStockCall";
import { deleteModalStyle } from "../../styles/globalStyles";

const ProductDeleteModal = ({
  deleteID,
  deleteModalOpen,
  setDeleteModalOpen,
}) => {
  const { deleteStockData } = useStockCall();
  const navigate = useNavigate();

  const handleClose = () => {
    setDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    await deleteStockData(deleteID);
    handleClose();
  };

  return (
    <div>
      <Modal
        open={deleteModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper sx={deleteModalStyle} elevation={5}>
          <Stack spacing={2}>
            <Typography variant="h5">
              Would you like to delete this product?
            </Typography>
            <Typography variant="h6">
              This action cannot be revertable.
            </Typography>
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button onClick={handleClose}>No</Button>
              <Button onClick={handleDelete}>Yes</Button>
            </Stack>
          </Stack>
        </Paper>
      </Modal>
    </div>
  );
};

export default ProductDeleteModal;
