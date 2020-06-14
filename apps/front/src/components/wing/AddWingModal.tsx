import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import SaveIcon from "@material-ui/icons/Save";
import { RootState, wingActions } from "@paralogs/front-core";
import { AddWingDTO, addWingSchema, generateUuid } from "@paralogs/shared";
import { format } from "date-fns";
import { Form, Formik } from "formik";
import * as R from "ramda";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { CenteredModal } from "../commun/CenteredModal";

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: "center",
  },
  field: {
    margin: theme.spacing(1),
    width: "100%",
  },
  button: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
  },
}));

export const AddWingModal: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const close = () => dispatch(wingActions.hideAddWingForm());
  const isOpen = useSelector(
    ({ wings }: RootState) => wings.isAddWingFormVisible,
  );

  const initialValues: AddWingDTO = {
    uuid: generateUuid(),
    brand: "",
    model: "",
    flightTimePriorToOwn: 0,
    ownerFrom: new Date().toUTCString(),
  };

  return (
    <CenteredModal open={isOpen} onClose={close}>
      <Formik
        initialValues={initialValues}
        onSubmit={async (wingValues) => {
          dispatch(
            wingActions.addWingRequested({
              ...wingValues,
              uuid: generateUuid(),
            }),
          );
          close();
        }}
        validationSchema={addWingSchema}
      >
        {({ values, handleChange, submitForm, errors }) => (
          <Form>
            {/* eslint-disable-next-line no-console */}
            {!R.isEmpty(errors) && console.log(errors)}
            <Typography variant="h6" className={classes.title} color="primary">
              Adding a wing
            </Typography>
            <TextField
              className={classes.field}
              variant="standard"
              margin="normal"
              required
              name="brand"
              label="Brand"
              onChange={handleChange}
              value={values.brand}
            />
            <TextField
              className={classes.field}
              variant="standard"
              margin="normal"
              required
              name="model"
              label="Model"
              onChange={handleChange}
              value={values.model}
            />
            <TextField
              className={classes.field}
              type="date"
              margin="normal"
              name="ownerFrom"
              label="Owner from date"
              onChange={handleChange}
              value={format(new Date(values.ownerFrom), "yyyy-MM-dd")}
            />
            {/* <TextField
              className={classes.field}
              type="date"
              margin="normal"
              name="ownerUntil"
              label="Owner until date"
              onChange={handleChange}
              value={values.ownerUntil}
            /> */}
            <TextField
              className={classes.field}
              label="Flight time of the wing when owned"
              variant="standard"
              type="number"
              name="flightTimePriorToOwn"
              onChange={handleChange}
              value={values.flightTimePriorToOwn}
            />
            <Button
              color="primary"
              className={classes.button}
              variant="contained"
              component="button"
              type="submit"
              onClick={submitForm}
            >
              <SaveIcon /> Add this wing
            </Button>
          </Form>
        )}
      </Formik>
    </CenteredModal>
  );
};
