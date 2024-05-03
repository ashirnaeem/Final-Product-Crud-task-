import React from "react";
import { Grid, Paper, Typography, ListItemText } from "@mui/material";

const MenuSection = ({ onProductClick }: any) => {
  return (
    // <Grid item xs={12} sm={3} lg={3}>
    //   <Paper elevation={3} style={{ height: "100%", padding: "10px" }}>
    <div>
      <Typography variant="h4" style={{ marginBottom: "20px" }}>
        Menu
      </Typography>
      <ListItemText
        primary="Contact"
        style={{ cursor: "pointer", marginBottom: "10px" }}
      />
      <ListItemText
        primary="Job"
        style={{ cursor: "pointer", marginBottom: "10px" }}
      />
      <ListItemText
        onClick={onProductClick}
        primary="Product"
        style={{ cursor: "pointer", marginBottom: "10px" }}
      />
    </div>
    //   </Paper>
    // </Grid>
  );
};

export default MenuSection;
