import React, { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Applayout } from "./App";
import Home from "./components/Home";
import Error from "./components/Error";
import Dashboard from "./components/Dashboard";
import { useOutletContext } from "react-router-dom";
import Customer from "./components/Customer";
import CustomerList from "./components/CustomerList";
import Inventory from "./components/Inventory";
import ItemList from "./components/ItemList";
import BillCreation from "./components/Bill/BillCreation";
import BillList from "./components/Bill/BillList";

const About = lazy(() => import("./components/About"));
const Register = lazy(() => import("./components/Register"));

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
        children: [
          {
            path: "/inventory/items-add",
            element: (
              <PrivateRoute>
                <Inventory />
              </PrivateRoute>
            ),
          },
          {
            path: "/inventory/items-list",
            element: (
              <PrivateRoute>
                <ItemList />
              </PrivateRoute>
            ),
          },
        ],
      },

      {
        path: "/bill",
        children: [
          {
            path: "/bill/create",
            element: (
              <PrivateRoute>
                <BillCreation />
              </PrivateRoute>
            ),
          },
          {
            path: "/bill/list",
            element: (
              <PrivateRoute>
                <BillList />
              </PrivateRoute>
            ),
          },
        ],
      },
    ],
    errorElement: <Error />,
  },
]);

export default AppRouter;
