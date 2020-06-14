import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import { flightActions, RootState, wingActions } from "@paralogs/front-core";
import { AddFlightDTO, generateUuid } from "@paralogs/shared";
import { format } from "date-fns";
import { Form, Formik } from "formik";
import * as R from "ramda";
import React, { useState } from "react";
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

interface AddFlightModalProps {
  isOpen: boolean;
  close: () => void;
}

export const AddFlightModal: React.FC<AddFlightModalProps> = ({
  close,
  isOpen,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const wings = useSelector((state: RootState) => state.wings.data);

  const initialWingId = wings[0]?.uuid ?? "";

  const defaultValues: AddFlightDTO = {
    uuid: generateUuid(),
    site: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "14:30",
    duration: 60,
    wingUuid: initialWingId,
  };

  const [cachedValues, setCachedValues] = useState(defaultValues);
  const initialValues = { ...cachedValues, wingUuid: initialWingId };

  return (
    <CenteredModal open={isOpen} onClose={close}>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={async (values) => {
          dispatch(
            flightActions.addFlightRequested({
              ...values,
              uuid: generateUuid(),
            }),
          );
          close();
        }}
      >
        {({ values, handleChange, submitForm, errors }) => (
          <Form>
            {/* eslint-disable-next-line no-console */}
            {!R.isEmpty(errors) && console.log({ validationsErrors: errors })}
            <Typography variant="h6" className={classes.title} color="primary">
              Adding a flight
            </Typography>
            <TextField
              className={classes.field}
              margin="normal"
              required
              name="site"
              label="Site"
              onChange={handleChange}
              value={values.site}
            />
            <div>
              <Select
                className={classes.field}
                value={values.wingUuid}
                name="wingId"
                onChange={(e) => {
                  if (e.target.value === "addNewWing") {
                    setCachedValues(values);
                    dispatch(wingActions.showAddWingForm());
                    return;
                  }
                  handleChange(e);
                }}
              >
                <MenuItem value="addNewWing" key="addNewWing">
                  <AddIcon /> Add new wing
                </MenuItem>
                {wings.map((wing) => (
                  <MenuItem value={wing.uuid} key={wing.uuid}>
                    {wing.brand} {wing.model}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <TextField
              className={classes.field}
              type="date"
              margin="normal"
              name="date"
              label="Date"
              onChange={handleChange}
              value={values.date}
            />
            <TextField
              className={classes.field}
              label="TakeOf time"
              type="time"
              name="time"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300,
              }}
              onChange={handleChange}
              value={values.time}
            />
            <TextField
              className={classes.field}
              label="Flight duration"
              type="number"
              name="duration"
              onChange={handleChange}
              value={values.duration}
            />
            <Button
              color="primary"
              className={classes.button}
              variant="contained"
              onClick={submitForm}
              component="button"
              type="submit"
            >
              <SaveIcon /> Add this flight
            </Button>
          </Form>
        )}
      </Formik>
    </CenteredModal>
  );
};
