import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Container,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { API_URL } from "../constants";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    companyName: "",
    mobileNumber: "",
    comp_reg_no: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSuccess(false);
    setIsLoading(true);

    const payload = {
      firstName: formData?.firstName,
      lastName: formData?.lastName,
      username: formData?.username,
      email: formData?.email,
      companyName: formData?.companyName,
      mobileNumber: formData?.mobileNumber,
      comp_reg_no: formData?.comp_reg_no,
      password: formData?.password,
      confirmPassword: formData?.confirmPassword,
    };

    if (
      payload?.mobileNumber.length > 10 ||
      payload?.mobileNumber.length < 10
    ) {
      setMessage("Mobile number should be of 10 numbers");
      return;
    }

    if (payload?.password !== payload?.confirmPassword) {
      setMessage("Password and Confirm password do not match");
      return;
    }

    if (payload?.password?.length < 8) {
      setMessage("Password should contain 8 letters");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        payload,
      });
      
      if (response?.status == 201) {
        setIsSuccess(true);
        setFormData({
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          companyName: "",
          mobileNumber: "",
          comp_reg_no: "",
          password: "",
          confirmPassword: "",
        });
        setMessage(response?.message || "Registered successfully");
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage(error?.response?.data?.message || "Resigtration failed");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%", padding: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Create a new account
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Mobile Number"
                type="number"
                variant="outlined"
                fullWidth
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Company Name"
                variant="outlined"
                fullWidth
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Company Registration Number"
                variant="outlined"
                fullWidth
                name="comp_reg_no"
                value={formData.comp_reg_no}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Button
              disabled={isLoading}
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Register"
              )}
            </Button>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Link
              sx={{ cursor: "pointer" }}
              underline="hover"
              onClick={() => {
                navigate("/");
              }}
            >
              Alredy have an account?
            </Link>
          </Box>
          {message && (
            <Alert severity={isSuccess ? "success" : "error"}>{message}</Alert>
          )}
        </form>
      </Box>
    </Container>
  );
}
