import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import React from "react";

interface DisplayErrorProps {
  errorMessage?: string;
}

const useStyles = makeStyles((theme) => ({
  error: {
    color: theme.palette.error.main,
  },
}));

export const DisplayError: React.FC<DisplayErrorProps> = ({ errorMessage }) => {
  const classes = useStyles();

  if (!errorMessage) return null;
  return (
    <Typography variant="body1" className={classes.error}>
      {errorMessage}
    </Typography>
  );
};
