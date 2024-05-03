import React from "react";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

interface EditProps {
  showUpdateForm: boolean;
  onClick: (data: any) => void;
}

const Edit: React.FC<EditProps> = ({ showUpdateForm, onClick }) => {
  return (
    <Button
      type="submit"
      variant="outlined"
      color="primary"
      id="submitBtn"
      onClick={onClick}
    >
      {showUpdateForm ? <EditIcon /> : <SaveIcon />}
      {showUpdateForm ? "Update" : "Save"}
    </Button>
  );
};

export default Edit;
