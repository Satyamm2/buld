import { Suspense, useEffect, useState } from "react";
import "./App.css";
import LoggedInNavbar from "./components/LoggedInNavbar";
import Navbar from "./components/Navbar";
import AppRouter from "./Routes";
import { RouterProvider, Outlet } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { useSelector } from "react-redux";

export function Applayout() {
  const [token, setToken] = useState(null);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    if (getToken) {
      setToken(getToken);
    } else {
      setToken(null);
    }
  }, [isLoggedIn]);

  return (
    <>
      {token ? <LoggedInNavbar /> : <Navbar />}
      <Suspense fallback={<h1>Loading...</h1>}>
        <Outlet context={{ token }} />
      </Suspense>
    </>
  );
}

function App() {
  return (
    <>
      <Provider store={store}>
        <RouterProvider router={AppRouter} />
      </Provider>
    </>
  );
}

export default App;
