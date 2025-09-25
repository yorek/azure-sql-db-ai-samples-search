import { makeStyles, tokens } from "@fluentui/react-components";

const Styles = makeStyles({
    root: {
        margin: 0,
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: tokens.colorBrandBackground2,
        gap: "0px",
        alignItems: "center",
    },
    title: {
        textAlign: "center",
        padding: "12px",
        "@media(max-width: 768px)": {
            fontSize: tokens.fontSizeBase600,
            padding: "0",
        },
    },
    subtitle: {
        textAlign: "center",
        padding: "12x",
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