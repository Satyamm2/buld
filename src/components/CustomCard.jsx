import React from "react";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { ArrowForward } from "@mui/icons-material"; 

const CustomCard = ({ title, content, onClick }) => {
  return (
    <Card
      sx={{
        borderRadius: 2,
        border: "1px solid #ccc",
        cursor: "pointer",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
        },
      }}
      onClick={onClick}
    >
      <CardHeader
        sx={{
          pb: 1,
          pt: 1,
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #e0e0e0",
        }}
        title={
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
            {title}
          </Typography>
        }
      />
      <CardContent sx={{ textAlign: "center" }}>
        <ArrowForward sx={{ fontSize: 40, color: "#1976d2", marginBottom: 2 }} />
        <Typography variant="body1">{content}</Typography>
      </CardContent>
    </Card>
  );
};

export default CustomCard;
