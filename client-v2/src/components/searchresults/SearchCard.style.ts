import { makeStyles, tokens } from "@fluentui/react-components";

const Styles = makeStyles({
    card: {
        padding: "10px",
        width: "350px",
        animationIterationCount: '1',
        animationDuration: '0.5s',
        animationName: {
            from: { opacity: '0' },
            to: { opacity: '1' },
        },
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
    },
    cardbodyExpand: {
        marginBlockStart: "0",
        height: "320px",
        animationIterationCount: '1',
        animationDuration: '0.5s',
        animationName: {
            from: { height: '200px' },
            to: { height: '320px' },
        },
    },
});

export default Styles;