import { FluentProvider, makeStyles, tokens } from "@fluentui/react-components";

import { useSelector, useDispatch } from "react-redux";
import UserState from "./store/slices/userState";

import Toolbar from "./components/toolbar/Toolbar";
import Searchbar from "./components/searchbar/Searchbar";

const useStyles = makeStyles({
  root: {
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: tokens.colorNeutralBackground1,
  }
});

const App = () => {

  const classes = useStyles();
  const user = useSelector((state: { user: UserState }) => state.user);

  return (
    <FluentProvider theme={user.theme}>
      <div className={classes.root}>
        <Toolbar />
        <Searchbar />
      </div>
    </FluentProvider>

  );
}

export default App;
