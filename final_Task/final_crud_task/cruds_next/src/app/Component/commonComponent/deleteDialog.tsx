import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface IPROPS {
  onDeleteData: any;
}

const DeleteData: React.FC<IPROPS> = ({ onDeleteData }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    // console.log("something", deleteData._id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    onDeleteData();
    handleClose();
  };
  return (
    <Grid>
      {onDeleteData && (
        <Button
          type="button"
          variant="outlined"
          color="primary"
          style={{ marginRight: "6px", borderColor: "orange", color: "orange" }}
          startIcon={<DeleteIcon style={{ color: "orange" }} />}
          onClick={handleOpen}
        >
          Delete
        </Button>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this Product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="outlined">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default DeleteData;
