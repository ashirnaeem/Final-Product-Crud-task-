import React, { useState } from "react";
import Button from "@mui/material/Button";
import ConfirmDialog from "../dailog/page";
import DeleteIcon from "@mui/icons-material/Delete";

interface DeleteUserProps {
  onDelete: () => void;
}

const DeleteUser: React.FC<DeleteUserProps> = ({ onDelete }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDialogOpen(true);
  };

  const confirmDelete = () => {
    onDelete();
    setIsDialogOpen(false);
  };

  const cancelDelete = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        id="deleteBtn"
        onClick={handleDeleteClick}
      >
        <DeleteIcon />
        Delete
      </Button>

      <ConfirmDialog
        open={isDialogOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default DeleteUser;
