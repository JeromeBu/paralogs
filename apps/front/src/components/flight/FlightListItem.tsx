import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { FlightDTO } from "@paralogs/shared";
import { format } from "date-fns";
import React from "react";

import { formatDuration } from "../../formatDuration";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: theme.spacing(1),
    borderRadius: theme.spacing(1),
    border: `1px solid ${theme.palette.grey[300]}`,
    width: "100%",
  },
}));

export const FlightListItem: React.FC<FlightDTO> = ({
  site,
  date,
  duration,
  time,
}) => {
  const classes = useStyles();
  return (
    <ListItem className={classes.wrapper} button dense>
      <ListItemText
        primary={site}
        secondary={`${format(new Date(date), "dd/MM/yyyy")} ${time}`}
      />
      <ListItemSecondaryAction>
        {formatDuration(duration)}
      </ListItemSecondaryAction>
    </ListItem>
  );
};
