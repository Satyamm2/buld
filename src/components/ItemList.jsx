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

export default function ItemList() {
  const session = JSON.parse(sessionStorage.getItem("session"));
  console.log("session", session);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState(rows);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [optionToDelete, setOptionToDelete] = useState(null);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/items/init`, {
        params: {
          service: "GETITEMS",
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
      id: dialogData?.id,
      user_id: session?.user?.id,
      item_description: dialogData?.item_description,
    };

    try {
      const response = await axios.put(`${API_URL}/api/items/init`, {
        servicename: "UPDATEITEMS",
        payload,
      });
      if (response?.status == 200) {
        setIsSuccess(true);
        setMessage("Updated successfully");
        fetchItems();
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
    setOptionToDelete(row);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(`${API_URL}/api/items/init`, {
        params: {
          service: "DELETEITEMS",
          item_id: optionToDelete?.id,
          company_id: session?.company?.id,
          user_id: session?.user?.id,
        },
      });

      if (response?.status === 200) {
        fetchItems();
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
          row.item_name.toLowerCase()?.includes(lowerCaseQuery) ||
          row.item_description.includes(query)
      );
      setFilteredRows(filtered);
    }
  };

  const handleClose = () => {
    setMessage("");
  };

  const columns = [
    { field: "item_name", headerName: "Item Name", width: 200 },
    { field: "item_description", headerName: "Item Description", width: 200 },
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
        <CardHeader sx={{ pb: 1, pt: 1 }} title={`Item List`} subheader="" />
        <Divider />
        <CardContent>
          <Toolbar sx={{ m: 0, p: 0 }}>
            <Button
              onClick={() => {
                navigate("/inventory/items-add");
              }}
              variant="contained"
              color="primary"
              startIcon={<Add />}
            >
              Add Items
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
                  label="Item Name"
                  size="small"
                  disabled
                  fullWidth
                  value={dialogData?.item_name || ""}
                  onChange={(e) =>
                    setDialogData({ ...dialogData, item_name: e.target.value })
                  }
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Item Description"
                  size="small"
                  fullWidth
                  value={dialogData?.item_description || ""}
                  onChange={(e) =>
                    setDialogData({
                      ...dialogData,
                      item_description: e.target.value,
                    })
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
        label={optionToDelete?.item_name || ""}
      />
    </>
  );
}
