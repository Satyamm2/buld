import React from "react";
import { Grid } from "@mui/material";
import CustomCard from "./CustomCard"; // Import the CustomCard component

export default function Dashboard() {
  const session = JSON.parse(sessionStorage.getItem("session"));
  console.log("session", session);

  const handleCardClick = (title) => {
    alert(`You clicked on ${title}`);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <CustomCard
          title="Create Bill"
          content="Generate a new bill for your transactions."
          onClick={() => handleCardClick("Create Bill")}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <CustomCard
          title="Bill Records"
          content="View and manage all your previous bills."
          onClick={() => handleCardClick("Bill Records")}
        />
      </Grid>
    </Grid>
  );
}
