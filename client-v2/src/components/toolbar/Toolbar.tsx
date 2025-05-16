import UserWidget from "../user-widget/UserWidget";
import Styles from "./Toolbar.styles";

const Toolbar = () => {
    const classes = Styles();
    return (
        <div className={classes.root}>
            {window.innerWidth < 640 && 
                <img src={process.env.PUBLIC_URL + "/favicon.png"} alt="logo" className={classes.imageMobile}/>
            }
            {window.innerWidth >= 640 && 
                <img src={process.env.PUBLIC_URL + "/MS-logo-horizontal.png"} alt="logo" className={classes.image}/>
            }
            <UserWidget />
        </div>
    );
};

export default Toolbar;