import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  List,
  ListItem,
  ListItemText,
  Avatar,
  ListItemIcon,
  Button,
  Modal,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useQuery } from "@apollo/client";
import { Snackbar, SnackbarContent } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { GET_PRODUCT_SIZE } from "../../../../Graphql/jobQueries";

const SideBarForm = (props: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { SizeCloseModel } = props;
  const [snakOpen, setSnakOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [originalIndex, setOriginalIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productSizes, setProductSizes] = useState<
    Array<{
      _id: string;
      Colors: string;
      Name: string;
      Code: string;
      Size: string;
    }>
  >([]);
  const [sortedData, setSortedData] = useState<
    Array<{
      _id: string;
      Colors: string;
      Name: string;
      Code: string;
      Size: string;
    }>
  >([]);
  const [filteredData, setFilteredData] = useState<
    Array<{
      _id: string;
      Colors: string;
      Name: string;
      Code: string;
      Size: string;
    }>
  >([]);

  const {
    data: productSizeData,
    loading: productSizeLoading,
    error: productSizeError,
    refetch: refetchProductSizes,
  } = useQuery(GET_PRODUCT_SIZE);

  useEffect(() => {
    if (!productSizeLoading && productSizeData) {
      const productSizes = productSizeData.ProductSizes || [];
      setProductSizes(productSizes);
      setFilteredData(productSizes); // Initialize filtered data with all product sizes
    }
  }, [productSizeData, productSizeLoading]);
  useEffect(() => {
    if (searchTerm.trim() === "") {
      // If search term is empty, set sorted data to all product sizes
      setFilteredData(productSizes);
    } else {
      // If search term is provided, filter the product sizes
      const searchWords = searchTerm.trim().split(/\s+/);
      const filteredData = productSizes.filter((data) =>
        searchWords.every((word) =>
          JSON.stringify(data).toLowerCase().includes(word.toLowerCase())
        )
      );
      console.log("Filtered Data:", filteredData);
      setFilteredData(filteredData);
    }
  }, [searchTerm, productSizes]);
  useEffect(() => {
    setSortedData(filteredData);
  }, [filteredData]);

  const handleListItemClick = (index: number) => {
    setSelectedItem(index);
    setOriginalIndex(index);
    // Add your logic here for handling list item click
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleDeleteData = (id: string) => {
    setDeleteItemId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteItemId) {
      // await deleteProductSize(deleteItemId);
      setIsDeleteDialogOpen(false);
      setSnakOpen(true);
      refetchProductSizes(); // Refetch product sizes after deletion
      SizeCloseModel();
    }
  };

  const handleSnackbarClose = () => {
    setSnakOpen(false);
  };
  const name = ["small", "medium", "large", "so large", "asjir ", "yaseen"];
  return (
    <Grid>
      <TextField
        label="Search"
        variant="outlined"
        placeholder="Search by Name"
        fullWidth
        style={{ marginTop: "10px", marginRight: "0px" }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {sortedData.length === 0 && (
        <p style={{ marginTop: "10px", marginLeft: "14px", color: "red" }}>
          No records found!
        </p>
      )}

      <List>
        {sortedData?.map((data, index) => (
          <>
            <Grid style={{ display: "flex" }}>
              <ListItem
                key={index}
                onClick={() => handleListItemClick(index)}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={handleMouseLeave}
                style={{
                  cursor: "pointer",
                  paddingLeft: 0,
                  backgroundColor:
                    selectedItem === index || hoveredItem === index
                      ? "#e0e0e0"
                      : "inherit",
                }}
              >
                <Avatar
                  style={{
                    background: data.Colors,
                  }}
                >
                  {sizeManage
                    ? manageSize?.ProductSizes[index]?.Size.charAt(
                        0
                      ).toUpperCase()
                    : data.Name.charAt(0).toUpperCase()}
                </Avatar>
                <ListItemText
                  primary={
                    sizeManage
                      ? manageSize.ProductSizes[index].Size
                      : `${data.Name} `
                  }
                  sx={{ paddingLeft: 2 }}
                />
              </ListItem>
              {sizeManage && (
                <ListItemIcon
                  style={{
                    marginTop: 15,
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleDeleteData(manageSize.ProductSizes[originalIndex].id)
                  }
                >
                  <DeleteIcon style={{}} />
                </ListItemIcon>
              )}
            </Grid>
          </>
        ))}
      </List>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Size</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this Size?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsDeleteDialogOpen(false)}
            color="primary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            autoFocus
            color="error"
            variant="outlined"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snakOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <SnackbarContent
          style={{
            backgroundColor: "green",
          }}
          message="PRODUCT DELETED SUCCESSFULLY."
        />
      </Snackbar>
    </Grid>
  );
};
export default SideBarForm;
