import { makeStyles, tokens } from "@fluentui/react-components";

const Style = makeStyles({
  dialog: {
    maxWidth: "800px",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  content: {
    margin: "0 10px",
  },
  tags: {
    margin: "0 10px",
    borderTop: "1px solid #e1e1e1",
    paddingTop: "15px",
  },
  description: {
    fontWeight: "normal",
    fontSize: tokens.fontSizeBase400
  },
  notes: {
    fontWeight: "normal",   
    fontSize: tokens.fontSizeBase400
  },  
  link: {
    fontSize: tokens.fontSizeBase400,
    textOverflow: "ellipsis",
    overflow: "hidden",
  }
});

export default Style;