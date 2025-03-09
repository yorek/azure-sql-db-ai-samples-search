import Sample from "../../types/Sample";
import SearchResults from "../../types/SearchResults";

export default interface SearchState {
    samples: {
        status: 'idle' | 'loading' | 'succeeded' | 'failed';
        results: Sample[];
        error: string | undefined
    }
}
