import Modal, { ModalProps } from "@material-ui/core/Modal";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(1),
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%,-50%)",
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    "&:focus": {
      outline: "none",
    },
  },
}));

export const CenteredModal: React.FC<ModalProps> = ({ children, ...props }) => {
  const classes = useStyles();
  return (
    <Modal {...props}>
      <div className={classes.wrapper}>{children}</div>
    </Modal>
  );
};
