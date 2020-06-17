import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

import { MyLink } from "../commun/MyLink";

const useStyles = makeStyles((theme) => ({
  link: {
    color: theme.palette.primary.main,
  },
}));

export const HomeView: React.FC = () => {
  const classes = useStyles();
  return (
    <Box padding={2}>
      <p>
        Welcome, got to <MyLink to="flights">Flights</MyLink>
      </p>
      <p>TODO: add dashboard here</p>
      <MyLink to="/flights" className={classes.link}>
        Go to Flights
      </MyLink>{" "}
      &nbsp; | &nbsp;
      <MyLink to="/wings" className={classes.link}>
        Go to Wings
      </MyLink>
    </Box>
  );
};
