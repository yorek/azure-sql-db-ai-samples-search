import { makeStyles, tokens } from "@fluentui/react-components";

const Style = makeStyles({
  dialog: {
    maxWidth: "800px",
  },
  details: {
    display: "flex",
    flexDirection: "row",
  },
  left: {
    margin: "0 10px",

  },
  right: {
    width: "min(15em, 100%)"
  },
  description: {
    fontWeight: "normal",
    fontSize: tokens.fontSizeBase400
  },
  notes: {
    fontWeight: "normal",
    fontStyle: "italic",
    fontSize: tokens.fontSizeBase300
  },  
  link: {
    fontSize: tokens.fontSizeBase400,
    textOverflow: "ellipsis",
    overflow: "hidden",
  }
});

export default Style;