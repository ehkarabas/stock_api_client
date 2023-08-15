import Button from "@mui/material/Button";
import { Modal, Paper, Stack, Typography } from "@mui/material";
import useAuthCall from "../../hooks/useAuthCall";
import { deleteModalStyle } from "../../styles/globalStyles";

const ProfileDeleteModal = ({
  currentPassword,
  deleteModalOpen,
  setDeleteModalOpen,
}) => {
  const { userDeleteSelf } = useAuthCall();

  const handleClose = () => {
    setDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    await userDeleteSelf({ current_password: currentPassword });
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
              Would you like to delete your account?
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

export default ProfileDeleteModal;
