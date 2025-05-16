import { makeStyles } from "@fluentui/react-components";

// custom styles
const Styles = makeStyles({
    authBox: {
        display: "flex", gap: "16px"
    },
    avatar: {
        cursor: "pointer",
        display: "flex",
        flexWrap: "nowrap",
        alignItems: "center",
        justifyContent: "space-between"
    },
    menu: {
        width: "100%",
        display: "flex",
        flexWrap: "nowrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        marginBottom: "16px",
    },
    menuOpen: {
        padding: "8px",
        display: "flex",
        justifyContent: "space-between",
        gap: "12px"
    },
    menuOpenHeader: {
        display: "flex",
        flexDirection: "column",
        gap: "4px"
    }
});

export default Styles;