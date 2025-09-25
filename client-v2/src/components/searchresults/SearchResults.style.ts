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
  footer: {   
    position: "fixed",
    bottom: "0",
    left: "0",
    right: "0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "1000",
    textAlign: "center",
  },
  footerText: {
    fontSize: "12px",
    fontWeight: "normal",
    margin: "0",
    color: "#666",
  }
});

export default Styles;