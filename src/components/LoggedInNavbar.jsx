import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Container,
  Box,
  MenuItem,
  Menu,
} from "@mui/material";
import { Link, Navigate } from "react-router-dom";
import { BRAND_NAME } from "../constants";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slice/authSlice";

export default function LoggedInNavbar() {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [inventoryMenuAnchorEl, setInventoryMenuAnchorEl] = useState(null);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
  const session = JSON.parse(sessionStorage.getItem("session"));

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    sessionStorage.clear();
    dispatch(logout());
    <Navigate to="/" replace />;
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleInventoryMenuOpen = (event) => {
    setInventoryMenuAnchorEl(event.currentTarget);
  };

  const handleprofileMenuOpen = (event) => {
    setProfileMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setInventoryMenuAnchorEl(null);
    setProfileMenuAnchorEl(null);
  };

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "#f5f5f5", mb: 4 }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <Typography
                variant="h6"
                color="text.primary"
                sx={{ fontWeight: "bold" }}
              >
                {BRAND_NAME}
              </Typography>
            </Link>
            <Typography sx={{ml:2}} color="text.primary">{`${session?.company?.company_name}`}</Typography>
            <Box>
              <Button color="inherit" onClick={handleInventoryMenuOpen}>
                <Typography variant="button" color="text.primary">
                  Inventory
                </Typography>
              </Button>
              <Menu
                anchorEl={inventoryMenuAnchorEl}
                open={Boolean(inventoryMenuAnchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>
                  <Link
                    to="/inventory/items-add"
                    style={{ textDecoration: "none" }}
                  >
                    Add Items
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Link
                    to="/inventory/items-list"
                    style={{ textDecoration: "none" }}
                  >
                    Item List
                  </Link>
                </MenuItem>
              </Menu>
              <Button color="inherit" onClick={handleMenuOpen}>
                <Typography variant="button" color="text.primary">
                  Customers
                </Typography>
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>
                  <Link to="/cust/ad-ed" style={{ textDecoration: "none" }}>
                    Add Customer
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Link to="/cust/list" style={{ textDecoration: "none" }}>
                    Customer List
                  </Link>
                </MenuItem>
              </Menu>
              <Button color="inherit" onClick={handleprofileMenuOpen}>
                <Typography variant="button" color="text.primary">
                  Settings
                </Typography>
              </Button>
              <Menu
                anchorEl={profileMenuAnchorEl}
                open={Boolean(profileMenuAnchorEl)}
                onClick={handleMenuClose}
              >
                <MenuItem disabled>
                  <Typography>Hello {session?.user?.first_name}</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Link style={{ textDecoration: "none" }}>Logout</Link>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Link to="/about" style={{ textDecoration: "none" }}>
                    About us
                  </Link>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
