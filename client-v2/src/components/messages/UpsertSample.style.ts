import { makeStyles, tokens } from "@fluentui/react-components";

const Styles = makeStyles({
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    error: {
        color: tokens.colorPaletteRedForeground1
    },
    dialogSurface: {
        width: '50vw',
        maxWidth: '50vw'
    }
});

export default Styles;