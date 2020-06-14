import { Theme } from "@material-ui/core/styles/createMuiTheme";

export const roundButtonStyle = (theme: Theme) => ({
  roundButton: {
    margin: theme.spacing(1),
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
});
