import React from "react";
import { Container, Typography, Box, Paper, Avatar } from "@mui/material";

export default function About() {
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper
        sx={{
          padding: 4,
          backgroundColor: (theme) => theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: 5,
          maxWidth: 800,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            marginBottom: 2,
            fontSize: "2rem",
          }}
        >
          Buld
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.1rem",
            lineHeight: 1.6,
            marginBottom: 3,
          }}
        >
          Innovating the future
        </Typography>
        <Typography
          variant="body2"
          sx={{
            marginTop: 4,
            fontSize: "0.9rem",
            color: "text.secondary",
          }}
        >
          For more information, contact us at:{" "}
          <a href="mailto:smsatyam28@gmail.com">smsatyam28@gmail.com</a>
        </Typography>
      </Paper>
    </Container>
  );
}
