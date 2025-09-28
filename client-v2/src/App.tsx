import { FluentProvider, 
  makeStaticStyles, 
  makeStyles, 
  webLightTheme,
  webDarkTheme, 
  tokens } from "@fluentui/react-components";

import { useSelector } from "react-redux";
import UserState from "./store/slices/UserState";

import Toolbar from "./components/toolbar/Toolbar";
import Searchbar from "./components/searchbar/Searchbar";
import SearchResults from "./components/searchresults/SearchResults";
import Footer from "./components/footer/Footer";

const useStyles = makeStyles({
  root: {
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: tokens.colorNeutralBackground3,
  },
  content: {
    flex: "1 0 auto",
    display: "flex",
    flexDirection: "column",
  }
});

const globalStyles = makeStaticStyles({
  html: {
    margin: 0,
    padding: 0,
  },
  body: {
    margin: 0,
    padding: 0,
  }
});

const App = () => {

  const classes = useStyles();
  globalStyles();
  const user = useSelector((state: { user: UserState }) => state.user);

  return (
    <FluentProvider theme={user.theme === "light" ? webLightTheme : webDarkTheme}>
      <div className={classes.root}>
        <div className={classes.content}>
          <Toolbar />
          <Searchbar />
          <SearchResults />
        </div>
        <Footer />
      </div>
    </FluentProvider>

  );
}

export default App;
