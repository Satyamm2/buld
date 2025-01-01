import React, { useState } from "react";
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
} from "@mui/material";

const customers = [
  { id: 1, name: "John Doe", mobile_number: "123-456-7890" },
  { id: 2, name: "Jane Smith", mobile_number: "987-654-3210" },
  { id: 3, name: "Michael Johnson", mobile_number: "555-123-4567" },
  { id: 4, name: "Michael Johnson", mobile_number: "555-123-4567" },
  { id: 5, name: "Michael Johnson", mobile_number: "555-123-4567" },
  { id: 6, name: "Michael Johnson", mobile_number: "555-123-4567" },
  { id: 7, name: "Michael Johnson", mobile_number: "555-123-4567" },
  { id: 8, name: "Michael Johnson", mobile_number: "555-123-4567" },
  { id: 9, name: "Michael Johnson", mobile_number: "555-123-4567" },
];

export default function BillCreation() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleSubmit = () => {
    console.log("submit");
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
                <Button variant="outlined" color="primary">
                  New Customer
                </Button>
              </Box>
              <Grid container spacing={2} sx={{ my: 1 }}>
                <Grid item xs={3}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    value={selectedCustomer}
                    onChange={(event, newValue) =>
                      setSelectedCustomer(newValue)
                    }
                    options={customers}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        label="Customer"
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
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
              </Grid>
            </Paper>
            <Paper sx={{ px: 4, py: 2, mt: 2 }}>
              <Box>
                <Typography>Select Items</Typography>
              </Box>
              <Grid container spacing={2} sx={{ my: 1 }}>
                <Grid item xs={3}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    value={selectedCustomer}
                    onChange={(event, newValue) =>
                      setSelectedCustomer(newValue)
                    }
                    options={customers}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        label="Item Name"
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
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

                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Rate"
                    type="number"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    type="number"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    disabled
                    label="Total"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
              <Box>
                <Button variant="outlined" color="primary">
                  Add more
                </Button>
              </Box>
            </Paper>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
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
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Delivery Charges"
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
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
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Currently Paying"
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
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
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Submit
            </Button>
          </CardContent>
        </Card>
      </form>
    </>
  );
}
