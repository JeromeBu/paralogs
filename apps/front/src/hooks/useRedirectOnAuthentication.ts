import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import { authSelectors } from "../selectors/authSelectors";

export const useRedirectOnAuthentication = () => {
  const history = useHistory();
  const location = useLocation();
  const { from } = (location.state as { from: string }) || { from: "/" };
  const [renderCount, setCount] = useState(0);
  const isAuthenticated = useSelector(authSelectors.isAuthenticated);

  useEffect(() => {
    if (renderCount > 0 && isAuthenticated) {
      history.replace(from);
    }
    setCount(renderCount + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
};
