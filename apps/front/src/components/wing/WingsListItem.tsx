import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { WingDTO } from "@paralogs/shared";
import React from "react";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: theme.spacing(1),
    borderRadius: theme.spacing(1),
    border: `1px solid ${theme.palette.grey[300]}`,
    width: "100%",
  },
}));

export const WingsListItem: React.FC<WingDTO> = ({ model, brand }) => {
  const classes = useStyles();
  return (
    <ListItem className={classes.wrapper} button dense>
      <ListItemText primary={model} />
      <ListItemSecondaryAction>{brand}</ListItemSecondaryAction>
    </ListItem>
  );
};
