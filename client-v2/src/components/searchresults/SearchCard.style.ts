import { makeStyles, tokens } from "@fluentui/react-components";

const Styles = makeStyles({
    card: {
        padding: "10px",
        width: "calc((100vw / 3) - 20px)",
        maxWidth: "500px",
        minWidth: "350px",
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
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        marginBlockStart: "0",
    },
    cardbodyExpand: {
        marginBlockStart: "0",
        height: "350px",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineClamp: 10,
        overflow: "auto",
        WebkitBoxOrient: "vertical",
        animationIterationCount: '1',
        animationDuration: '0.5s',
        animationName: {
            from: { height: '210px' },
            to: { height: '350px' },
        },
    },
});

export default Styles;