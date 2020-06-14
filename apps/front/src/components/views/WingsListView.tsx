import Container from "@material-ui/core/Container";
import Fab from "@material-ui/core/Fab";
import List from "@material-ui/core/List";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import { RootState, wingActions } from "@paralogs/front-core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { DisplayError } from "../commun/DisplayError";
import { roundButtonStyle } from "../commun/styles";
import { AddWingModal } from "../wing/AddWingModal";
import { WingsListItem } from "../wing/WingsListItem";

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

export const WingsListView: React.FC = () => {
  const classes = useStyles();
  const isAddWingFormVisible = useSelector(
    ({ wings }: RootState) => wings.isAddWingFormVisible,
  );
  const { data: wings, error } = useSelector((state: RootState) => state.wings);
  const dispatch = useDispatch();

  return (
    <Container maxWidth="sm" className={classes.paper}>
      <Typography variant="h5">
        Your wings
        {!isAddWingFormVisible && (
          <Fab
            color="primary"
            className={classes.roundButton}
            onClick={() => dispatch(wingActions.showAddWingForm())}
          >
            <AddIcon />
          </Fab>
        )}
      </Typography>
      <DisplayError errorMessage={error} />
      <AddWingModal />
      <List className={classes.listWrapper}>
        {wings.map((wing) => (
          <WingsListItem key={wing.uuid} {...wing} />
        ))}
      </List>
    </Container>
  );
};
