import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Checkbox,
  IconButton,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { API_URL } from "../../constants";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import BillListDetail from "./BillListDetail";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function BillList() {
  const session = JSON.parse(sessionStorage.getItem("session"));
  const [formData, setFormData] = useState({
    from_date: "",
    to_date: "",
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [rows, setRows] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [viewDetail, setViewDetail] = useState(false);

  useEffect(() => {
    fetchCustomerList();
  }, []);

  const handleCheckboxChange = (event) => {
    setIsCheckedAll(event.target.checked);
  };

  const handleReset = (e) => {
    e.preventDefault();
    setFormData({
      from_date: "",
      to_date: "",
    });
    setSelectedCustomer(null);
  };

  const fetchBillRec = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = isCheckedAll
        ? await axios.get(`${API_URL}/api/bill/init`, {
            params: {
              service: "GETALLBILL",
              company_id: session?.company?.id,
            },
          })
        : await axios.get(`${API_URL}/api/bill/init`, {
            params: {
              service: "GETALLBILLCONDITIONED",
              from_date: formData?.from_date,
              to_date: formData?.to_date,
              customer_id: selectedCustomer?.id,
              company_id: session?.company?.id,
            },
          });
      if (response?.status == 200) {
        const data = response?.data?.rows;
        setRows(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerList = async () => {
    setLoadingCustomers(true);
    try {
      const response = await axios.get(`${API_URL}/api/customer/init`, {
        params: {
          service: "GETCUS",
          company_id: session?.company?.id,
        },
      });
      if (response?.status === 200) {
        const data = response?.data?.rows || [];
        setCustomerList(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const columns = [
    { field: "id", headerName: "Bill Id", width: 200 },
    {
      field: "created_at",
      headerName: "Date",
      width: 200,
      renderCell: (params) => {
        return formatDate(params.row.created_at);
      },
    },
    { field: "bill_no", headerName: "Bill Number", width: 200 },
    { field: "customer_name", headerName: "Customer Name", width: 200 },
    { field: "balance", headerName: "Credit Balance", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleViewDetail(params?.row)}>
            <Visibility />
          </IconButton>
        </>
      ),
    },
  ];

  const handleViewDetail = (bill) => {
    setSelectedBill(bill);
    setViewDetail(true);
  };

  if (viewDetail) {
    return (
      <BillListDetail bill={selectedBill} onBack={() => setViewDetail(false)} />
    );
  }

  return (
    <>
      <form onSubmit={fetchBillRec}>
        <Card>
          <CardHeader title={"Fetch bill records"} />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  fullWidth
                  size="small"
                  value={selectedCustomer}
                  onChange={(event, newValue) => setSelectedCustomer(newValue)}
                  options={customerList}
                  getOptionLabel={(option) => option.name}
                  disabled={isCheckedAll}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      label="Customer"
                      disabled={isCheckedAll}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.05)",
                          },
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                          {option.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {option.mobile_number}
                        </Typography>
                      </Box>
                    </li>
                  )}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value?.id
                  }
                  disableClearable
                  ListboxComponent={(props) => (
                    <ul
                      {...props}
                      style={{
                        maxHeight: 200,
                        overflowY: "auto",
                        padding: 0,
                        margin: 0,
                      }}
                    />
                  )}
                  loading={loadingCustomers}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="From Date"
                  size="small"
                  type="date"
                  fullWidth
                  disabled={isCheckedAll}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formData?.from_date}
                  onChange={(e) =>
                    setFormData({ ...formData, from_date: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="To Date"
                  size="small"
                  type="date"
                  fullWidth
                  disabled={isCheckedAll}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formData?.to_date}
                  onChange={(e) =>
                    setFormData({ ...formData, to_date: e.target.value })
                  }
                />
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isCheckedAll}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Fetch all bills"
              />
            </Box>
            <Box display="flex" gap={1}>
              <Button type="submit" sx={{ mt: 1 }} variant="contained">
                Fetch Bill
              </Button>
              <Button sx={{ mt: 1 }} variant="contained" onClick={handleReset}>
                Reset
              </Button>
            </Box>
          </CardContent>
        </Card>
      </form>

      <Card sx={{ mt: 3 }}>
        <CardHeader title={"Bill Records"} />
        <Divider />
        <CardContent>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            loading={loading}
            sx={{
              "& .MuiDataGrid-scrollbar": {
                ariaHidden: false,
              },
            }}
          />
        </CardContent>
      </Card>
    </>
  );
}
