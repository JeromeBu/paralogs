import TextField from "@material-ui/core/TextField";
import { useField } from "formik";
import React from "react";

interface InputTextFieldProps {
  name: string;
  label: string;
  type?: string;
  className?: string;
}

export const InputTextField: React.FC<InputTextFieldProps> = (props) => {
  const [field, { touched, error }] = useField({ name: props.name });

  return (
    <TextField
      {...props}
      margin="normal"
      fullWidth
      id={props.name}
      {...field}
      error={touched && error != null}
      helperText={touched && error}
    />
  );
};
