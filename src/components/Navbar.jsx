import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Container,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import { BRAND_NAME } from "../constants";

export default function Navbar() {
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
            <Box>
              <Button color="inherit">
                <Link to="/register" style={{ textDecoration: "none" }}>
                  Create account
                </Link>
              </Button>
              <Button color="inherit">
                <Link to="/about" style={{ textDecoration: "none" }}>
                  About
                </Link>
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
