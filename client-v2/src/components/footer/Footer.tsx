import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Styles from "./Footer.style";

const Footer = () => {
    const classes = Styles();
    const search = useSelector((state: RootState) => state.search);
    
    return (
        <div className={classes.footer}>
            {search.samples.status === 'succeeded' &&
            <div className={classes.footerText}>                        
                Returned <strong>{search.samples.results.length}</strong> samples.&nbsp;
                Commit date: {__COMMIT_DATE__ || 'unknown'}, Commit hash: {__COMMIT_HASH__ || 'unknown'}
            </div>}
        </div>
    );
};

export default Footer;