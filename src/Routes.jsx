import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Applayout } from "./App";
import Home from "./components/Home";
import Error from "./components/Error";
import About from "./components/About";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import { useOutletContext } from "react-router-dom";
import Customer from "./components/Customer";
import CustomerList from "./components/CustomerList";
import Inventory from "./components/Inventory";
import Bill from "./components/Bill";

const HomeOrDashboard = () => {
  const { token } = useOutletContext();

  return token ? <Dashboard /> : <Home />;
};

const PrivateRoute = ({ children }) => {
  const { token } = useOutletContext();
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <Applayout />,
    children: [
      {
        path: "/",
        element: <HomeOrDashboard />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/cust",
        children: [
          {
            path: "/cust/ad-ed",
            element: (
              <PrivateRoute>
                <Customer />
              </PrivateRoute>
            ),
          },
          {
            path: "/cust/list",
            element: (
              <PrivateRoute>
                <CustomerList />
              </PrivateRoute>
            ),
          },
        ],
      },
      {
        path: "/inventory",
        element: (
          <PrivateRoute>
            <Inventory />
          </PrivateRoute>
        ),
      },
      {
        path: "/bill",
        element: (
          <PrivateRoute>
            <Bill />
          </PrivateRoute>
        ),
      },
    ],
    errorElement: <Error />,
  },
]);

export default AppRouter;
