import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Container,
  Typography,
  Card,
  CardHeader,
  Divider,
  CardContent,
  Box,
  Alert,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import axios from "axios";
import { API_URL } from "../constants";

export default function Customer() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    email: "",
  });
  const session = JSON.parse(sessionStorage.getItem("session"));
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);

    console.log("Form Data Submitted:", formData);

    const payload = {
      name: formData?.name,
      mobile_number: formData?.mobile,
      email: formData?.email,
      address: formData?.address,
      company_id: session?.company?.id,
    };

    try {
      const response = await axios.post(`${API_URL}/api/customer/init`, {
        servicePost: "ADDCUS",
        payload,
      });
      console.log("response", response);
      if (response?.status == 201) {
        setFormData({
          name: "",
          mobile: "",
          address: "",
          email: "",
        });
        setIsSuccess(true);
        setMessage("Added successfully");
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setMessage("");
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card>
        <CardHeader
          sx={{ pb: 1, pt: 1 }}
          title={`Add customer`}
          subheader="Create customer below"
        />
        <Divider sx={{ mx: 1, my: 0 }} />
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  size="small"
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  variant="outlined"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  type="tel"
                  inputProps={{
                    pattern: "[0-9]{3}[0-9]{3}[0-9]{4}",
                    title: "Enter a valid mobile number",
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  type="email"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  variant="outlined"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  multiline
                  rows={2}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  size="small"
                />
              </Grid>
            </Grid>
            <Box sx={{ my: 1 }}>
              <Button
                disabled={isLoading}
                type="submit"
                variant="contained"
                color="primary"
              >
                Add
              </Button>
            </Box>
            {message && (
              <Alert
                severity={isSuccess ? "success" : "error"}
                action={
                    <IconButton
                      size="small"
                      color="inherit"
                      onClick={handleClose}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                }
              >
                {message}
              </Alert>
            )}
          </CardContent>
        </form>
      </Card>
    </Container>
  );
}
