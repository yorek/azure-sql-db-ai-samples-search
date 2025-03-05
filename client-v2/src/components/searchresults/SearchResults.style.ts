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
    gap: "10px",
  },
  card: {
    padding: "10px",
    width: "350px",
    height: "280px",
  },
  cardlogo: {
    borderRadius: "4px",
    maxWidth: "44px",
    maxHeight: "44px",
  },
  cardcaption: {
    color: tokens.colorNeutralForeground3,
  },
  tags: {
    display: "flex",
    flexDirection: "row",
    gap: "5px",
    marginBlockStart: "0",
  },
  cardbody: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 4,
    WebkitBoxOrient: "vertical",
    marginBlockStart: "0",
  }
});

export default Styles;