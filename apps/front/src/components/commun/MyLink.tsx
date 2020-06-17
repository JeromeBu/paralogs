import MuiLink from "@material-ui/core/Link";
import { Variant } from "@material-ui/core/styles/createTypography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";

const Link1 = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(
  (props, ref) => <RouterLink innerRef={ref} {...props} />,
);

const useStyle = makeStyles({
  link: {
    "&:hover": { opacity: "0.7" },
    transition: "0.3s",
  },
});

export const MyLink: React.FC<{
  to: string;
  variant?: Variant;
  className?: string;
}> = ({ children, to, variant, className }) => {
  const classes = useStyle();

  return (
    <MuiLink
      color="inherit"
      component={Link1}
      to={to}
      variant={variant}
      className={`${classes.link} ${className}`}
      underline="none"
    >
      {children}
    </MuiLink>
  );
};
