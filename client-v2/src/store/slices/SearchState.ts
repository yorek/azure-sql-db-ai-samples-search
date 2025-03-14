import Sample from "../../types/Sample";

export default interface SearchState {
    samples: {
        status: 'idle' | 'loading' | 'succeeded' | 'failed';
        results: Sample[];
        error: string | undefined
    },
    delete: {
        status: 'idle' | 'loading' | 'succeeded' | 'failed';
        error: string | undefined
    },
    totalSamples: {
        status: 'idle' | 'loading' | 'succeeded' | 'failed';
        error: string | undefined;
        total: number;
    }; 
}
