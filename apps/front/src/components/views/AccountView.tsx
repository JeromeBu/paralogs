import Box from "@material-ui/core/Box";
import EditIcon from "@material-ui/icons/Edit";
import { authActions } from "@paralogs/front-core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { pilotSelector } from "../../selectors/pilotSelector";
import { UpdateUserModal } from "../user/UpdateUserModal";

export const AccountView: React.FC = () => {
  const pilot = useSelector(pilotSelector);
  const dispatch = useDispatch();

  return pilot ? (
    <Box padding={2}>
      <h6>This is account view component</h6>
      <p>First name : {pilot.firstName}</p>
      <p>Last name : {pilot.lastName}</p>
      <EditIcon onClick={() => dispatch(authActions.showUpdateForm())} />
      <UpdateUserModal />
    </Box>
  ) : (
    <div>No current user</div>
  );
};
