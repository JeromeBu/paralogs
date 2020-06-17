import Button from "@material-ui/core/Button";
import React from "react";

export const UIButton: React.FC<{ type?: "submit"; className?: string }> = ({
  children,
  type,
  className,
}) => (
  <Button
    type={type}
    className={className}
    fullWidth
    variant="contained"
    color="primary"
  >
    {children}
  </Button>
);
