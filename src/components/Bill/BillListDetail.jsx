import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  IconButton,
  Box,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ArrowBack, Close as CloseIcon } from "@mui/icons-material";
import axios from "axios";
import { API_URL } from "../../constants";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function BillListDetail({ bill, setSelectedBillBack, onBack }) {
  const [formData, setFormData] = useState({
    currently_paying: "",
    balance_left: "",
    payment_remarks: "",
  });
  const [balance, setBalance] = useState(parseFloat(bill.balance));
  const [rows, setRows] = useState([]);
  const [paymentRows, setPaymentRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [makeNewPayment, setMakeNewPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    if (bill) {
      fetchItems();
      fetchPayments();
    }
  }, [bill]);

  useEffect(() => {
    if (formData.currently_paying && bill) {
      const newBalanceLeft = balance - parseFloat(formData.currently_paying);
      setFormData((prevData) => ({
        ...prevData,
        balance_left: newBalanceLeft >= 0 ? newBalanceLeft : 0,
      }));
    }
  }, [formData.currently_paying, bill]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/bill/init`, {
        params: {
          service: "GETALLBILLITEMS",
          bill_id: bill?.id,
          customer_id: bill?.customer_id,
        },
      });
      if (response.status == 200) {
        const data = response?.data?.rows || [];
        setRows(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/bill/init`, {
        params: {
          service: "GETALLBILLPAYMENTHISTORY",
          bill_id: bill?.id,
          customer_id: bill?.customer_id,
        },
      });
      if (response.status == 200) {
        const data = response?.data?.rows || [];
        setPaymentRows(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSuccess(false);
    setIsSubmitting(true);

    const payload = {
      bill_id: bill?.id,
      customer_id: bill?.customer_id,
      payment_amount: formData?.currently_paying,
      balance: formData?.balance_left,
      remarks: formData?.payment_remarks,
    };

    try {
      const response = await axios.post(`${API_URL}/api/bill/init`, {
        servicename: "SETBILLPAYLINE",
        payload,
      });
      if (response?.status == 201) {
        setBalance(parseFloat(formData?.balance_left));

        setSelectedBillBack({
          id: bill?.id,
          balance: formData?.balance_left,
        });

        setFormData({
          currently_paying: "",
          balance_left: "",
          payment_remarks: "",
        });

        setIsSuccess(true);
        fetchPayments();
        setMakeNewPayment(false);
        setMessage("Success");
      }
    } catch (error) {
      setMessage(error?.response?.data?.message || "Something went wrong!!");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setMessage("");
  };

  const columns = [
    { field: "id", headerName: "", width: 100 },
    {
      field: "created_at",
      headerName: "Date",
      width: 200,
      renderCell: (params) => {
        return formatDate(params.row.created_at);
      },
    },
    { field: "item_name", headerName: "Item Name", width: 200 },
    { field: "item_description", headerName: "Item Description", width: 200 },
    { field: "quantity", headerName: "Quantity", width: 200 },
    { field: "rate", headerName: "Rate", width: 200 },
    { field: "total", headerName: "Total", width: 200 },
  ];

  const paycolumns = isMobile
    ? [
        {
          field: "created_at",
          headerName: "Date",
          width: 150,
          renderCell: (params) => {
            return formatDate(params.row.created_at);
          },
        },
        { field: "payment_amount", headerName: "Amount", width: 150 },
        { field: "balance", headerName: "Credit Balance", width: 150 },
      ]
    : [
        { field: "id", headerName: "", width: 100 },
        {
          field: "created_at",
          headerName: "Date",
          width: 200,
          renderCell: (params) => {
            return formatDate(params.row.created_at);
          },
        },
        { field: "payment_amount", headerName: "Amount", width: 200 },
        { field: "remarks", headerName: "Remarks", width: 200 },
        {
          field: "balance",
          headerName: "Credit Balance after pay",
          width: 200,
        },
      ];

  return (
    <>
      <Card sx={{ mt: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
          <IconButton disabled={isSubmitting} onClick={onBack}>
            <ArrowBack />
          </IconButton>
        </Box>
        <CardHeader title="Bill Detail" />
        <Divider />
        <CardContent>
          <Box display="flex" justifyContent="space-between">
            <Box width="100%">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Customer Name"
                    value={bill.customer_name}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Date"
                    value={formatDate(bill.created_at)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Bill Number"
                    value={bill.bill_no}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Remarks"
                    multiline
                    value={bill?.remarks}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
            <Box width="100%">
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      size="small"
                      fullWidth
                      label="Credit Balance"
                      value={balance || ""}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  {makeNewPayment && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          size="small"
                          fullWidth
                          type="number"
                          label="Currently paying"
                          value={formData?.currently_paying}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              currently_paying: e.target.value,
                            })
                          }
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          size="small"
                          fullWidth
                          disabled
                          type="number"
                          label="Balance Left"
                          value={formData?.balance_left}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              balance_left: e.target.value,
                            })
                          }
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          size="small"
                          fullWidth
                          label="Remarks"
                          value={formData?.payment_remarks}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              payment_remarks: e.target.value,
                            })
                          }
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12} sm={6}>
                    {makeNewPayment ? (
                      <>
                        <Box display="flex" gap={2}>
                          <Button
                            disabled={isSubmitting}
                            variant="contained"
                            onClick={() => setMakeNewPayment(!makeNewPayment)}
                          >
                            {isSubmitting ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              "Cancel"
                            )}
                          </Button>
                          <Button
                            disabled={isSubmitting}
                            type="submit"
                            variant="contained"
                          >
                            {isSubmitting ? "Adding.." : "Add Payment"}
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          onClick={() => setMakeNewPayment(!makeNewPayment)}
                        >
                          Add New Payment
                        </Button>
                      </>
                    )}
                  </Grid>
                  {message && (
                    <Grid item xs={12} sm={12}>
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
                    </Grid>
                  )}
                </Grid>
              </form>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography>Items</Typography>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              pageSize={5}
              sx={{
                "& .MuiDataGrid-scrollbar": {
                  ariaHidden: false,
                },
              }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />
          <Box
            gap={2}
            sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: { xs: "100%", md: "30%" },
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Total Amount"
                    multiline
                    value={bill?.total_amount}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Delivery Charges"
                    multiline
                    value={bill?.delivery_charges}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Net Amount"
                    multiline
                    value={bill?.net_amount}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Card sx={{ mt: 2 }}>
        <CardHeader title="Payment History" />
        <CardContent>
          <DataGrid
            rows={paymentRows}
            columns={paycolumns}
            loading={loading}
            pageSize={5}
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
