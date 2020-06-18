import { UpdateUserDTO, updateUserSchema } from "@paralogs/auth/interface";
import { authActions } from "@paralogs/front-core";
import { Form, Formik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { authSelectors } from "../../selectors/authSelectors";
import { CenteredModal } from "../commun/CenteredModal";
import { InputTextField } from "../commun/form/InputTextField";
import { UIButton } from "../commun/UIButton";

export const UpdateUserModal: React.FC = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(authSelectors.currentUser);
  const isOpen = useSelector(authSelectors.isUpdateFormVisible);
  if (!currentUser) return null;

  const close = () => dispatch(authActions.hideUpdateForm());

  const initialValues: UpdateUserDTO = {
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
  };

  return (
    <CenteredModal open={isOpen} onClose={close}>
      <Formik
        onSubmit={(values) => {
          dispatch(authActions.updateUserRequested(values));
          close();
        }}
        initialValues={initialValues}
        validationSchema={updateUserSchema}
      >
        <Form>
          <InputTextField name="firstName" label="First name" />
          <InputTextField name="lastName" label="Last name" />
          <UIButton type="submit">Update user</UIButton>
        </Form>
      </Formik>
    </CenteredModal>
  );
};
