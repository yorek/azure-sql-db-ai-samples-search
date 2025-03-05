import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

import { Spinner, Subtitle2 } from "@fluentui/react-components";

import Styles from "./SearchResults.style";
import SearchCard from "./SearchCard";

const SearchResults = () => {

    const classes = Styles();

    const results = useSelector((state: RootState) => state).search;

    return (
        <div className={classes.root}>
            {results.status === 'loading' &&
                <Spinner style={{ marginTop: "10px" }} />
            }
            {results.status === 'succeeded' &&
                <Subtitle2 style={{ fontWeight: "normal", textAlign: "center", marginTop: "10px" }}>
                    Your query returned <strong>{results.results?.limit}</strong> results out of <strong>{results.results?.total}</strong> total.
                </Subtitle2>
            }
            <div className={classes.results}>
                {results.status === 'succeeded' && results.results?.posts.map((article) => (
                    <SearchCard key={article.id} article={article} />
                ))}
                {results.status === 'failed' && <h2>{results.error}</h2>}
            </div>
        </div>
    );
};

export default SearchResults;

