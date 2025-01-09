import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import CustomCard from "./CustomCard";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../constants";
import axios from "axios";

export default function Dashboard() {
  const session = JSON.parse(sessionStorage.getItem("session"));
  const navigate = useNavigate();
  const [totalBal, setTotalBal] = useState("");

  useEffect(()=>{
    fetchBalance()
  },[])

  const handleCardClick = (title) => {
    if (title == "Create Bill") {
      navigate("/bill/create");
    } else {
      navigate("/bill/list");
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/bill/init`, {
        params: {
          service: "GETALLBILLBALANCE",
          company_id: session?.company?.id,
        },
      });

      if(response?.status==200) {
        const data = response?.data?.rows[0]?.total_balance || ''
        setTotalBal(data)
      }

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <CustomCard
            title="Create Bill"
            content="Generate a new bill for your transactions."
            onClick={() => handleCardClick("Create Bill")}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <CustomCard
            title="Bill Records"
            content="View and manage all your previous bills."
            onClick={() => handleCardClick("Bill Records")}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardHeader title="Total Credit Balance" />
            <Divider />
            <CardContent>
              <Typography variant="h6">Rs: {totalBal ? totalBal: 0.0} </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
