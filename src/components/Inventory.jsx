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
import { Close as CloseIcon, Delete as DeleteIcon } from "@mui/icons-material";
import axios from "axios";
import { API_URL } from "../constants";

export default function Inventory() {
  const session = JSON.parse(sessionStorage.getItem("session"));
  const [formData, setFormData] = useState([
    {
      itemname: "",
      item_description: "",
      company_id: session?.company?.id,
      user_id: session?.user?.id,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedFormData = [...formData];
    updatedFormData[index][name] = value;
    setFormData(updatedFormData);
  };

  const handleAddRow = () => {
    setFormData([...formData, { itemname: "", item_description: "" }]);
  };

  const handleDeleteRow = (index) => {
    const updatedFormData = formData.filter((_, i) => i !== index);
    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);
    console.log("formData", formData);
    if(formData?.length==0) {
        setMessage("Add items!")
        setIsLoading(false);
        return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/items/init`, {
        servicename: "ADDITEMS",
        payload: formData,
      });
      if (response?.status == 201) {
        setFormData([{
          itemname: "",
          item_description: "",
          company_id: session?.company?.id,
          user_id: session?.user?.id,
        }]);
        setIsSuccess(true);
        setMessage("Added successfully");
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setMessage("");
  };

  return (
    <Container
      sx={{
        width: "90%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card sx={{ width: "100%" }}>
        <CardHeader sx={{ pb: 1, pt: 1 }} title={`Add Item`} />
        <Divider sx={{ mx: 1, my: 0 }} />
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Box sx={{ mb: 2 }}>
              <Button variant="outlined" color="primary" onClick={handleAddRow}>
                Add Row
              </Button>
            </Box>
            <Grid container spacing={2}>
              {formData?.map((row, index) => (
                <Grid
                  container
                  item
                  xs={12}
                  key={index}
                  spacing={2}
                  alignItems="center"
                >
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Item Name"
                      placeholder="Iron, Ball etc"
                      variant="outlined"
                      name="itemname"
                      value={row.itemname}
                      onChange={(e) => handleChange(e, index)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      size="small"
                      required
                    />
                  </Grid>

                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Item Description"
                      variant="outlined"
                      name="item_description"
                      value={row.item_description}
                      onChange={(e) => handleChange(e, index)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={2}>
                    <IconButton
                      color="primary"
                      onClick={() => handleDeleteRow(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ my: 2 }}>
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
