import Article from "../../types/Article";
import SearchResults from "../../types/SearchResults";

export default interface SearchState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    results: SearchResults | undefined;
    error: string | undefined;
}
