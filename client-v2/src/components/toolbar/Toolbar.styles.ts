import { makeStyles, tokens } from "@fluentui/react-components";

// custom styles
const Styles = makeStyles({
    root: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        height: "48px",
        backgroundColor: tokens.colorNeutralBackground1,
        borderBottom: "1px solid " + tokens.colorNeutralStroke1,
        position: "sticky",
        top: 0,
        zIndex: 1000,
    },

    image: {
        padding: "8px",
        height: "24px",
    },
    imageMobile: {
        height: "36px",
    }
});

export default Styles;