import { Typography } from "@mui/material";
import React from "react";
import { useRouteError } from "react-router-dom";

export default function Error() {
  const err = useRouteError();

  return (
    <>
      <Typography>Oops!!!</Typography>
      <Typography>Something went wrong</Typography>
      <Typography>
        {err.status}: {err.statusText}
      </Typography>
    </>
  );
}
