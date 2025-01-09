import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { API_URL } from "../constants";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slice/authSlice";

export default function Home() {
  const [formData, setFormData] = useState({
    email: "aman@email.com",
    password: "aman",
  });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email: formData?.email,
        password: formData?.password,
      });
      if (response.status == 200) {
        const resdata = response?.data;
        if (resdata) {
          sessionStorage.setItem(
            "session",
            JSON.stringify(resdata?.sessionData)
          );
          localStorage.setItem("token", resdata?.token);
          dispatch(loginSuccess());
          setFormData({
            email: "",
            password: "",
          });
        }
      }
    } catch (error) {
      setMessage(error?.response?.data?.message || "Login failed");
      console.error("error", error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid
        item
        xs={12}
        md={6}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          style={{ padding: "20px", textAlign: "center" }}
        >
          Manage your business with Buld
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          style={{
            width: "80%",
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            padding: "20px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          }}
        >
          <TextField
            name="email"
            label="Email"
            variant="outlined"
            fullWidth
            type="email"
            value={formData?.email}
            onChange={handleInputChange}
            required
          />
          <TextField
            name="password"
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            value={formData?.password}
            onChange={handleInputChange}
            required
          />
          <Button
            disabled={isLoading}
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Login"
            )}
          </Button>
          {message && (
            <Alert severity={isSuccess ? "success" : "error"}>{message}</Alert>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
