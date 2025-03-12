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
        "@media(max-width: 768px)": {
            fontSize: tokens.fontSizeBase600,
        },
    },
    subtitle: {
        textAlign: "center",
        padding: "16px",
        fontWeight: "normal",
        "@media(max-width: 768px)": {
            fontSize: tokens.fontSizeBase500,
            padding: "0",
        },
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
    buttonsWrapper: {
        display: "flex",
        gap: "16px",
    },
    link : {
        fontWeight: "bold",
        fontSize: tokens.fontSizeBase400,
    }
});

export default Styles;