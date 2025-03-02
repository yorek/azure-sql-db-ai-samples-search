
import { 
    
    makeStyles,
    tokens 
} from "@fluentui/react-components";
import UserWidget from "../user-widget/UserWidget";

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
            
            <UserWidget />
        </div>
    );
};

export default Toolbar;