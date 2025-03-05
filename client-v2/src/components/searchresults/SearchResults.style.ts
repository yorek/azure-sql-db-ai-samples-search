import { makeStyles, tokens } from "@fluentui/react-components";

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
  },
  result: {
    margin: "10px",
    padding: "10px",
    width: "350px",
    height: "200px",
  },
  cardlogo: {
    borderRadius: "4px",
    maxWidth: "44px",
    maxHeight: "44px",
  },
  cardcaption: {
    color: tokens.colorNeutralForeground3,
  },
  cardbody: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
  }
});

export default Styles;