
import { 
    Avatar,
    Title3,
    makeStyles,
    tokens 
} from "@fluentui/react-components";

const useStyles = makeStyles({
    root: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        height: "48px",
        backgroundColor: tokens.colorNeutralBackground1,
        borderBottom: "1px solid " + tokens.colorNeutralStroke1,
    },
    title: {
        fontWeight: "lighter",
        color: tokens.colorNeutralForeground1,
    },

    image: {
        padding: "8px",
        width: "48px",
    }
});

const Toolbar = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <img src={process.env.PUBLIC_URL + "/MS-icon.png"} alt="logo" className={classes.image}/>
            <Title3 className={classes.title}>Azure SQL Sample Search with AI</Title3>
            <Avatar name="Raffaele Garofalo" badge={{ status: "available" }} />
        </div>
    );
};

export default Toolbar;