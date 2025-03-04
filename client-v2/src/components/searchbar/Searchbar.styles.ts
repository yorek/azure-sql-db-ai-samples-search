import { makeStyles, tokens } from "@fluentui/react-components";

const Styles = makeStyles({
    root: {
        margin: 0,
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: tokens.colorBrandBackground2,
        gap: "16px",
        alignItems: "center",
    },
    title: {
        textAlign: "center",
        padding: "16px",
    },
    subtitle: {
        textAlign: "center",
        padding: "16px",
        fontWeight: "normal",
    },
    fieldWrapper: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        "@media(min-width: 768px)": {
            flexDirection: "row"
        },
        gap: "16px",
        padding: `${tokens.spacingVerticalMNudge} ${tokens.spacingHorizontalMNudge}`,
    },
    link : {
        fontWeight: "bold",
        fontSize: tokens.fontSizeBase400,
    }
});

export default Styles;