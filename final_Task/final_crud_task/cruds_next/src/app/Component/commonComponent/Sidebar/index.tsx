import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Button,
  Modal,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useQuery } from "@apollo/client";
import ListItemIcon from "@mui/material/ListItemIcon";
import MyForm from "../form";
import { Snackbar, SnackbarContent } from "@mui/material";
import useProductMutations from "../../Product/productMutation";
import { GET_PRODUCT, GET_PRODUCT_SIZE } from "../../Product/productQueries";
import DeleteIcon from "@mui/icons-material/Delete";

const SideBarForm = (props: any) => {
  const { deleteProductSize } = useProductMutations();
  const [searchTerm, setSearchTerm] = useState("");
  const { updatedFormData, sizeManage, updateDataForm, SizeCloseModel } = props;
  const [soortedData, setSoortedData] = useState<
    Array<{
      _id: string;
      Colors: string;
      Name: string;
      Code: string;
      Size: string;
    }>
  >([]);
  const [snakOpen, setSnakOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [originalIndex, setOriginalIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    data: productData,
    loading: productLoading,
    error: productError,
  } = useQuery(GET_PRODUCT);
  const {
    data: productSizeData,
    loading: productSizeLoading,
    error: productSizeError,
    refetch,
  } = useQuery(GET_PRODUCT_SIZE);
  const [manageSize, setmanageSize] = useState(productSizeData || {});
  const [products, setProducts] = useState<
    Array<{
      _id: string;
      Colors: string;
      Name: string;
      Code: string;
      Size: string;
    }>
  >([]);
  useEffect(() => {
    if (!productLoading) {
      const dataToSet = sizeManage
        ? productSizeData.ProductSizes
        : productData?.Products;
      setProducts(dataToSet);
    }
  }, [productData, productLoading, sizeManage, productSizeData]);
  const handleListItemClick = (index: number) => {
    console.log("indexforForm", index);
    const originalIndex = products.findIndex(
      (item) => item === sortedData[index]
    );
    setSelectedItem(index);
    setOriginalIndex(originalIndex);
    console.log("originalIndex", originalIndex);
    const selectedData = products[originalIndex];
    if (updateDataForm) {
      updateDataForm(selectedData);
    }
    if (typeof updatedFormData === "function") {
      updatedFormData(selectedData);
    } else {
      console.error("updatedFormData is not a function");
    }
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const filteredData = products?.filter((data) =>
    JSON.stringify(data).toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedData = filteredData
    ? [...filteredData].sort((a, b) => a.Name?.localeCompare(b.Name))
    : [];

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const closeModel = () => {
    setIsModalOpen(false);
  };
  const handleDeleteData = (id: string) => {
    if (originalIndex !== null) {
      console.log("id", id);
      setDeleteItemId(id);
      setIsDeleteDialogOpen(true);
    }
  };
  const handleConfirmDelete = async () => {
    if (deleteItemId) {
      await deleteProductSize(deleteItemId);
      refetch();
      setIsDeleteDialogOpen(false);
      SizeCloseModel();
    }
  };
  const handleSnackbarOpen = () => {
    setSnakOpen(true);
  };
  const handleSnackbarClose = () => {
    setSnakOpen(false);
  };
  return (
    <Grid>
      <Button
        onClick={toggleModal}
        variant="contained"
        color="primary"
        fullWidth
        style={{ display: sizeManage ? "none" : "block" }}
      >
        ADD NEW PRODUCT
      </Button>
      <Modal
        open={isModalOpen}
        onClose={closeModel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ p: 4 }}
      >
        <Box
          // sx={{
          //   position: "absolute",
          //   top: "50%",
          //   left: "50%",
          //   transform: "translate(-50%, -50%)",
          //   bgcolor: "background.paper",
          //   boxShadow: 24,
          //   borderRadius: "5px",
          //   p: 1,
          //   width: "90%",
          //   maxWidth: "700px",
          //   margin: "0px auto",
          //   maxHeight: "700px",
          //   overflowY: "auto",
          // }}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            overflow: "auto",
            maxHeight: "87vh", // Adjust max height as needed
          }}
        >
          <MyForm
            handleCloseForm={closeModel}
            editData={undefined}
            onSnackbarOpen={handleSnackbarOpen}
          />
        </Box>
      </Modal>
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
          message="PRODUCT CREATED SUCCESSFULLY."
        />
      </Snackbar>
      {!updateDataForm && (
        <TextField
          label="Search"
          variant="outlined"
          placeholder="Search by Name"
          fullWidth
          style={{ marginTop: "10px", marginRight: "0px" }}
          value={searchTerm}
          onChange={(e) => {
            const inputValue = e.target.value;
            setSearchTerm(inputValue);
            if (inputValue.length >= 2) {
              const searchWords = inputValue.trim().split(/\s+/);
              const filteredData = products.filter((data) =>
                searchWords.every((word) =>
                  JSON.stringify(data)
                    .toLowerCase()
                    .includes(word.toLowerCase())
                )
              );
              setSoortedData(filteredData);
            } else {
              // Reset to original data if search term is less than 2 characters
              setSoortedData(products);
            }
          }}
        />
      )}

      {sortedData.length === 0 && (
        <p style={{ marginTop: "10px", marginLeft: "14px", color: "red" }}>
          No records found!
        </p>
      )}
      <Grid style={{ maxHeight: "730px", overflowY: "auto" }}>
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
                      handleDeleteData(
                        manageSize.ProductSizes[originalIndex].id
                      )
                    }
                  >
                    <DeleteIcon />
                  </ListItemIcon>
                )}
              </Grid>
            </>
          ))}
        </List>
      </Grid>
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
    </Grid>
  );
};
export default SideBarForm;
