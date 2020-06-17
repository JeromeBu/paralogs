import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import { authActions } from "@paralogs/front-core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { authSelectors } from "../../selectors/authSelectors";
import { MyLink } from "./MyLink";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  leftSideLink: {
    display: "block",
    paddingLeft: "1rem",
  },
}));

export const NavBar: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(authSelectors.isAuthenticated);

  return (
    <AppBar position="static" className={classes.root}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <MyLink to="/" className={classes.leftSideLink}>
            <Box display="flex" alignItems="center">
              <HomeIcon /> <p> Paralogs</p>
            </Box>
          </MyLink>
          {isAuthenticated && (
            <>
              <MyLink to="/wings" className={classes.leftSideLink}>
                My Wings
              </MyLink>
              <MyLink to="/flights" className={classes.leftSideLink}>
                My Flights
              </MyLink>
            </>
          )}
        </Box>
        {isAuthenticated ? (
          <Box display="flex" alignItems="center">
            <MyLink to="/account">
              <PersonIcon />
            </MyLink>
            <Button
              color="inherit"
              onClick={() => dispatch(authActions.logoutRequested())}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <MyLink to="login">
            <Button color="inherit">Login</Button>
          </MyLink>
        )}
      </Box>
    </AppBar>
  );
};
