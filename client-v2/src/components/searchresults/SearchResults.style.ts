import { makeStyles } from "@fluentui/react-components";

const Styles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  results: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
  },
});

export default Styles;