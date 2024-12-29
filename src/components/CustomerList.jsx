import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Toolbar,
  Typography,
  Grid,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Edit, Delete, Add, Close as CloseIcon } from "@mui/icons-material";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import axios from "axios";
import { API_URL } from "../constants";
import { useNavigate } from "react-router-dom";

export default function CustomerList() {
  const session = JSON.parse(sessionStorage.getItem("session"));
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState(rows);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/customer/init`, {
        params: {
          service: "GETCUS",
          company_id: session?.company?.id,
        },
      });
      console.log("res", response);

      if (response?.status == 200) {
        const data = response?.data?.rows || [];
        setRows(data);
        setFilteredRows(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDialogOpen = (row) => {
    setDialogData(row);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setMessage("");
    setOpenDialog(false);
    setDialogData(null);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);
    const payload = {
      customer_id: dialogData?.id,
      company_id: session?.company?.id,
      name: dialogData?.name,
      mobile_number: dialogData?.mobile_number,
      email: dialogData?.email,
      address: dialogData?.address,
    };

    if (
      payload?.mobile_number.length > 10 ||
      payload?.mobile_number.length < 10
    ) {
      setMessage("Mobile number should be of 10 numbers");
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/api/customer/init`, {
        servicePut: "UPDATECUS",
        payloadPut: payload,
      });
      console.log("respnse up", response);
      if (response?.status == 200) {
        setIsSuccess(true);
        setMessage("User updated successfully");
        fetchCustomers();
        handleDialogClose();
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage(error?.response?.data?.message || "Server Error");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (row) => {
    setCustomerToDelete(row);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(`${API_URL}/api/customer/init`, {
        params: {
          servicedel: "DELETECUS",
          customer_iddel: customerToDelete?.id,
          company_iddel: session?.company?.id,
        },
      });

      if (response?.status === 200) {
        fetchCustomers();
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const lowerCaseQuery = query.toLowerCase();
    if (rows.length != 0) {
      const filtered = rows.filter(
        (row) =>
          row.name.toLowerCase()?.includes(lowerCaseQuery) ||
          row.mobile_number.includes(query) ||
          row.email.toLowerCase()?.includes(lowerCaseQuery) ||
          row.address.toLowerCase()?.includes(lowerCaseQuery)
      );
      setFilteredRows(filtered);
    }
  };

  const handleClose = () => {
    setMessage("");
  };

  const columns = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "mobile_number", headerName: "Mobile Number", width: 200 },
    { field: "email", headerName: "Email", width: 220 },
    { field: "address", headerName: "Address", width: 250 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleDialogOpen(params.row)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <>
      <Card>
        <CardHeader
          sx={{ pb: 1, pt: 1 }}
          title={`Customer List`}
          subheader=""
        />
        <Divider />
        <CardContent>
          <Toolbar sx={{ m: 0, p: 0 }}>
            <Button
              onClick={() => {
                navigate("/cust/ad-ed");
              }}
              variant="contained"
              color="primary"
              startIcon={<Add />}
            >
              Add Cusomter
            </Button>
            <TextField
              placeholder="Search customers"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ ml: 2, width: 300 }}
            />
          </Toolbar>
          <DataGrid rows={filteredRows} columns={columns} pageSize={5} />
        </CardContent>
      </Card>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        autoFocus
        disableEnforceFocus={false}
      >
        <form onSubmit={handleSaveEdit}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Name"
                  size="small"
                  disabled
                  fullWidth
                  value={dialogData?.name || ""}
                  onChange={(e) =>
                    setDialogData({ ...dialogData, name: e.target.value })
                  }
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Mobile"
                  size="small"
                  type="number"
                  fullWidth
                  value={dialogData?.mobile_number || ""}
                  onChange={(e) =>
                    setDialogData({
                      ...dialogData,
                      mobile_number: e.target.value,
                    })
                  }
                  required
                  margin="dense"
                  inputProps={{
                    pattern: "[0-9]{3}[0-9]{3}[0-9]{4}",
                    title: "Enter a valid mobile number",
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Email"
                  size="small"
                  fullWidth
                  type="email"
                  required
                  value={dialogData?.email || ""}
                  onChange={(e) =>
                    setDialogData({ ...dialogData, email: e.target.value })
                  }
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Address"
                  size="small"
                  fullWidth
                  required
                  value={dialogData?.address || ""}
                  onChange={(e) =>
                    setDialogData({ ...dialogData, address: e.target.value })
                  }
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
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
          </DialogContent>
          <DialogActions>
            <Button
              disabled={isLoading}
              onClick={handleDialogClose}
              color="primary"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        customerName={customerToDelete?.name || ""}
      />
    </>
  );
}
