import React, { useState, SetStateAction } from "react";
import {
  Box,
  Button,
  Grid,
  ListItemText,
  Paper,
  Typography,
  Modal,
} from "@mui/material";
import MyForm from "./commonComponent/form";
import SideBar from "./commonComponent/Sidebar/index";
import DeleteData from "./commonComponent/deleteDialog";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import { Snackbar, SnackbarContent } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { GET_PRODUCT } from "./Product/productQueries";
import useProductMutations from "./Product/productMutation";
import MenuSection from "./commonComponent/MenuBar/index";
import CloseIcon from "@mui/icons-material/Close";
import { useQuery } from "@apollo/client";

const MyApp = () => {
  const [showListing, setShowListing] = useState(false);
  const [snakOpen, setSnakOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { refetch } = useQuery(GET_PRODUCT);
  const [snakMessage, setSnakMessage] = useState("");
  const [displayData, setDisplayData] = useState<{
    _id: string;
    [key: string]: any;
  } | null>(null);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [initialData, setInitialData] = useState<{
    _id: string;
    [key: string]: any;
  } | null>(null);
  const [selectedProductSize, setSelectedProductSize] = useState<string | null>(
    null
  );
  const [displaySize, setDisplaySize] = useState(false);
  const { deleteProduct } = useProductMutations();
  const handleContactClick = () => {
    setShowListing(true);
  };
  const handleProductSize = () => {
    setShowModel(true);
    setDisplaySize(true);
  };
  const handleSizeItemClick = (size: string) => {
    setSelectedProductSize(size);
  };

  const handleButtonClick = () => {
    setShowForm(true);
  };

  const updateFormDataFromSidebar = (selectedData: any) => {
    console.log("selected", selectedData.Image);
    setDisplayData(selectedData);
  };

  const handleEdit = () => {
    console.log("displayData", displayData);
    if (displayData) {
      setEditFormVisible(true);
      setInitialData({ ...displayData });
    }
    setDisplayData(null);
  };

  const handleCloseEditForm = () => {
    setEditFormVisible(false);
    setShowModel(false);
  };
  const handleDelete = async () => {
    if (displayData) {
      deleteProduct(displayData._id);
      // Show success snackbar message
      setSnakMessage("PRODUCT DELETED SUCCESSFULLY");
      setSnakOpen(true);
      refetch();
      setDisplayData(null);
    }
  };
  const handleClick = () => {
    setShowListing(!showListing);
  };
  const handleSnackbarOpen = (message: any) => {
    setSnakMessage(message);
    setSnakOpen(true);
  };
  const handleSnackbarClose = () => {
    setSnakOpen(false);
  };
  return (
    <>
      <ToastContainer />
      <Grid container spacing={2} sx={{ display: "flex" }}>
        <Grid item xs={12} sm={3} lg={3}>
          <Paper elevation={3} style={{ height: "100%", padding: "10px" }}>
            <MenuSection onProductClick={handleClick} />
          </Paper>
        </Grid>
        {showListing && (
          <Grid
            item
            xs={12}
            sm={5}
            md={4}
            lg={3}
            xl={3}
            style={{ cursor: "pointer" }}
          >
            <Paper elevation={3} style={{ height: "100%", padding: "10px" }}>
              <SideBar
                onClick={handleButtonClick}
                updatedFormData={updateFormDataFromSidebar}
              />
            </Paper>
          </Grid>
        )}
        {displayData && (
          <Grid
            item
            xs={12}
            sm={4}
            md={5}
            lg={6}
            xl={6}
            style={{ marginTop: 0 }}
          >
            <Paper elevation={3} style={{ height: "100%", padding: "10px" }}>
              <Grid>
                {displayData && (
                  <Box sx={{ p: 2 }}>
                    <Grid
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        height: "100%",
                      }}
                    >
                      <DeleteData onDeleteData={handleDelete} />
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleEdit}
                      >
                        <EditIcon />
                        Edit
                      </Button>
                    </Grid>
                    {/* #8CBAE8 */}
                    <Typography
                      variant="h6"
                      sx={{ color: " #8CBAE8", fontWeight: "bold" }}
                    >
                      Product Details
                    </Typography>
                    {Object.entries(displayData).map(([key, value]) => {
                      if (
                        key === "__typename" ||
                        key === "_id" ||
                        key === "isEnabled"
                      ) {
                        return null;
                      }
                      return (
                        <>
                          <Grid
                            container
                            direction="row"
                            style={{ display: "flex" }}
                          >
                            {/* Grid for key */}
                            <Grid item xs={6}>
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: "bold",
                                  marginRight: "5px",
                                  textAlign: "right",
                                }}
                              >
                                {key}:
                              </Typography>
                            </Grid>

                            {/* Grid for value */}
                            <Grid item xs={6}>
                              {/* For other fields, render the value as text */}
                              {key !== "Image" && (
                                <Typography
                                  variant="body1"
                                  sx={{
                                    textAlign: "left",
                                    wordWrap: "break-word",
                                    maxWidth: "100%", // Ensure the text can wrap properly
                                    backgroundColor: "transparent",
                                  }}
                                >
                                  {value}
                                </Typography>
                              )}

                              {/* Conditionally render the image outside the container */}
                              {key === "Image" && value && (
                                <Grid container direction="column">
                                  <Grid item>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={value}
                                      alt="Product Image"
                                      style={{
                                        maxWidth: "100%",
                                        maxHeight: "100px",
                                      }}
                                    />
                                  </Grid>
                                </Grid>
                              )}
                            </Grid>
                          </Grid>
                        </>
                      );
                    })}
                  </Box>
                )}
              </Grid>
            </Paper>
          </Grid>
        )}
        <Modal
          open={editFormVisible}
          onClose={handleCloseEditForm}
          aria-labelledby="edit-form-title"
          aria-describedby="edit-form-description"
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
            //   p: 2,
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
              // maxHeight: "700px",
              maxHeight: "87vh", // Adjust max height as needed
            }}
          >
            <MyForm
              editData={initialData}
              handleCloseData={handleCloseEditForm}
              onSnackbarOpen={() =>
                handleSnackbarOpen("PRODUCT UPDATED SUCCESSFULLY")
              }
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
            message={snakMessage}
          />
        </Snackbar>
      </Grid>
    </>
  );
};

export default MyApp;
