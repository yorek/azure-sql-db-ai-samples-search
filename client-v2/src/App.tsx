import { makeStyles } from "@fluentui/react-components";
import Toolbar from "./components/toolbar/Toolbar";

const useStyles = makeStyles({
  root: {
    margin: 0,
    padding: 0,
  }});

const App = () => {

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Toolbar />
    </div>
  );
}

export default App;
