import { makeStyles, tokens } from "@fluentui/react-components";

const Style = makeStyles({
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
        error: {
            color: tokens.colorPaletteRedForeground1
        }
});

export default Style;