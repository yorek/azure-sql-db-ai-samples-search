import Sample from "../../types/Sample";

export default interface SearchState {
    samples: {
        status: 'idle' | 'loading' | 'succeeded' | 'failed';
        results: Sample[];
        error: string | undefined
    }
}
