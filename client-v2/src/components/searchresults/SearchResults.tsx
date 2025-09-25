import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

import { Spinner, Subtitle2 } from "@fluentui/react-components";

import Styles from "./SearchResults.style";
import SearchCard from "./SearchCard";

const SearchResults = () => {

    const classes = Styles();

    const search = useSelector((state: RootState) => state.search);

    return (
        <div className={classes.root}>
            {/* 
                Display a loading spinner while the search is in progress.
            */}
            {(search.samples.status === 'loading') &&
                <>
                    <Spinner style={{ margin: "30px 0 10px" }} />
                    <Subtitle2 style={{ fontWeight: "normal", textAlign: "center", margin: "10px 0" }}>
                        Searching for relevant results ...
                    </Subtitle2>
                </>
            }
            {/* 
                Search results stats.
            */}
            {search.samples.status === 'succeeded' &&
                <Subtitle2 style={{ fontWeight: "normal", textAlign: "center", margin: "10px 0" }}></Subtitle2>
            }
            {/* 
                Search results stats.
            */}
            {search.samples.status === 'failed' &&
                <Subtitle2 style={{ fontWeight: "normal", textAlign: "center", margin: "10px 0" }}>
                    An error occurred: <strong>{search.samples.error}</strong>.<br />
                    Please try again.
                </Subtitle2>
            }
            {/* 
                Display search results.
            */}
            {search.samples.results.length !== undefined && search.samples.results.length > 0 &&
                < div className={classes.results}>
                    {search.samples.status === 'succeeded' && search.samples.results.map((sample) => (
                        <SearchCard key={sample.id} sample={sample} />
                    ))}
                </div>
            }
            {/* 
                Search results stats - always at bottom.
            */}
            <div className={classes.footer}>
                {search.samples.status === 'succeeded' &&
                    <Subtitle2 className={classes.footerText}>                        
                        Returned <strong>{search.samples.results.length}</strong> samples.&nbsp;
                        Commit date: {__COMMIT_DATE__}, Commit hash: {__COMMIT_HASH__}
                    </Subtitle2>}
            </div>
        </div >
    );
};

export default SearchResults;

