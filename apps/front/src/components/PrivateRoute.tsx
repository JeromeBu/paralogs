import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, RouteProps } from "react-router-dom";

import { authSelectors } from "../selectors/authSelectors";

// For now we only use the prop 'component' we may need render (or children) in the futur
export const PrivateRoute: React.FC<{
  component: NonNullable<RouteProps["component"]>;
  path: string;
}> = ({ path, component }) => {
  const isAuthenticated = useSelector(authSelectors.isAuthenticated);

  return (
    <Route
      path={path}
      render={({ location }) =>
        isAuthenticated ? (
          React.createElement(component)
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
