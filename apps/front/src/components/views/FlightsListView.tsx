import Container from "@material-ui/core/Container";
import Fab from "@material-ui/core/Fab";
import List from "@material-ui/core/List";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import { flightActions, RootState } from "@paralogs/front-core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { roundButtonStyle } from "../commun/styles";
import { AddFlightModal } from "../flight/AddFlightModal";
import { FlightListItem } from "../flight/FlightListItem";
import { AddWingModal } from "../wing/AddWingModal";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  listWrapper: {
    width: "100%",
  },
  ...roundButtonStyle(theme),
}));

export const FlightsListView: React.FC = () => {
  const classes = useStyles();
  const isAddFlightFormVisible = useSelector(
    ({ flights }: RootState) => flights.isAddFlightFormVisible,
  );
  const flights = useSelector((state: RootState) => state.flights.data);
  const dispatch = useDispatch();

  return (
    <Container maxWidth="sm" className={classes.paper}>
      <Typography variant="h5">
        Your flights
        {!isAddFlightFormVisible && (
          <Fab
            color="primary"
            className={classes.roundButton}
            onClick={() => dispatch(flightActions.showAddFlightForm())}
          >
            <AddIcon />
          </Fab>
        )}
      </Typography>

      <AddFlightModal
        close={() => dispatch(flightActions.hideAddFlightForm())}
        isOpen={isAddFlightFormVisible}
      />
      <AddWingModal />
      <List className={classes.listWrapper}>
        {flights.map((flight) => (
          <FlightListItem key={flight.uuid} {...flight} />
        ))}
      </List>
    </Container>
  );
};
