import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Grid2,
  TextField,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { API_URL } from "../../constants";
import axios from "axios";

export default function BillCreation() {
  const session = JSON.parse(sessionStorage.getItem("session"));
  console.log("session", session);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerList, setCustomerList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [formData, setFormData] = useState({
    bill_no: "",
    date: "",
    total_amt: "",
    delivery_charges: "",
    net_amt: "",
    amount_paid: "",
    balance: "",
  });
  const [lineData, setLineData] = useState([
    {
      item_id: "",
      item_name: "",
      rate: "",
      quantity: "",
      total: "",
    },
  ]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      total_amt: calculateTotalAmount(),
      net_amt: calculateNetAmount(),
      balance: calculateBalance(),
    }));
  }, [lineData, formData.delivery_charges, formData.amount_paid]);

  useEffect(() => {
    fetchCustomerList();
    fetchItemList();
  }, []);

  const fetchCustomerList = async () => {
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
    }
  };

  const fetchItemList = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/items/init`, {
        params: {
          service: "GETITEMS",
          company_id: session?.company?.id,
        },
      });

      if (response?.status == 200) {
        const data = response?.data?.rows || [];
        setItemList(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddMore = () => {
    setLineData([
      ...lineData,
      {
        item_id: "",
        item_name: "",
        rate: 0,
        quantity: 0,
        total: 0,
      },
    ]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleInputChange = (index, field, value) => {
    const newLineData = [...lineData];
    if (field == "item_name") {
      console.log("value", value);
      newLineData[index].item_name = value.item_name;
      newLineData[index].item_id = value.id;
    } else {
      newLineData[index][field] = value;
    }

    if (field === "rate" || field === "quantity") {
      const rate = newLineData[index].rate || 0;
      const quantity = newLineData[index].quantity || 0;
      newLineData[index].total = rate * quantity;
    }

    setLineData(newLineData);
  };

  const handleDeleteItem = (index) => {
    if (lineData?.length > 1) {
      const newLineData = [...lineData];
      newLineData.splice(index, 1);
      setLineData(newLineData);
    }
  };

  const calculateTotalAmount = () => {
    return lineData.reduce((acc, line) => acc + (line.total || 0), 0);
  };

  const calculateNetAmount = () => {
    const totalAmount = calculateTotalAmount();
    const deliveryCharges = parseFloat(formData.delivery_charges) || 0;
    return totalAmount + deliveryCharges;
  };

  const calculateBalance = () => {
    const netAmount = calculateNetAmount();
    const amountPaid = parseFloat(formData.amount_paid) || 0;
    return netAmount - amountPaid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCustomer = isNewCustomer
      ? {
          name: formData?.name,
          email: formData?.email,
          mobile_number: formData?.mobile_number,
          address: formData?.address,
        }
      : null;

    const payload = {
      bill_no: formData?.bill_no,
      customer_id: isNewCustomer ? null : selectedCustomer?.id,
      company_id: session?.company?.id,
      user_id: session?.user?.id,
      remarks: formData?.remarks || "",
      total_amount: formData?.total_amt || 0,
      delivery_charges: formData?.delivery_charges || 0,
      net_amount: formData.net_amt || 0,
      total_discount: 0,
      lineData,
      payment_amount: formData?.amount_paid || 0,
      balance: formData?.balance || 0,
      new_customer: newCustomer,
    };
    console.log("submit", payload);

    try {
      
    } catch (error) {}
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader title={"Create Bill"} />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Bill No"
                  size="small"
                  name="bill_no"
                  value={formData?.bill_no}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>
            </Grid>
            <Divider sx={{ my: 1 }} />
            <Paper sx={{ px: 4, py: 2 }}>
              <Box>
                <Typography>Select Customer</Typography>

                <Button
                  onClick={() => {
                    setIsNewCustomer(!isNewCustomer);
                  }}
                  variant="outlined"
                  color="primary"
                >
                  {isNewCustomer ? "Old Customer" : "New Customer"}
                </Button>
              </Box>
              <Grid container spacing={2} sx={{ my: 1 }}>
                {isNewCustomer ? (
                  <>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="Name"
                        variant="outlined"
                        name="name"
                        value={formData?.name}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        size="small"
                        onChange={handleChange}
                        required
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="Mobile Number"
                        variant="outlined"
                        name="mobile_number"
                        value={formData?.value}
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
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        name="email"
                        value={formData?.email}
                        type="email"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        size="small"
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="Address"
                        variant="outlined"
                        name="address"
                        value={formData?.address}
                        multiline
                        rows={2}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        size="small"
                        onChange={handleChange}
                      />
                    </Grid>
                  </>
                ) : (
                  <Grid item xs={3}>
                    <Autocomplete
                      fullWidth
                      size="small"
                      value={selectedCustomer}
                      onChange={(event, newValue) =>
                        setSelectedCustomer(newValue)
                      }
                      options={customerList}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          label="Customer"
                          required
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
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "bold" }}
                            >
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
                    />
                  </Grid>
                )}
              </Grid>
            </Paper>
            <Paper sx={{ px: 4, py: 2, mt: 2 }}>
              <Box>
                <Typography>Select Items</Typography>
              </Box>
              {lineData?.map((line, index) => (
                <Grid container spacing={2} sx={{ my: 1 }} key={index}>
                  <Grid item xs={3}>
                    <Autocomplete
                      fullWidth
                      size="small"
                      value={line || null}
                      onChange={(event, newValue) =>
                        handleInputChange(index, "item_name", newValue)
                      }
                      options={itemList}
                      getOptionLabel={(option) => option.item_name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          label="Item Name"
                          required
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
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "bold" }}
                            >
                              {option.item_name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {option.item_description}
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
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Rate"
                      type="number"
                      size="small"
                      value={line.rate}
                      onChange={(e) =>
                        handleInputChange(index, "rate", e.target.value)
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Quantity"
                      type="number"
                      size="small"
                      value={line.quantity}
                      onChange={(e) =>
                        handleInputChange(index, "quantity", e.target.value)
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      disabled
                      label="Total"
                      size="small"
                      value={line.total}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                    />
                  </Grid>
                  {lineData.length > 1 && (
                    <Grid item xs={1}>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteItem(index)}
                        disabled={lineData.length === 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
              ))}
              <Box>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleAddMore}
                >
                  Add more
                </Button>
              </Box>
            </Paper>
            <Divider sx={{ my: 2 }} />
            <Box
              gap={2}
              sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "30%",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      disabled
                      label="Total Amount"
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={formData.total_amt}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="delivery_charges"
                      type="number"
                      label="Delivery Charges"
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={formData.delivery_charges}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      disabled
                      type="number"
                      label="Net Amount"
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={formData.net_amt}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="amount_paid"
                      type="number"
                      label="Currently Paying"
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={formData.amount_paid}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Balance"
                      size="small"
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={formData.balance}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Remarks"
                    variant="outlined"
                    name="remarks"
                    value={formData?.remarks}
                    multiline
                    rows={3.4}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    size="small"
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Submit
            </Button>
          </CardContent>
        </Card>
      </form>
    </>
  );
}
