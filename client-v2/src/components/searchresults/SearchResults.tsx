import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

import { Spinner, Subtitle2 } from "@fluentui/react-components";

import Styles from "./SearchResults.style";
import SearchCard from "./SearchCard";
import LightSampleCard from "./LightSampleCard";

const SearchResults = () => {

    const classes = Styles();

    const search = useSelector((state: RootState) => state).search;
    const home = useSelector((state: RootState) => state).home;

    return (
        <div className={classes.root}>
            {/* 
                Display a loading spinner while the search is in progress.
            */}
            {(search.status === 'loading'
                || home.latestSamples.status === 'loading'
            ) &&
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
            {search.status === 'succeeded' &&
                <Subtitle2 style={{ fontWeight: "normal", textAlign: "center", margin: "10px 0" }}>
                    Your query returned <strong>{search.results?.limit}</strong> results out of <strong>{search.results?.total}</strong> total.
                </Subtitle2>
            }
            {home.latestSamples.status === 'succeeded' &&
                <Subtitle2 style={{ fontWeight: "normal", textAlign: "center", margin: "10px 0" }}>
                    Here you can find the TOP <strong>{home.latestSamples.records.length}</strong> results.
                </Subtitle2>
            }
            {/* 
                Display search results.
            */}
            {search.results?.posts.length !== undefined && search.results?.posts.length > 0 &&
                < div className={classes.results}>
                    {search.status === 'succeeded' && search.results?.posts.map((article) => (
                        <SearchCard key={article.id} article={article} />
                    ))}
                    {search.status === 'failed' && <h2>{search.error}</h2>}
                </div>
            }
            {home.latestSamples.records.length !== undefined && home.latestSamples.records.length > 0 &&
                <div className={classes.results}>
                    {home.latestSamples.status === 'succeeded' && home.latestSamples.records.map((sample) => (
                        <LightSampleCard key={sample.id} sample={sample} />
                    ))}
                    {home.latestSamples.status === 'failed' && <h2>{home.latestSamples.errror}</h2>}
                </div>

            }
        </div >
    );
};

export default SearchResults;

