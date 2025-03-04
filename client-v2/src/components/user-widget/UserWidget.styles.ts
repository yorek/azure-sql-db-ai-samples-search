import { makeStyles } from "@fluentui/react-components";

// custom styles
const Styles = makeStyles({
    avatar: {
        cursor: "pointer",
        display: "flex",
        flexWrap: "nowrap",
        alignItems: "center",
        justifyContent: "space-between"
    },
    menu: {
        width: "240px",
        display: "flex",
        flexWrap: "nowrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        marginBottom: "16px"
    },
    menuOpen: {
        padding: "8px",
        display: "flex",
        justifyContent: "space-between",
        gap: "12px"
    }
});

export default Styles;