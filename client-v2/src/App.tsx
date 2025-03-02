import { FluentProvider, makeStyles } from "@fluentui/react-components";

import { useSelector, useDispatch } from "react-redux";
import UserState from "./store/slices/userState";

import Toolbar from "./components/toolbar/Toolbar";

const useStyles = makeStyles({
  root: {
    margin: 0,
    padding: 0,
  }
});

const App = () => {

  const classes = useStyles();
  const user = useSelector((state: { user: UserState }) => state.user);

  return (
    <FluentProvider theme={user.theme}>
      <div className={classes.root}>
        <Toolbar />
      </div>
    </FluentProvider>

  );
}

export default App;
