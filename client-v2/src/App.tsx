import { FluentProvider, makeStaticStyles, makeStyles, tokens } from "@fluentui/react-components";

import { useSelector } from "react-redux";
import UserState from "./store/slices/UserState";

import Toolbar from "./components/toolbar/Toolbar";
import Searchbar from "./components/searchbar/Searchbar";
import SearchResults from "./components/searchresults/SearchResults";

const useStyles = makeStyles({
  root: {
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
  }
});

const globalStyles = makeStaticStyles({
  body: {
    backgroundColor: tokens.colorNeutralBackground6,
    margin: 0,
    padding: 0,
  }
});

const App = () => {

  const classes = useStyles();
  globalStyles();
  const user = useSelector((state: { user: UserState }) => state.user);

  return (
    <FluentProvider theme={user.theme}>
      <div className={classes.root}>
        <Toolbar />
        <Searchbar />
        <SearchResults />
      </div>
    </FluentProvider>

  );
}

export default App;
